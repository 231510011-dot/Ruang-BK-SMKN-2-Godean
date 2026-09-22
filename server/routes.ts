import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { AuthenticatedRequest, generateToken, requireAuth, requireGuruBK } from './auth';
import { MaterialCategory, UrgencyLevel, ConsultationStatus, CounselingMode, ScheduleStatus } from './types';

const router = Router();

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================

router.post('/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi.' });
    }

    const user = db.getUserByUsername(username.trim());
    if (!user) {
      return res.status(401).json({ error: 'Username atau password tidak sesuai.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password tidak sesuai.' });
    }

    const token = generateToken(user);

    db.logActivity(`Login ke sistem sebagai ${user.role === 'guru_bk' ? 'Guru BK' : 'Siswa'}`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        nis: user.nis,
        class: user.class,
        major: user.major,
        avatar_url: user.avatar_url,
        must_change_password: user.must_change_password,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
});

router.post('/auth/register-siswa', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, username, password, nis, className, major } = req.body;

    if (!name || !username || !password || !className) {
      return res.status(400).json({ error: 'Mohon lengkapi Nama, Username, Password, dan Kelas.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    if (db.getUserByUsername(cleanUsername)) {
      return res.status(400).json({ error: 'Username sudah digunakan, silakan pilih username lain.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = db.addUser({
      id: 'user-siswa-' + Date.now(),
      name: name.trim(),
      username: cleanUsername,
      password_hash,
      role: 'siswa',
      nis: nis ? nis.trim() : undefined,
      class: className.trim(),
      major: major ? major.trim() : 'SMK',
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + (db.getUsers().length % 5)}?w=150&auto=format&fit=crop&q=80`,
      must_change_password: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const token = generateToken(newUser);

    db.logActivity(`Registrasi akun siswa baru: ${newUser.name} (${newUser.class})`, {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
    });

    return res.status(201).json({
      message: 'Pendaftaran siswa berhasil.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        nis: newUser.nis,
        class: newUser.class,
        major: newUser.major,
        avatar_url: newUser.avatar_url,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mendaftarkan siswa.' });
  }
});

router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    nis: user.nis,
    class: user.class,
    major: user.major,
    avatar_url: user.avatar_url,
    must_change_password: user.must_change_password,
  });
});

router.post('/auth/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
    }

    // If it's the initial password change, we can verify or allow direct change
    if (currentPassword) {
      const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Password saat ini tidak cocok.' });
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    db.updateUser(user.id, {
      password_hash: newHash,
      must_change_password: false,
    });

    db.logActivity('Mengubah kata sandi akun', {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.json({ message: 'Kata sandi berhasil diperbarui.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengubah kata sandi.' });
  }
});

router.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  db.logActivity('Logout dari sistem', {
    id: req.user!.id,
    name: req.user!.name,
    role: req.user!.role,
  });
  return res.json({ message: 'Logout berhasil' });
});

// ==========================================
// 2. MATERI BK
// ==========================================

router.get('/materials', (req: AuthenticatedRequest, res: Response) => {
  const { category, search } = req.query;
  const materials = db.getMaterials(category as string, search as string);
  return res.json(materials);
});

router.get('/materials/:id', (req: AuthenticatedRequest, res: Response) => {
  const material = db.getMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Materi tidak ditemukan.' });
  }
  return res.json(material);
});

router.post('/materials', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, description, content, image, video_url, quiz_data, reflection_prompt } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Judul, kategori, dan isi materi wajib diisi.' });
    }

    const validCategories: MaterialCategory[] = ['BK Pribadi', 'BK Sosial', 'BK Belajar', 'BK Karier'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Kategori materi tidak valid.' });
    }

    const newMaterial = db.addMaterial({
      id: 'mat-' + Date.now(),
      title: title.trim(),
      category,
      description: description || '',
      content: content.trim(),
      image: image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      video_url: video_url || '',
      quiz_data: quiz_data || [],
      reflection_prompt: reflection_prompt || '',
      read_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Guru BK menambah materi baru: "${newMaterial.title}" (${newMaterial.category})`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.status(201).json(newMaterial);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal menambahkan materi.' });
  }
});

router.put('/materials/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateMaterial(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Materi tidak ditemukan.' });
    }

    db.logActivity(`Guru BK memperbarui materi: "${updated.title}"`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal memperbarui materi.' });
  }
});

