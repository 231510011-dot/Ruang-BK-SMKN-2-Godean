import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Material,
  Assessment,
  AssessmentResult,
  Consultation,
  CounselingSchedule,
  Journal,
  CareerContent,
  CareerPlan,
  AssistanceRequest,
  ActivityLog,
} from './types';

interface DatabaseSchema {
  users: User[];
  materials: Material[];
  assessments: Assessment[];
  assessment_results: AssessmentResult[];
  consultations: Consultation[];
  counseling_schedules: CounselingSchedule[];
  journals: Journal[];
  career_contents: CareerContent[];
  career_plans: CareerPlan[];
  assistance_requests: AssistanceRequest[];
  activity_logs: ActivityLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Initial Guru credentials from environment variable
const DEFAULT_GURU_USERNAME = process.env.DEFAULT_GURU_USERNAME || 'gurubk.smkn2godean_';
const DEFAULT_GURU_PASSWORD = process.env.DEFAULT_GURU_PASSWORD || 'bksmkn2godeanjayajaya2026';

function getInitialDatabase(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const guruPasswordHash = bcrypt.hashSync(DEFAULT_GURU_PASSWORD, salt);
  const studentPasswordHash = bcrypt.hashSync('siswa123', salt);

  const initialUsers: User[] = [
    {
      id: 'user-guru-1',
      name: 'Guru BK',
      username: DEFAULT_GURU_USERNAME,
      password_hash: guruPasswordHash,
      role: 'guru_bk',
      major: 'Bimbingan dan Konseling',
      class: 'SMKN 2 Godean',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      must_change_password: true,
      created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'user-siswa-1',
      name: 'Anindya Putri Pratama',
      username: 'anindya.kuliner',
      password_hash: studentPasswordHash,
      role: 'siswa',
      nis: '20240101',
      class: 'Kelas 11',
      major: 'DPB',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      must_change_password: false,
      created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'user-siswa-2',
      name: 'Dimas Bagus Saputra',
      username: 'dimas.busana',
      password_hash: studentPasswordHash,
      role: 'siswa',
      nis: '20230214',
      class: 'Kelas 12',
      major: 'BUSANA',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      must_change_password: false,
      created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'user-siswa-3',
      name: 'Rizky Aditya Nugraha',
      username: 'rizky.hotel',
      password_hash: studentPasswordHash,
      role: 'siswa',
      nis: '20250320',
      class: 'Kelas 10',
      major: 'TKKR',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      must_change_password: false,
      created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const initialMaterials: Material[] = [
    // BK Pribadi
    {
      id: 'mat-pribadi-1',
      title: 'Mengenal Diri Sendiri (Self-Awareness)',
      category: 'BK Pribadi',
      description: 'Panduan mengenali potensi, kelebihan, kelemahan, dan nilai-nilai hidup dalam diri siswa SMK.',
      content: `Self-awareness atau kesadaran diri adalah fondasi utama bagi kedewasaan emosional dan kesuksesan seorang siswa SMK. Mengenal diri sendiri berarti Anda memahami apa yang menjadi minat terbesar Anda, kekuatan yang bisa diandalkan dalam praktik kejuruan, serta titik kelemahan yang membutuhkan latihan lebih tekun.

Langkah Praktis Mengenali Diri:
1. **Identifikasi Minat & Passion**: Apa aktivitas yang membuat Anda bersemangat hingga lupa waktu saat berada di bengkel atau lab praktik?
2. **Kenali Kelebihan (Strengths)**: Apakah Anda memiliki ketelitian tinggi, daya cipta kreatif, ketahanan kerja fisik, atau kepemimpinan?
3. **Akui Kelemahan (Weaknesses)**: Mengakui kelemahan bukan tanda kegagalan, melainkan titik awal pembenahan diri.
4. **Petakan Nilai Hidup (Core Values)**: Kejujuran, ketepatan waktu, dan integritas adalah mata uang paling berharga di dunia industri.

Ingatlah, di SMKN 2 Godean, setiap siswa memiliki keunikan dan keunggulannya masing-masing. Jangan bandingkan garis start Anda dengan garis finis orang lain.`,
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      quiz_data: [
        {
          question: 'Apa tujuan utama dari memahami kesadaran diri (self-awareness)?',
          options: [
            'Mengetahui kekurangan orang lain untuk dibandingkan',
            'Memahami potensi, kelebihan, dan aspek yang perlu dikembangkan dalam diri',
            'Menghindari tanggung jawab tugas praktik',
            'Mengisolasi diri dari lingkungan pertemanan sekolah'
          ],
          correctIndex: 1,
          explanation: 'Kesadaran diri membantu kita memahami potensi sejati dan mengevaluasi bagian diri yang perlu ditingkatkan.'
        }
      ],
      reflection_prompt: 'Tuliskan 3 kekuatan utama yang kamu miliki dan 1 hal yang paling ingin kamu perbaiki minggu ini.',
      read_count: 42,
      created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-pribadi-2',
      title: 'Membangun Rasa Percaya Diri & Menghadapi Insecurity',
      category: 'BK Pribadi',
      description: 'Kiat mengatasi minder, cemas saat presentasi atau unjuk kerja praktik, dan menguatkan resiliensi mental.',
      content: `Banyak siswa merasa minder ketika harus tampil di depan kelas atau saat hasil karya praktiknya dinilai oleh penguji. Rasa kurang percaya diri umumnya muncul dari kebiasaan membandingkan proses diri sendiri dengan hasil akhir orang lain di media sosial.

Cara Efektif Menumbuhkan Kepercayaan Diri:
- **Latihan Repetitif**: Kepercayaan diri bukan bakat gaib, melainkan hasil dari pengulangan jam terbang keterampilan.
- **Rayakan Kemenangan Kecil**: Beri apresiasi pada diri sendiri setiap kali berhasil menyelesaikan 1 modul tugas.
- **Ubah Self-Talk Negatif**: Ganti kalimat "Aku tidak bisa" menjadi "Aku sedang belajar dan akan semakin lancar jika berlatih".
- **Fokus pada Kontribusi**: Saat berbicara di depan umum, fokuslah pada manfaat informasi yang Anda bagikan kepada teman-teman.`,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      quiz_data: [
        {
          question: 'Manakah cara yang sehat untuk menumbuhkan rasa percaya diri?',
          options: [
            'Terus membandingkan diri dengan postingan selebgram',
            'Mengakui proses belajar dan melakukan latihan secara berkala',
            'Menolak semua tugas kelompok karena takut salah',
            'Menutupi kelemahan dengan menyalahkan orang lain'
          ],
          correctIndex: 1,
          explanation: 'Latihan konsisten dan apresiasi atas proses diri adalah kunci percaya diri yang berkelanjutan.'
        }
      ],
      reflection_prompt: 'Kapan terakhir kali kamu merasa bangga atas usahamu sendiri? Apa yang memicu perasaan itu?',
      read_count: 36,
      created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-pribadi-3',
      title: 'Mengelola Emosi dan Stres Remaja (Emotional Regulation)',
      category: 'BK Pribadi',
      description: 'Teknik mengenali trigger amarah, cemas, dan sedih, serta menyalurkannya secara sehat dan konstruktif.',
      content: `Masa remaja di SMK sarat dengan dinamika: tenggat waktu tugas praktik, persiapan PKL, ekspektasi keluarga, hingga pertemanan. Sangat wajar jika sewaktu-waktu Anda merasa lelah mental atau emosi meluap.

Teknik STOP untuk Mengelola Emosi Akut:
- **S (Stop)**: Hentikan apa yang sedang Anda katakan atau lakukan selama 5 detik.
- **T (Take a breath)**: Tarik napas dalam melalui hidung selama 4 hitungan, tahan 2 hitungan, hembuskan perlahan 6 hitungan.
- **O (Observe)**: Amati apa yang sedang bergejolak di dalam dada dan pikiran tanpa menghakimi.
- **P (Proceed)**: Lanjutkan tindakan dengan kepala dingin dan kata-kata yang bijak.`,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
      reflection_prompt: 'Saat kamu sedang marah atau cemas, apa cara paling menenangkan yang biasa membantumu rileks?',
      read_count: 28,
      created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },

    // BK Sosial
    {
      id: 'mat-sosial-1',
      title: 'Komunikasi Efektif & Asertif di Lingkungan Sekolah',
      category: 'BK Sosial',
      description: 'Belajar menyatakan pendapat, menolak permintaan secara sopan (saying no), dan mendengarkan aktif.',
      content: `Komunikasi asertif adalah seni menyampaikan pikiran, perasaan, dan batasan pribadi secara jujur dan tegas tanpa merendahkan atau menyerang hak orang lain. 

Tiga Gaya Komunikasi:
1. **Pasif**: Selalu mengalah meski dirugikan, takut menolak permintaan teman, memendam ketidaknyamanan.
2. **Agresif**: Memaksakan kehendak, menyela, memakai nada tinggi dan merendahkan.
3. **Asertif**: Menggunakan formula *"I-Statement"* (Contoh: "Saya merasa kesulitan menyelesaikan bagian ini jika pembagian tugas belum disepakati, bagaimana jika kita diskusikan bersama?").`,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
      quiz_data: [
        {
          question: 'Bagaimana karakteristik gaya komunikasi asertif?',
          options: [
            'Menyerang lawan bicara agar kita menang debat',
            'Menyampaikan pesan dan batasan secara jujur, tegas, dan tetap menghargai lawan bicara',
            'Diam saja dan memendam kekesalan',
            'Membicarakan keburukan orang lain di belakang'
          ],
          correctIndex: 1,
          explanation: 'Komunikasi asertif menjunjung kejujuran dan saling menghargai martabat kedua belah pihak.'
        }
      ],
      reflection_prompt: 'Pernahkah kamu kesulitan berkata "tidak" pada ajakan teman yang merugikanmu? Apa yang bisa kamu ubah ke depannya?',
      read_count: 51,
      created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-sosial-2',
      title: 'Pencegahan Cyberbullying & Etika Bermedia Sosial',
      category: 'BK Sosial',
      description: 'Jejak digital, undang-undang ITE, menjaga privasi, dan menciptakan ruang siber yang aman bagi sesama kawan.',
      content: `Jejak digital (digital footprint) bersifat abadi. Komentar sinis, bercandaan berlebihan yang mengarah ke body-shaming, atau penyebaran aib teman di media sosial dapat berimplikasi hukum dan merusak masa depan karier Anda saat lolos seleksi kerja di industri.

Aturan Emas Etika Digital:
- **THINK Sebelum Posting**:
  - T (Is it True? Apakah ini benar?)
  - H (Is it Helpful? Apakah ini bermanfaat?)
  - I (Is it Inspiring? Apakah ini menginspirasi?)
  - N (Is it Necessary? Apakah ini penting?)
  - K (Is it Kind? Apakah ini ramah dan beradab?)
- Jika Anda atau teman Anda menjadi korban cyberbullying, segera simpan bukti tangkapan layar (screenshot) dan laporkan ke Guru BK melalui Ruang BK ini!`,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      reflection_prompt: 'Bagaimana kebiasaanmu dalam memilah apa yang pantas diunggah ke media sosial dan apa yang menjadi ranah privat?',
      read_count: 39,
      created_at: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },

    // BK Belajar
    {
      id: 'mat-belajar-1',
      title: 'Manajemen Waktu & Mengatasi Prokrastinasi Pelajar SMK',
      category: 'BK Belajar',
      description: 'Menyeimbangkan jam pelajaran teori, praktik bengkel/lab kejuruan, tugas rumah, organisasi, dan istirahat.',
      content: `Siswa SMK memiliki beban ganda yang unik: menguasai teori akademis sekaligus keterampilan psikomotorik di bengkel dan laboratorium praktik. Tanpa manajemen waktu yang terencana, siswa rawan mengalami sindrom "SKS" (Sistem Kebut Semalam) yang memicu stres hebat.

Gunakan Matriks Eisenhower:
- **Penting & Mendesak (Lakukan Sekarang)**: Tugas praktik yang dikumpulkan besok, persiapan ujian kejuruan.
- **Penting & Tidak Mendesak (Jadwalkan)**: Mempelajari modul materi baru, merawat portofolio, olahraga, tidur teratur.
- **Tidak Penting & Mendesak (Delegasikan/Batasi)**: Ajakan mabar game saat jam belajar penting.
- **Tidak Penting & Tidak Mendesak (Hapus)**: Doomscrolling media sosial berjam-jam tanpa tujuan.`,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      quiz_data: [
        {
          question: 'Aktivitas mana yang masuk kategori "Penting tetapi Tidak Mendesak" yang wajib dijadwalkan?',
          options: [
            'Scroll feed medsos sampai larut malam',
            'Investasi belajar keterampilan baru dan merawat kesehatan tubuh secara berkala',
            'Menunggu jam 11 malam sebelum deadline tugas untuk mulai mengetik',
            'Menghindari masuk sekolah tanpa keterangan'
          ],
          correctIndex: 1,
          explanation: 'Hal penting tidak mendesak membangun ketahanan masa depan jika kita menjadwalkannya secara rutin.'
        }
      ],
      reflection_prompt: 'Berapa rata-rata jam yang kamu habiskan di layar ponsel dalam sehari untuk hiburan? Apa 1 hal produktif yang bisa kamu gantikan?',
      read_count: 64,
      created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-belajar-2',
      title: 'Strategi Belajar Efektif: Teknik Feynman & Pomodoro',
      category: 'BK Belajar',
      description: 'Maksimalkan daya ingat dan pemahaman konsep teknis kejuruan dengan metode belajar ilmiah teruji.',
      content: `Menghafal rumus atau SOP kejuruan dengan membaca berulang kali sering kali menghasilkan ilusi kompetensi (merasa sudah bisa padahal belum). 

Dua Teknik Terbukti Efektif:
1. **Teknik Pomodoro**: Belajar fokus tanpa distraksi selama 25 menit, lalu ambil istirahat singkat 5 menit. Ulangi 4 kali siklus, kemudian ambil istirahat panjang 20 menit.
2. **Teknik Feynman**: Jelaskan konsep materi yang baru Anda pelajari dengan kata-kata sederhana seolah-olah Anda mengajarkannya kepada anak usia 10 tahun. Jika Anda bingung menjelaskannya, di sanalah letak materi yang belum Anda kuasai.`,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      reflection_prompt: 'Coba pilih satu materi kejuruan tersulit minggu ini. Tuliskan ringkasannya dalam 3 kalimat sederhana di jurnalmu.',
      read_count: 45,
      created_at: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },

    // BK Karier
    {
      id: 'mat-karier-1',
      title: 'Mengenal Potensi Diri & Pilihan Karier Masa Depan (BMW: Bekerja, Melanjutkan, Wirausaha)',
      category: 'BK Karier',
      description: 'Lulusan SMK memiliki 3 gerbang masa depan: Bekerja di Industri, Melanjutkan Kuliah, atau Merintis Wirausaha.',
      content: `Filosofi kejuruan SMK bermuara pada kesiapan masa depan dengan prinsip BMW:
- **B (Bekerja)**: Masuk ke dunia usaha dan dunia industri (DUDI) sesuai bidang keahlian kompetensi Anda. Memerlukan kesiapan mental, kedisiplinan kerja, etos 5S, dan sertifikasi BNSP.
- **M (Melanjutkan Studi)**: Melanjutkan ke perguruan tinggi (Diploma / Sarjana Terapan / Akademik) melalui jalur SNBP, SNBT, atau Mandiri. KIP Kuliah tersedia bagi yang berprestasi dan membutuhkan dukungan ekonomi.
- **W (Wirausaha)**: Menciptakan lapangan kerja mandiri, mengonversi keahlian kejuruan (kuliner, busana, hospitality) menjadi produk/jasa bernilai ekonomi.

Setiap pilihan memiliki kemuliaan dan tantangannya sendiri. Kuncinya adalah menyelaraskan antara minat, kemampuan, dan kesiapan rencana tindak lanjut.`,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      quiz_data: [
        {
          question: 'Apa kepanjangan dari konsep arah lulusan SMK "BMW"?',
          options: [
            'Bakat, Motivasi, Wawasan',
            'Bekerja, Melanjutkan Kuliah, Wirausaha',
            'Bengkel, Mesin, Waktu',
            'Belajar, Membaca, Waspada'
          ],
          correctIndex: 1,
          explanation: 'Prinsip BMW adalah singkatan dari tiga pilar masa depan lulusan SMK: Bekerja, Melanjutkan kuliah, atau Wirausaha.'
        }
      ],
      reflection_prompt: 'Dari pilihan B (Bekerja), M (Melanjutkan Kuliah), dan W (Wirausaha), mana yang saat ini menjadi prioritas utamamu? Mengapa?',
      read_count: 78,
      created_at: new Date(Date.now() - 16 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-karier-2',
      title: 'Kiat Sukses Persiapan PKL (Praktik Kerja Lapangan) di Dunia Industri',
      category: 'BK Karier',
      description: 'Panduan etika, kedisiplinan, adaptasi lingkungan kerja profesional, dan komunikasi dengan instruktur industri.',
      content: `PKL adalah etalase sesungguhnya dari kualitas diri dan nama baik SMKN 2 Godean di mata mitra dunia industri. Banyak siswa yang langsung direkrut bekerja bahkan sebelum ijazah keluar berkat performa impresif selama masa PKL.

Kunci Sukses Menjalani PKL:
1. **Disiplin Waktu**: Datang 15 menit sebelum jam operasional dimulai. Ketidakhadiran harus selalu disertai izin resmi.
2. **Sopan Santun & 5S**: Senyum, Sapa, Salam, Sopan, Santun. Serta terapkan Seiri, Seiton, Seiso, Seiketsu, Shitsuke di area kerja.
3. **Inisiatif Tinggi**: Jangan hanya duduk berpangku tangan menunggu perintah. Tanyakan pada mentor: *"Ada yang bisa saya bantu selanjutnya, Pak/Bu?"*
4. **Jaga Kerahasiaan Perusahaan**: Tidak mengambil foto resep rahasia, pola desain eksklusif, data tamu hotel, atau dokumen internal tanpa izin.`,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80',
      reflection_prompt: 'Apa kekhawatiran terbesarmu menjelang masa PKL, dan apa yang sudah kamu persiapkan untuk mengatasinya?',
      read_count: 60,
      created_at: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mat-karier-3',
      title: 'Panduan Menyusun CV Profesional & Menghadapi Wawancara Kerja',
      category: 'BK Karier',
      description: 'Menulis CV yang menarik bagi HRD, portofolio karya, bahasa tubuh, dan tips menjawab pertanyaan sulit.',
      content: `CV fresh graduate SMK harus menonjolkan keterampilan teknis terverifikasi (hard skills) dan karakter kerja (soft skills).

Komponen CV yang Disukai HRD:
- **Ringkasan Profil Diri**: 2-3 kalimat tajam tentang keahlian kompetensi kejuruan Anda.
- **Pengalaman PKL & Proyek**: Jelaskan tugas konkret dan pencapaian Anda selama magang.
- **Keahlian Teknis & Sertifikasi**: Cantumkan sertifikat keahlian, uji kompetensi LSP-P1, atau kejuaraan LKS.
- **Portofolio**: Lampirkan foto karya terbaik (produk masakan/pastry, busana hasil jahitan, atau proyek layanan).

Tips Wawancara:
- Duduk tegap, lakukan kontak mata hangat, dan gunakan metode STAR (Situation, Task, Action, Result) saat menceritakan pengalaman memecahkan masalah.`,
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      reflection_prompt: 'Sebutkan 3 proyek atau hasil karya praktik kejuruan terbaik yang paling bangga ingin kamu masukkan ke CV-mu!',
      read_count: 53,
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const initialAssessments: Assessment[] = [
    {
      id: 'ass-1',
      title: 'Self-Assessment: Kondisi & Kebiasaan Belajar',
      category: 'Kondisi belajar',
      description: 'Evaluasi kesiapan konsentrasi, lingkungan belajar, dan motivasi harian Anda dalam mengikuti kegiatan sekolah.',
      questions: [
        { id: 1, text: 'Saya memiliki jadwal belajar rutin di rumah di luar jam sekolah.', category: 'Kondisi belajar' },
        { id: 2, text: 'Saya dapat berkonsentrasi penuh saat guru atau instruktur praktik menjelaskan materi.', category: 'Kondisi belajar' },
        { id: 3, text: 'Saya segera mencari klarifikasi jika ada modul atau instruksi kerja praktik yang belum saya pahami.', category: 'Kondisi belajar' },
        { id: 4, text: 'Lingkungan belajar saya di rumah bebas dari distraksi berlebihan (kebisingan, TV, game).', category: 'Kondisi belajar' },
        { id: 5, text: 'Saya merasa termotivasi untuk mencapai nilai dan kompetensi terbaik pada kejuruan saya.', category: 'Kondisi belajar' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ass-2',
      title: 'Self-Assessment: Manajemen Waktu & Prokrastinasi',
      category: 'Manajemen waktu',
      description: 'Menilai seberapa efektif Anda mengatur waktu antara tugas praktik, kegiatan ekstrakurikuler, dan istirahat.',
      questions: [
        { id: 1, text: 'Saya membuat daftar prioritas (to-do list) untuk tugas-tugas yang harus diselesaikan setiap minggu.', category: 'Manajemen waktu' },
        { id: 2, text: 'Saya jarang menunda-nunda pengerjaan laporan tugas sampai detik-detik terakhir tenggat waktu.', category: 'Manajemen waktu' },
        { id: 3, text: 'Saya mampu membatasi waktu bermain smartphone atau media sosial saat waktu belajar tiba.', category: 'Manajemen waktu' },
        { id: 4, text: 'Saya tiba di sekolah dan ruang praktik tepat waktu setiap pagi.', category: 'Manajemen waktu' },
        { id: 5, text: 'Saya memiliki waktu istirahat dan tidur yang cukup (minimal 6-7 jam sehari).', category: 'Manajemen waktu' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ass-3',
      title: 'Self-Assessment: Kepercayaan Diri & Efikasi Diri',
      category: 'Kepercayaan diri',
      description: 'Mengukur keyakinan Anda dalam mengekspresikan diri, menghadapi ujian praktik, dan berinteraksi di hadapan orang banyak.',
      questions: [
        { id: 1, text: 'Saya merasa percaya diri ketika diminta berbicara atau presentasi di depan kelas.', category: 'Kepercayaan diri' },
        { id: 2, text: 'Saya yakin dengan kemampuan tangan dan keterampilan kejuruan yang telah saya pelajari.', category: 'Kepercayaan diri' },
        { id: 3, text: 'Ketika mengalami kesalahan dalam praktik, saya tidak terpuruk dan berani mencoba kembali.', category: 'Kepercayaan diri' },
        { id: 4, text: 'Saya tidak mudah minder ketika melihat keberhasilan atau keunggulan teman lain.', category: 'Kepercayaan diri' },
        { id: 5, text: 'Saya berani mengemukakan pendapat yang berbeda dalam diskusi kelompok.', category: 'Kepercayaan diri' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ass-4',
      title: 'Self-Assessment: Relasi Sosial & Komunikasi Interpersonal',
      category: 'Relasi sosial',
      description: 'Menilai keharmonisan pertemanan, kemampuan kerja tim, empati, dan penyelesaian konflik pertemanan.',
      questions: [
        { id: 1, text: 'Saya mudah bekerja sama dan membagi peran secara adil dalam kelompok tugas praktik.', category: 'Relasi sosial' },
        { id: 2, text: 'Saya mendengarkan pandangan teman dengan sabar sebelum memberikan tanggapan.', category: 'Relasi sosial' },
        { id: 3, text: 'Saya berani menyelesaikan kesalahpahaman secara langsung dengan kepala dingin tanpa menggunjing.', category: 'Relasi sosial' },
        { id: 4, text: 'Saya merasa diterima dan dihargai oleh lingkungan pertemanan di kelas saya.', category: 'Relasi sosial' },
        { id: 5, text: 'Saya siap menolong teman yang mengalami kendala dalam praktik kejuruan.', category: 'Relasi sosial' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ass-5',
      title: 'Self-Assessment: Perencanaan Karier & Kesiapan Kerja',
      category: 'Perencanaan karier',
      description: 'Mengetahui sejauh mana kematangan rencana masa depan, wawasan industri, dan kesiapan pasca-lulus SMK.',
      questions: [
        { id: 1, text: 'Saya sudah memiliki gambaran yang jelas mengenai apa yang ingin saya lakukan setelah lulus dari SMK.', category: 'Perencanaan karier' },
        { id: 2, text: 'Saya aktif mencari tahu tentang kebutuhan kompetensi di industri kejuruan saya.', category: 'Perencanaan karier' },
        { id: 3, text: 'Saya mengetahui persyaratan untuk mendaftar PKL, pekerjaan, beasiswa, atau kuliah yang relevan.', category: 'Perencanaan karier' },
        { id: 4, text: 'Saya sudah mulai merintis portofolio karya dan sertifikasi pendukung kejuruan saya.', category: 'Perencanaan karier' },
        { id: 5, text: 'Saya siap mematuhi budaya kerja industri seperti disiplin tinggi, kerapian, dan tanggung jawab.', category: 'Perencanaan karier' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'ass-6',
      title: 'Self-Assessment: Penggunaan Media Sosial & Kesejahteraan Digital',
      category: 'Penggunaan media sosial',
      description: 'Menilai keseimbangan aktivitas digital, jejak maya, dan dampaknya pada kesehatan mental dan fokus belajar.',
      questions: [
        { id: 1, text: 'Saya selalu memastikan kebenaran informasi sebelum membagikannya (sharing) di media sosial.', category: 'Penggunaan media sosial' },
        { id: 2, text: 'Penggunaan media sosial tidak mengganggu jam tidur atau jam belajar saya di malam hari.', category: 'Penggunaan media sosial' },
        { id: 3, text: 'Saya tidak merasa cemas atau merasa tertinggal (FOMO) jika seharian tidak membuka media sosial.', category: 'Penggunaan media sosial' },
        { id: 4, text: 'Saya menjaga etika berbahasa dan tidak pernah terlibat dalam cyberbullying atau ujaran kebencian.', category: 'Penggunaan media sosial' },
        { id: 5, text: 'Saya memanfaatkan internet dan media sosial untuk belajar referensi kejuruan dan inspirasi karya positif.', category: 'Penggunaan media sosial' },
      ],
      created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const initialAssessmentResults: AssessmentResult[] = [
    {
      id: 'res-1',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      user_class: 'XI Kuliner 1',
      assessment_id: 'ass-2',
      assessment_title: 'Self-Assessment: Manajemen Waktu & Prokrastinasi',
      score: 19,
      max_score: 25,
      percentage: 76.0,
      interpretation: 'Tingkat manajemen waktu kamu sudah tergolong Baik dan Cukup Teratur. Namun masih ada sedikit kecenderungan menunda pengerjaan tugas praktik di waktu senggang.',
      recommendations: [
        'Terapkan Teknik Pomodoro saat mengerjakan laporan kejuruan',
        'Baca materi BK Belajar: Manajemen Waktu & Mengatasi Prokrastinasi Pelajar SMK',
        'Gunakan fitur Jurnal & Refleksi untuk memantau target harian'
      ],
      answers: { 1: 4, 2: 3, 3: 4, 4: 5, 5: 3 },
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    }
  ];

  const initialConsultations: Consultation[] = [
    {
      id: 'con-1',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      user_class: 'XI Kuliner 1',
      topic: 'Kecemasan Menjelang Seleksi Tempat PKL Hotel Berbintang',
      message: 'Selamat siang Bu Guru BK. Saya ingin berkonsultasi mengenai persiapan PKL semester depan. Saya berencana mendaftar di Hotel Tentrem atau Hyatt Regency Yogyakarta, tetapi saya merasa sangat gugup saat membayangkan tes wawancara dan uji keterampilan table manner. Bagaimana ya Bu agar saya bisa lebih tenang dan siap?',
      urgency: 'sedang',
      status: 'Sudah Ditanggapi',
      is_anonymous: false,
      response: 'Selamat siang Anindya. Perasaan cemas menjelang seleksi PKL di hotel berbintang sangat wajar dialami siswa kelas XI. Nilai praktik kuliner dan kedisiplinanmu selama ini sangat baik. Silakan ambil modul "Panduan Menyusun CV & Menghadapi Wawancara" di menu Materi Karier, dan kamu bisa booking jadwal konseling tatap muka di Ruang BK hari Kamis untuk simulasi wawancara bersama Ibu ya!',
      follow_up_notes: 'Siswa memiliki potensi tinggi, hanya membutuhkan dorongan rasa percaya diri dan simulasi interview.',
      responded_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'con-2',
      user_id: 'user-siswa-2',
      user_name: 'Dimas Bagus Saputra',
      user_class: 'XII Tata Busana 2',
      topic: 'Dilema Antara Langsung Bekerja di Butik atau Kuliah Desain Mode',
      message: 'Ibu BK, saya sekarang berada di kelas XII dan sedang bingung menentukan pilihan. Orang tua menginginkan saya langsung bekerja membantu ekonomi, tetapi saya berminat ingin kuliah D4/S1 Desain Busana lewat KIP Kuliah. Bagaimana langkah bijak mendiskusikan hal ini dengan keluarga?',
      urgency: 'tinggi',
      status: 'Dalam Proses',
      is_anonymous: false,
      response: 'Halo Dimas. Pertanyaanmu sangat berbobot dan menunjukkan kedewasaan berpikir. Ibu sedang menyiapkan data beasiswa KIP-Kuliah serta opsi kuliah kelas malam/karyawan yang memungkinkanmu bekerja sambil menimba ilmu. Mari kita jadwalkan sesi konseling khusus.',
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'con-3',
      user_id: 'user-siswa-3',
      user_name: 'Siswa SMKN 2 Godean (Anonim)',
      user_class: 'X Perhotelan 1',
      topic: 'Merasa Sulit Beradaptasi dengan Teman Sekelas Baru',
      message: 'Saya anak rantau dari luar daerah dan merasa canggung bergaul di asrama/kos serta di kelas X. Beberapa teman terlihat sudah punya geng sendiri dan saya sering merasa sendirian saat jam istirahat sekolah.',
      urgency: 'sedang',
      status: 'Dibaca Guru BK',
      is_anonymous: true,
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    }
  ];

  const initialSchedules: CounselingSchedule[] = [
    {
      id: 'sch-1',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      user_class: 'XI Kuliner 1',
      date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      time: '09:15 - 10:00 WIB',
      service_type: 'Konseling Karier & Persiapan PKL',
      topic: 'Simulasi Wawancara Kerja dan Peninjauan Portofolio PKL Hotel',
      counseling_mode: 'Tatap Muka',
      status: 'Disetujui',
      location_or_link: 'Ruang Bimbingan & Konseling (Gedung Utama SMKN 2 Godean)',
      notes: 'Bawalah draft CV dan portofolio foto olahan masakan yang sudah disusun.',
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'sch-2',
      user_id: 'user-siswa-2',
      user_name: 'Dimas Bagus Saputra',
      user_class: 'XII Tata Busana 2',
      date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      time: '13:00 - 13:45 WIB',
      service_type: 'Konseling Kelanjutan Studi & Beasiswa',
      topic: 'Diskusi Beasiswa KIP Kuliah & Peluang Karier Industri Busana',
      counseling_mode: 'Tatap Muka',
      status: 'Menunggu persetujuan',
      created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    }
  ];

  const initialJournals: Journal[] = [
    {
      id: 'jrn-1',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      user_class: 'XI Kuliner 1',
      mood: 'Senang',
      title: 'Berhasil Menyelesaikan Praktik Pastry Croissant Hari Ini',
      feeling: 'Hari ini saya merasa lega dan bersemangat karena teknik laminasi adonan mentega saya disetujui guru pembimbing dan hasilnya renyah.',
      problems: 'Sempat terburu-buru saat fermentasi adonan di ruang lab yang agak hangat.',
      actions_taken: 'Mengatur timer ponsel dan menjaga suhu meja marmer kerja dengan es batu.',
      improvements: 'Lebih tenang dalam membaca timbangan bahan agar rasa konsisten.',
      next_goals: 'Mempersiapkan materi presentasi gizi makanan untuk minggu depan.',
      is_shared_with_counselor: true,
      counselor_feedback: 'Luar biasa Anindya! Refleksi yang sangat mendalam dan solutif. Pertahankan sikap disiplin dan cermat ini.',
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    }
  ];

  const initialCareerContents: CareerContent[] = [
    {
      id: 'car-1',
      title: 'Mengenal Budaya Kerja Industri: Standar 5S / 5R untuk Lulusan SMK',
      category: 'Dunia Kerja',
      summary: 'Konsep dasar Ringkas, Rapi, Resik, Rawat, dan Rajin yang menjadi parameter wajib penerimaan karyawan di industri.',
      content: `Perusahaan modern dan hotel berbintang di Indonesia mengadopsi prinsip 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) atau 5R di Indonesia.

1. **Ringkas (Seiri)**: Memisahkan barang yang diperlukan dengan yang tidak berguna di workstation kerja.
2. **Rapi (Seiton)**: Meletakkan peralatan sesuai tempatnya dengan pelabelan yang rapi dan mudah diambil kembali.
3. **Resik (Seiso)**: Membersihkan area kerja, mesin, dan meja setiap akhir sesi.
4. **Rawat (Seiketsu)**: Mempertahankan standar kebersihan dan prosedur kerja secara teratur.
5. **Rajin (Shitsuke)**: Menjadikan kedisiplinan dan kepatuhan SOP sebagai kebiasaan alami tanpa perlu diawasi.`,
      tags: ['Dunia Kerja', 'Industri', '5S', 'Budaya Kerja'],
      created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-2',
      title: 'Kuliah Setelah SMK: Jalur SNBP, SNBT, dan Beasiswa KIP Kuliah',
      category: 'Kuliah',
      summary: 'Informasi lengkap bagi siswa SMK yang ingin melanjutkan ke jenjang D3, D4 Sarjana Terapan, atau S1.',
      content: `Lulusan SMK memiliki peluang besar masuk perguruan tinggi negeri (PTN) maupun politeknik negeri.

- **Jalur SNBP (Seleksi Nasional Berdasarkan Prestasi)**: Berdasarkan nilai rapor semester 1-5 dan portofolio prestasi kejuruan/LKS.
- **Jalur SNBT (Seleksi Nasional Berdasarkan Tes)**: Menggunakan Tes Potensi Skolastik (TPS) dan Penalaran Matematika/Literasi.
- **KIP Kuliah**: Program pembebasan biaya kuliah penuh dan pemberian uang saku bulanan dari pemerintah bagi siswa yang memenuhi syarat ekonomi dan akademik.`,
      tags: ['Kuliah', 'SNBP', 'SNBT', 'KIP Kuliah', 'Politeknik'],
      created_at: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-3',
      title: 'Panduan Praktik Kerja Lapangan (PKL): Hak, Kewajiban, & Laporan',
      category: 'PKL',
      summary: 'Semua yang perlu diketahui siswa SMKN 2 Godean sebelum, selama, dan sesudah menjalani PKL di mitra industri.',
      content: `Pelaksanaan PKL bertujuan membekali siswa dengan pengalaman nyata di industri dunia usaha dan kerja.
- **Persiapan**: Pengurusan surat pengantar, pembagian guru pembimbing, dan orientasi keselamatan kerja (K3).
- **Pelaksanaan**: Pengisian jurnal kegiatan harian PKL dan kehadiran tepat waktu.
- **Pasca PKL**: Penyusunan laporan akhir dan presentasi sidang PKL di hadapan dewan penguji kejuruan.`,
      tags: ['PKL', 'Magang', 'Industri', 'Panduan PKL'],
      created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-4',
      title: 'Merintis Wirausaha Muda: Mengubah Keterampilan Kejuruan Menjadi Bisnis',
      category: 'Wirausaha',
      summary: 'Langkah awal membuat business plan sederhana, menentukan target pasar, dan pemasaran digital berbasis media sosial.',
      content: `Kompetensi kejuruan di SMKN 2 Godean seperti Kuliner, Busana, dan Perhotelan sangat prospektif untuk diolah menjadi unit usaha mandiri:
1. Validasi ide produk dengan membuat tester kepada teman dan guru.
2. Hitung harga pokok produksi (HPP) dan margin keuntungan wajar.
3. Buat kemasan higienis dan visual branding di Instagram/TikTok.
4. Manfaatkan program SPW (Sekolah Pencetak Wirausaha) yang didampingi oleh Guru BK dan tim kewirausahaan sekolah.`,
      tags: ['Wirausaha', 'Bisnis', 'SPW', 'Kewirausahaan'],
      created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-5',
      title: 'Tips dan Trik Menulis CV ATS-Friendly untuk Fresh Graduate SMK',
      category: 'Persiapan CV',
      summary: 'Bagaimana membuat resume yang lolos seleksi awal robot Applicant Tracking System di perusahaan besar.',
      content: `Banyak perusahaan besar menggunakan software ATS untuk memfilter ribuan pelamar. Agar CV Anda terbaca:
- Gunakan format file PDF standar dengan font bersih (Arial, Calibri, atau Helvetica).
- Jangan gunakan tabel bertingkat yang rumit atau grafik presentase skill berbentuk lingkaran.
- Tuliskan kata kunci (keywords) yang sesuai dengan deskripsi lowongan pekerjaan (contoh: *"Menguasai Kitchen Hygiene, HACCP, Pengoperasian Mesin Jahit High-Speed"*).`,
      tags: ['CV', 'ATS', 'Lamaran Kerja', 'Fresh Graduate'],
      created_at: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-6',
      title: 'Bocoran 10 Pertanyaan Populer Wawancara Kerja & Rekomendasi Jawabannya',
      category: 'Persiapan Interview',
      summary: 'Simulasi tanya jawab HRD dan User: kelemahan diri, gaji yang diharapkan, dan motivasi melamar.',
      content: `Pertanyaan klasik dalam wawancara kerja beserta strategi menjawabnya:
1. *"Ceritakan tentang diri Anda?"* -> Jawab dengan ringkasan latar belakang kejuruan di SMKN 2 Godean, pengalaman PKL, dan antusiasme Anda untuk berkontribusi.
2. *"Apa kelemahan terbesar Anda?"* -> Sebutkan aspek yang sedang Anda perbaiki secara konkret (contoh: *"Dulu saya sering cemas berbicara di depan umum, namun selama SMK saya aktif melatih diri dalam presentasi kelompok"*).
3. *"Mengapa kami harus menerima Anda?"* -> Tunjukkan keselarasan keahlian teknis Anda dengan kebutuhan posisi kerja.`,
      tags: ['Interview', 'Wawancara', 'HRD', 'Tips Kerja'],
      created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-7',
      title: 'Info Bursa Kerja Khusus (BKK) & Rekrutmen Mitra SMKN 2 Godean',
      category: 'Lowongan',
      summary: 'Kumpulan informasi lowongan kerja terbaru yang bekerja sama resmi dengan BKK SMKN 2 Godean.',
      content: `Bursa Kerja Khusus (BKK) SMKN 2 Godean secara rutin menerima permintaan rekrutmen dari hotel bintang 4-5 di Yogyakarta & Bali, garmen ekspor, restoran terkemuka, dan kapal pesiar.

Pastikan data keanggotaan BKK dan kartu AK-1 (Kartu Kuning Disnaker) Anda sudah diperbarui menjelang kelulusan sekolah!`,
      tags: ['BKK', 'Lowongan Kerja', 'Rekrutmen', 'Mitra Industri'],
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const initialCareerPlans: CareerPlan[] = [
    {
      id: 'plan-1',
      user_id: 'user-siswa-1',
      main_choice: 'Bekerja sambil kuliah',
      target_after_grad: 'Menjadi Demi Chef de Partie di pastry kitchen hotel bintang lima di Yogyakarta.',
      target_1_year: 'Menyelesaikan program PKL dengan predikat Memuaskan dan lulus Uji Sertifikasi BNSP Kuliner.',
      target_3_years: 'Mendaftar kuliah D4 Manajemen Kuliner kelas sore sambil mengumpulkan modal tabungan kerja.',
      skills_needed: 'Penguasaan teknik baking artisan bread, Bahasa Inggris percakapan untuk hospitality, dan food costing.',
      action_steps: 'Mengikuti kursus online hospitality English, latihan resep pastry mingguan, dan berkonsultasi rutin dengan Guru BK.',
      updated_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    }
  ];

  const initialAssistanceRequests: AssistanceRequest[] = [
    {
      id: 'ast-1',
      user_id: 'user-siswa-2',
      user_name: 'Dimas Bagus Saputra',
      user_class: 'XII Tata Busana 2',
      category: 'Saya membutuhkan bantuan terkait karier',
      notes: 'Ingin konsultasi seputar beasiswa kuliah dan izin orang tua.',
      status: 'Sedang Dihubungi',
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    }
  ];

  const initialActivityLogs: ActivityLog[] = [
    {
      id: 'log-1',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      role: 'siswa',
      activity: 'Membaca Materi: Manajemen Waktu & Mengatasi Prokrastinasi Pelajar SMK',
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-2',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      role: 'siswa',
      activity: 'Menyelesaikan Self-Assessment: Manajemen Waktu & Prokrastinasi (Skor: 19/25)',
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-3',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      role: 'siswa',
      activity: 'Mengirim Konsultasi: Kecemasan Menjelang Seleksi Tempat PKL',
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-4',
      user_id: 'user-guru-1',
      user_name: 'Guru BK',
      role: 'guru_bk',
      activity: 'Menanggapi Konsultasi Siswa: Anindya Putri Pratama',
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-5',
      user_id: 'user-siswa-1',
      user_name: 'Anindya Putri Pratama',
      role: 'siswa',
      activity: 'Membuat Booking Jadwal Konseling Tatap Muka',
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-6',
      user_id: 'user-guru-1',
      user_name: 'Guru BK',
      role: 'guru_bk',
      activity: 'Menyetujui Jadwal Konseling Siswa: Anindya Putri Pratama',
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  return {
    users: initialUsers,
    materials: initialMaterials,
    assessments: initialAssessments,
    assessment_results: initialAssessmentResults,
    consultations: initialConsultations,
    counseling_schedules: initialSchedules,
    journals: initialJournals,
    career_contents: initialCareerContents,
    career_plans: initialCareerPlans,
    assistance_requests: initialAssistanceRequests,
    activity_logs: initialActivityLogs,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
    this.ensureGuruAccount();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          materials: parsed.materials || [],
          assessments: parsed.assessments || [],
          assessment_results: parsed.assessment_results || [],
          consultations: parsed.consultations || [],
          counseling_schedules: parsed.counseling_schedules || [],
          journals: parsed.journals || [],
          career_contents: parsed.career_contents || [],
          career_plans: parsed.career_plans || [],
          assistance_requests: parsed.assistance_requests || [],
          activity_logs: parsed.activity_logs || [],
        };
      }
    } catch (e) {
      console.error('Error reading database file, initializing default:', e);
    }

    const initial = getInitialDatabase();
    this.saveDatabaseSync(initial);
    return initial;
  }

  private saveDatabaseSync(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  public save() {
    this.saveDatabaseSync(this.data);
  }

  private ensureGuruAccount() {
    const guru = this.data.users.find(u => u.username === DEFAULT_GURU_USERNAME);
    if (!guru) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(DEFAULT_GURU_PASSWORD, salt);
      this.data.users.unshift({
        id: 'user-guru-admin',
        name: 'Guru BK SMKN 2 Godean (Administrator)',
        username: DEFAULT_GURU_USERNAME,
        password_hash: hash,
        role: 'guru_bk',
        major: 'Bimbingan dan Konseling',
        class: 'Koordinator BK',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        must_change_password: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      this.save();
      console.log(`[DB] Default Guru BK account initialized: ${DEFAULT_GURU_USERNAME}`);
    }
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public addUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.users[idx];
  }

  // Materials
  public getMaterials(category?: string, search?: string): Material[] {
    let list = this.data.materials;
    if (category && category !== 'Semua') {
      list = list.filter(m => m.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return list;
  }

  public getMaterialById(id: string): Material | undefined {
    return this.data.materials.find(m => m.id === id);
  }

  public addMaterial(material: Material): Material {
    this.data.materials.unshift(material);
    this.save();
    return material;
  }

  public updateMaterial(id: string, updates: Partial<Material>): Material | null {
    const idx = this.data.materials.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.materials[idx] = {
      ...this.data.materials[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.materials[idx];
  }

  public deleteMaterial(id: string): boolean {
    const prevLen = this.data.materials.length;
    this.data.materials = this.data.materials.filter(m => m.id !== id);
    const deleted = this.data.materials.length < prevLen;
    if (deleted) this.save();
    return deleted;
  }

  public incrementMaterialRead(id: string): Material | null {
    const mat = this.data.materials.find(m => m.id === id);
    if (!mat) return null;
    mat.read_count = (mat.read_count || 0) + 1;
    this.save();
    return mat;
  }

  // Assessments
  public getAssessments(): Assessment[] {
    return this.data.assessments;
  }

  public getAssessmentById(id: string): Assessment | undefined {
    return this.data.assessments.find(a => a.id === id);
  }

  public getAssessmentResults(userId?: string): AssessmentResult[] {
    if (userId) {
      return this.data.assessment_results.filter(r => r.user_id === userId);
    }
    return this.data.assessment_results;
  }

  public addAssessmentResult(res: AssessmentResult): AssessmentResult {
    this.data.assessment_results.unshift(res);
    this.save();
    return res;
  }

  // Consultations
  public getConsultations(userId?: string): Consultation[] {
    if (userId) {
      return this.data.consultations.filter(c => c.user_id === userId);
    }
    return this.data.consultations;
  }

  public getConsultationById(id: string): Consultation | undefined {
    return this.data.consultations.find(c => c.id === id);
  }

  public addConsultation(consultation: Consultation): Consultation {
    this.data.consultations.unshift(consultation);
    this.save();
    return consultation;
  }

  public updateConsultation(id: string, updates: Partial<Consultation>): Consultation | null {
    const idx = this.data.consultations.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.consultations[idx] = {
      ...this.data.consultations[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.consultations[idx];
  }

  // Counseling Schedules
  public getSchedules(userId?: string): CounselingSchedule[] {
    if (userId) {
      return this.data.counseling_schedules.filter(s => s.user_id === userId);
    }
    return this.data.counseling_schedules;
  }

  public isSlotBooked(date: string, time: string, excludeId?: string): boolean {
    return this.data.counseling_schedules.some(
      s => s.date === date && s.time === time && s.id !== excludeId && s.status !== 'Ditolak' && s.status !== 'Dibatalkan'
    );
  }

  public addSchedule(schedule: CounselingSchedule): CounselingSchedule {
    this.data.counseling_schedules.unshift(schedule);
    this.save();
    return schedule;
  }

  public updateSchedule(id: string, updates: Partial<CounselingSchedule>): CounselingSchedule | null {
    const idx = this.data.counseling_schedules.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.counseling_schedules[idx] = {
      ...this.data.counseling_schedules[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.counseling_schedules[idx];
  }

  // Journals
  public getJournals(userId?: string, isCounselor: boolean = false): Journal[] {
    if (isCounselor) {
      // Counselor only sees journals marked as shared with counselor
      return this.data.journals.filter(j => j.is_shared_with_counselor);
    }
    if (userId) {
      return this.data.journals.filter(j => j.user_id === userId);
    }
    return [];
  }

  public addJournal(journal: Journal): Journal {
    this.data.journals.unshift(journal);
    this.save();
    return journal;
  }

  public updateJournal(id: string, updates: Partial<Journal>): Journal | null {
    const idx = this.data.journals.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.data.journals[idx] = {
      ...this.data.journals[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.journals[idx];
  }

  // Career
  public getCareerContents(category?: string): CareerContent[] {
    if (category && category !== 'Semua') {
      return this.data.career_contents.filter(c => c.category === category);
    }
    return this.data.career_contents;
  }

  public addCareerContent(content: CareerContent): CareerContent {
    this.data.career_contents.unshift(content);
    this.save();
    return content;
  }

  public updateCareerContent(id: string, updates: Partial<CareerContent>): CareerContent | null {
    const idx = this.data.career_contents.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.career_contents[idx] = {
      ...this.data.career_contents[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.career_contents[idx];
  }

  public deleteCareerContent(id: string): boolean {
    const prevLen = this.data.career_contents.length;
    this.data.career_contents = this.data.career_contents.filter(c => c.id !== id);
    const deleted = this.data.career_contents.length < prevLen;
    if (deleted) this.save();
    return deleted;
  }

  // Career Plan
  public getCareerPlan(userId: string): CareerPlan | undefined {
    return this.data.career_plans.find(p => p.user_id === userId);
  }

  public saveCareerPlan(plan: CareerPlan): CareerPlan {
    const idx = this.data.career_plans.findIndex(p => p.user_id === plan.user_id);
    if (idx >= 0) {
      this.data.career_plans[idx] = plan;
    } else {
      this.data.career_plans.push(plan);
    }
    this.save();
    return plan;
  }

  // Assistance Requests
  public getAssistanceRequests(): AssistanceRequest[] {
    return this.data.assistance_requests;
  }

  public addAssistanceRequest(req: AssistanceRequest): AssistanceRequest {
    this.data.assistance_requests.unshift(req);
    this.save();
    return req;
  }

  public updateAssistanceRequest(id: string, updates: Partial<AssistanceRequest>): AssistanceRequest | null {
    const idx = this.data.assistance_requests.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.assistance_requests[idx] = {
      ...this.data.assistance_requests[idx],
      ...updates,
    };
    this.save();
    return this.data.assistance_requests[idx];
  }

  // Activity Logs
  public logActivity(activity: string, user?: { id: string; name: string; role: string }, metadata?: Record<string, any>) {
    const log: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      user_id: user?.id,
      user_name: user?.name,
      role: user?.role,
      activity,
      metadata,
      created_at: new Date().toISOString(),
    };
    this.data.activity_logs.unshift(log);
    // Keep max 1000 logs
    if (this.data.activity_logs.length > 1000) {
      this.data.activity_logs = this.data.activity_logs.slice(0, 1000);
    }
    this.save();
  }

  public getActivityLogs(limit: number = 100): ActivityLog[] {
    return this.data.activity_logs.slice(0, limit);
  }
}

export const db = new Database();