router.delete('/materials/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const mat = db.getMaterialById(req.params.id);
  const deleted = db.deleteMaterial(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Materi tidak ditemukan.' });
  }

  db.logActivity(`Guru BK menghapus materi: "${mat?.title || req.params.id}"`, {
    id: req.user!.id,
    name: req.user!.name,
    role: req.user!.role,
  });

  return res.json({ message: 'Materi berhasil dihapus.' });
});

router.post('/materials/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.incrementMaterialRead(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Materi tidak ditemukan.' });
  }

  db.logActivity(`Siswa membaca materi: "${updated.title}"`, {
    id: req.user!.id,
    name: req.user!.name,
    role: req.user!.role,
  });

  return res.json(updated);
});

// ==========================================
// 3. SELF-ASSESSMENT
// ==========================================

router.get('/assessments', (req: AuthenticatedRequest, res: Response) => {
  const assessments = db.getAssessments();
  return res.json(assessments);
});

router.get('/assessments/:id', (req: AuthenticatedRequest, res: Response) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment tidak ditemukan.' });
  }
  return res.json(assessment);
});

router.post('/assessments/submit', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { assessment_id, answers } = req.body;
    const user = req.user!;

    if (!assessment_id || !answers) {
      return res.status(400).json({ error: 'Data assessment dan jawaban wajib dikirimkan.' });
    }

    const assessment = db.getAssessmentById(assessment_id);
    if (!assessment) {
      return res.status(404).json({ error: 'Instrumen assessment tidak ditemukan.' });
    }

    // Calculate score
    const questions = assessment.questions;
    let totalScore = 0;
    const maxScore = questions.length * 5;

    for (const q of questions) {
      const val = Number(answers[q.id]) || 3;
      totalScore += Math.max(1, Math.min(5, val));
    }

    const percentage = Number(((totalScore / maxScore) * 100).toFixed(1));

    let interpretation = '';
    const recommendations: string[] = [];

    if (percentage >= 80) {
      interpretation = `Luar biasa! Skor Anda berada pada tingkat Sangat Baik (${percentage}%). Anda memiliki pemahaman, kesiapan, dan kebiasaan positif yang solid pada aspek ${assessment.category}.`;
      recommendations.push('Pertahankan konsistensi kebiasaan positif dan tularkan semangat kepada teman sekelas.');
      recommendations.push('Tingkatkan target capaian dengan membaca materi BK tingkat lanjut.');
    } else if (percentage >= 60) {
      interpretation = `Cukup Baik (${percentage}%). Anda sudah berada di jalur yang tepat dalam aspek ${assessment.category}, namun masih terdapat beberapa celah yang perlu dioptimalkan.`;
      recommendations.push(`Fokus pada pertanyaan dengan nilai terendah dan buat langkah perbaikan di menu Jurnal Refleksi.`);
      recommendations.push(`Pelajari materi terkait di menu Materi BK kategori relevan.`);
    } else {
      interpretation = `Perlu Perhatian & Bimbingan (${percentage}%). Skor Anda mengindikasikan adanya kendala pada aspek ${assessment.category} yang memerlukan pendampingan.`;
      recommendations.push('Sangat disarankan untuk melakukan konsultasi santai dengan Guru BK di Ruang BK.');
      recommendations.push('Baca materi dasar dan mulailah dengan langkah perubahan kecil setiap hari.');
    }

    const newResult = db.addAssessmentResult({
      id: 'res-' + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_class: user.class,
      assessment_id: assessment.id,
      assessment_title: assessment.title,
      score: totalScore,
      max_score: maxScore,
      percentage,
      interpretation,
      recommendations,
      answers,
      created_at: new Date().toISOString(),
    });

    db.logActivity(`Menyelesaikan ${assessment.title} (Skor: ${totalScore}/${maxScore} - ${percentage}%)`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.status(201).json(newResult);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal menyimpan hasil assessment.' });
  }
});

router.get('/assessment-results', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'guru_bk') {
    // Guru BK can view all results
    return res.json(db.getAssessmentResults());
  } else {
    // Siswa only sees their own results
    return res.json(db.getAssessmentResults(user.id));
  }
});

// ==========================================
// 4. KONSULTASI / KOTAK CURHAT
// ==========================================

router.get('/consultations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'guru_bk') {
    return res.json(db.getConsultations());
  } else {
    // Siswa sees only their own consultations
    return res.json(db.getConsultations(user.id));
  }
});

router.get('/consultations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const consultation = db.getConsultationById(req.params.id);
  if (!consultation) {
    return res.status(404).json({ error: 'Konsultasi tidak ditemukan.' });
  }

  // Privacy check: only the student or guru_bk can view
  if (req.user!.role !== 'guru_bk' && consultation.user_id !== req.user!.id) {
    return res.status(403).json({ error: 'Akses ditolak. Anda tidak memiliki izin untuk melihat konsultasi ini.' });
  }

  return res.json(consultation);
});

router.post('/consultations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, message, urgency, is_anonymous } = req.body;
    const user = req.user!;

    if (!topic || !message) {
      return res.status(400).json({ error: 'Topik dan isi pesan konsultasi wajib diisi.' });
    }

    const validUrgencies: UrgencyLevel[] = ['rendah', 'sedang', 'tinggi', 'darurat'];
    const chosenUrgency: UrgencyLevel = validUrgencies.includes(urgency) ? urgency : 'sedang';

    const newConsultation = db.addConsultation({
      id: 'con-' + Date.now(),
      user_id: user.id,
      user_name: is_anonymous ? 'Siswa SMKN 2 Godean (Anonim)' : user.name,
      user_class: user.class,
      topic: topic.trim(),
      message: message.trim(),
      urgency: chosenUrgency,
      status: 'Terkirim',
      is_anonymous: Boolean(is_anonymous),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Siswa mengirim konsultasi: "${newConsultation.topic}" (${chosenUrgency})`, {
      id: user.id,
      name: is_anonymous ? 'Anonim' : user.name,
      role: user.role,
    });

    return res.status(201).json(newConsultation);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengirim konsultasi.' });
  }
});

router.put('/consultations/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, response, follow_up_notes } = req.body;

    const existing = db.getConsultationById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Konsultasi tidak ditemukan.' });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (response !== undefined) {
      updates.response = response;
      updates.responded_at = new Date().toISOString();
      if (!status || status === 'Terkirim' || status === 'Dibaca Guru BK') {
        updates.status = 'Sudah Ditanggapi';
      }
    }
    if (follow_up_notes !== undefined) updates.follow_up_notes = follow_up_notes;

    const updated = db.updateConsultation(req.params.id, updates);

    db.logActivity(`Guru BK menanggapi konsultasi: "${existing.topic}"`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal memperbarui konsultasi.' });
  }
});

// ==========================================
// 5. BOOKING JADWAL KONSELING
// ==========================================

router.get('/counseling-schedules', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'guru_bk') {
    return res.json(db.getSchedules());
  } else {
    // Siswa sees their own schedules
    const mySchedules = db.getSchedules(user.id);
    // Also include booked slots info (date & time only) so student can see what slots are taken
    const allSchedules = db.getSchedules();
    const takenSlots = allSchedules
      .filter(s => s.status !== 'Ditolak' && s.status !== 'Dibatalkan')
      .map(s => ({ date: s.date, time: s.time }));

    return res.json({
      mySchedules,
      takenSlots,
    });
  }
});

router.post('/counseling-schedules', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, time, service_type, topic, counseling_mode } = req.body;
    const user = req.user!;

    if (!date || !time || !service_type || !topic) {
      return res.status(400).json({ error: 'Mohon lengkapi Tanggal, Waktu, Jenis Layanan, dan Topik.' });
    }

    // Collision check: "Jangan izinkan dua siswa mengambil slot yang sama"
    if (db.isSlotBooked(date, time)) {
      return res.status(400).json({
        error: `Slot jadwal pada tanggal ${date} pukul ${time} sudah dibooking oleh siswa lain. Silakan pilih waktu atau tanggal lain.`,
      });
    }

    const mode: CounselingMode = counseling_mode === 'Online' ? 'Online' : 'Tatap Muka';

    const newSchedule = db.addSchedule({
      id: 'sch-' + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_class: user.class,
      date,
      time,
      service_type: service_type.trim(),
      topic: topic.trim(),
      counseling_mode: mode,
      status: 'Menunggu persetujuan',
      location_or_link: mode === 'Tatap Muka' ? 'Ruang BK SMKN 2 Godean' : 'Tautan Konseling Online BK (Google Meet)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Siswa booking konseling: ${date} (${time})`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.status(201).json(newSchedule);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal membuat jadwal konseling.' });
  }
});

router.put('/counseling-schedules/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, rejection_reason, notes, location_or_link, date, time } = req.body;

    const existing = db.getSchedules().find(s => s.id === req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan.' });
    }

    // If rescheduling, check slot collision
    if (date && time && (date !== existing.date || time !== existing.time)) {
      if (db.isSlotBooked(date, time, existing.id)) {
        return res.status(400).json({ error: 'Slot baru tersebut sudah terisi oleh jadwal lain.' });
      }
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (rejection_reason !== undefined) updates.rejection_reason = rejection_reason;
    if (notes !== undefined) updates.notes = notes;
    if (location_or_link !== undefined) updates.location_or_link = location_or_link;
    if (date) updates.date = date;
    if (time) updates.time = time;

    const updated = db.updateSchedule(req.params.id, updates);

    db.logActivity(`Guru BK memperbarui status jadwal konseling (${status || 'diubah'}) untuk ${existing.user_name}`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal memperbarui jadwal konseling.' });
  }
});

// ==========================================
// 6. JURNAL & REFLEKSI SISWA
// ==========================================

router.get('/journals', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role === 'guru_bk') {
    // Counselor only sees journals explicitly shared by students
    return res.json(db.getJournals(undefined, true));
  } else {
    // Siswa sees their own journals
    return res.json(db.getJournals(user.id, false));
  }
});

router.post('/journals', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mood, title, feeling, problems, actions_taken, improvements, next_goals, is_shared_with_counselor } = req.body;
    const user = req.user!;

    if (!mood || !title || !feeling) {
      return res.status(400).json({ error: 'Mood, Judul, dan Apa yang Anda rasakan wajib diisi.' });
    }

    const newJournal = db.addJournal({
      id: 'jrn-' + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_class: user.class,
      mood,
      title: title.trim(),
      feeling: feeling.trim(),
      problems: problems ? problems.trim() : '',
      actions_taken: actions_taken ? actions_taken.trim() : '',
      improvements: improvements ? improvements.trim() : '',
      next_goals: next_goals ? next_goals.trim() : '',
      is_shared_with_counselor: Boolean(is_shared_with_counselor),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Siswa menulis refleksi jurnal: "${newJournal.title}" (Mood: ${mood})`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.status(201).json(newJournal);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal menyimpan jurnal refleksi.' });
  }
});

router.put('/journals/:id/feedback', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { counselor_feedback } = req.body;
    const updated = db.updateJournal(req.params.id, { counselor_feedback });
    if (!updated) {
      return res.status(404).json({ error: 'Jurnal tidak ditemukan.' });
    }

    db.logActivity(`Guru BK memberikan umpan balik pada jurnal siswa: "${updated.title}"`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengirim umpan balik jurnal.' });
  }
});

// ==========================================
// 7. KARIER & MASA DEPAN
// ==========================================

router.get('/career', (req: AuthenticatedRequest, res: Response) => {
  const { category } = req.query;
  return res.json(db.getCareerContents(category as string));
});

router.post('/career', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, summary, content, tags, source_url } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Judul, kategori, dan konten karier wajib diisi.' });
    }

    const newContent = db.addCareerContent({
      id: 'car-' + Date.now(),
      title: title.trim(),
      category: category.trim(),
      summary: summary || '',
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      source_url: source_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Guru BK menambah artikel karier: "${newContent.title}"`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.status(201).json(newContent);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal menambahkan konten karier.' });
  }
});

router.put('/career/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateCareerContent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Konten karier tidak ditemukan.' });
    }

    db.logActivity(`Guru BK memperbarui informasi karier: "${updated.title}"`, {
      id: req.user!.id,
      name: req.user!.name,
      role: req.user!.role,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal memperbarui konten karier.' });
  }
});

router.delete('/career/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteCareerContent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Konten karier tidak ditemukan.' });
  }
  return res.json({ message: 'Konten karier berhasil dihapus.' });
});

// Career Plan ("Rencana Masa Depanku")
router.get('/career-plan', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const plan = db.getCareerPlan(req.user!.id);
  return res.json(plan || null);
});

router.post('/career-plan', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { main_choice, target_after_grad, target_1_year, target_3_years, skills_needed, action_steps } = req.body;
    const user = req.user!;

    if (!main_choice || !target_after_grad) {
      return res.status(400).json({ error: 'Pilihan utama dan target kelulusan wajib diisi.' });
    }

    const savedPlan = db.saveCareerPlan({
      id: 'plan-' + user.id,
      user_id: user.id,
      main_choice,
      target_after_grad: target_after_grad.trim(),
      target_1_year: (target_1_year || '').trim(),
      target_3_years: (target_3_years || '').trim(),
      skills_needed: (skills_needed || '').trim(),
      action_steps: (action_steps || '').trim(),
      updated_at: new Date().toISOString(),
    });

    db.logActivity(`Siswa memperbarui Rencana Masa Depanku (${main_choice})`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.json(savedPlan);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal menyimpan rencana karier.' });
  }
});

// ==========================================
// 8. TOMBOL "SAYA BUTUH BANTUAN" (EMERGENCY)
// ==========================================

router.post('/emergency-assistance', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, notes } = req.body;
    const user = req.user!;

    if (!category) {
      return res.status(400).json({ error: 'Kategori bantuan wajib dipilih.' });
    }

    const reqItem = db.addAssistanceRequest({
      id: 'ast-' + Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_class: user.class,
      category,
      notes: notes || '',
      status: 'Perlu Ditangani Segera',
      created_at: new Date().toISOString(),
    });

    db.logActivity(`🚨 PERMINTAAN BANTUAN SEGERA dari ${user.name} (${user.class}): ${category}`, {
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res.status(201).json({
      message: 'Permintaan bantuan telah terkirim kepada Guru BK SMKN 2 Godean.',
      data: reqItem,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Gagal mengirimkan permintaan bantuan.' });
  }
});

router.get('/emergency-assistance', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getAssistanceRequests());
});

router.put('/emergency-assistance/:id', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const updated = db.updateAssistanceRequest(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Permintaan bantuan tidak ditemukan.' });
  }
  return res.json(updated);
});

// ==========================================
// 9. ADMIN DASHBOARD & STATISTIK PENGGUNAAN
// ==========================================

router.get('/admin/statistics', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const { filter } = req.query; // 'hari' | 'minggu' | 'bulan' | 'semester'

  const allUsers = db.getUsers();
  const students = allUsers.filter(u => u.role === 'siswa');
  const materials = db.getMaterials();
  const assessments = db.getAssessments();
  const assessmentResults = db.getAssessmentResults();
  const consultations = db.getConsultations();
  const schedules = db.getSchedules();
  const journals = db.getJournals(undefined, false);
  const logs = db.getActivityLogs(200);

  // Time filter logic
  let cutoffMs = Date.now() - 30 * 24 * 3600 * 1000; // default 30 days
  if (filter === 'hari') {
    cutoffMs = Date.now() - 24 * 3600 * 1000;
  } else if (filter === 'minggu') {
    cutoffMs = Date.now() - 7 * 24 * 3600 * 1000;
  } else if (filter === 'semester') {
    cutoffMs = Date.now() - 180 * 24 * 3600 * 1000;
  }

  const filteredLogs = logs.filter(l => new Date(l.created_at).getTime() >= cutoffMs);
  const activeStudentIds = new Set(filteredLogs.filter(l => l.role === 'siswa' && l.user_id).map(l => l.user_id));

  // Today's schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const schedulesToday = schedules.filter(s => s.date === todayStr);

  // Pending consultations
  const pendingConsultations = consultations.filter(
    c => c.status === 'Terkirim' || c.status === 'Dibaca Guru BK' || c.status === 'Dalam Proses'
  );

  // Materials most and least read
  const sortedMaterials = [...materials].sort((a, b) => (b.read_count || 0) - (a.read_count || 0));
  const topReadMaterials = sortedMaterials.slice(0, 5);
  const leastReadMaterials = [...sortedMaterials].reverse().slice(0, 5);

  // Category counts
  const categoryCount: Record<string, number> = {
    'BK Pribadi': 0,
    'BK Sosial': 0,
    'BK Belajar': 0,
    'BK Karier': 0,
  };
  materials.forEach(m => {
    if (categoryCount[m.category] !== undefined) {
      categoryCount[m.category] += (m.read_count || 1);
    }
  });

  return res.json({
    summary: {
      totalStudents: students.length,
      activeStudents: activeStudentIds.size || students.length,
      totalMaterials: materials.length,
      totalAssessmentsCompleted: assessmentResults.length,
      totalConsultations: consultations.length,
      pendingConsultations: pendingConsultations.length,
      totalSchedules: schedules.length,
      schedulesToday: schedulesToday.length,
      totalJournals: journals.length,
      urgentAssistanceCount: db.getAssistanceRequests().filter(a => a.status === 'Perlu Ditangani Segera').length,
    },
    topMaterials: topReadMaterials,
    leastMaterials: leastReadMaterials,
    categoryDistribution: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
    recentActivities: logs.slice(0, 20),
    todaySchedulesList: schedulesToday,
    urgentAssistanceList: db.getAssistanceRequests().slice(0, 10),
  });
});

router.get('/admin/users', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role,
    nis: u.nis,
    class: u.class,
    major: u.major,
    created_at: u.created_at,
  }));
  return res.json(users);
});

// CSV Export
router.get('/admin/export-csv', requireGuruBK, (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.query; // 'consultations' | 'schedules' | 'assessments' | 'logs'
  let csv = '';
  let filename = 'export-bk-smkn2godean.csv';

  if (type === 'consultations') {
    filename = `rekap-konsultasi-${Date.now()}.csv`;
    csv = 'ID,Nama Siswa,Kelas,Topik,Urgensi,Status,Tanggal Kirim,Sudah Ditanggapi\n';
    db.getConsultations().forEach(c => {
      csv += `"${c.id}","${c.user_name}","${c.user_class || ''}","${c.topic.replace(/"/g, '""')}","${c.urgency}","${c.status}","${c.created_at}","${c.response ? 'Ya' : 'Belum'}"\n`;
    });
  } else if (type === 'schedules') {
    filename = `rekap-jadwal-konseling-${Date.now()}.csv`;
    csv = 'ID,Nama Siswa,Kelas,Tanggal,Waktu,Layanan,Mode,Status,Topik\n';
    db.getSchedules().forEach(s => {
      csv += `"${s.id}","${s.user_name}","${s.user_class || ''}","${s.date}","${s.time}","${s.service_type}","${s.counseling_mode}","${s.status}","${s.topic.replace(/"/g, '""')}"\n`;
    });
  } else if (type === 'assessments') {
    filename = `rekap-self-assessment-${Date.now()}.csv`;
    csv = 'ID,Nama Siswa,Kelas,Judul Assessment,Skor,Max Skor,Persentase,Tanggal\n';
    db.getAssessmentResults().forEach(r => {
      csv += `"${r.id}","${r.user_name}","${r.user_class || ''}","${r.assessment_title}","${r.score}","${r.max_score}","${r.percentage}%","${r.created_at}"\n`;
    });
  } else {
    filename = `rekap-aktivitas-penggunaan-${Date.now()}.csv`;
    csv = 'ID,Nama Pengguna,Peran,Aktivitas,Waktu\n';
    db.getActivityLogs(500).forEach(l => {
      csv += `"${l.id}","${l.user_name || 'Sistem'}","${l.role || '-'}","${l.activity.replace(/"/g, '""')}","${l.created_at}"\n`;
    });
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.send(csv);
});

export default router;
