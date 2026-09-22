-- ========================================================
-- DATABASE SCHEMA: RUANG BK SMKN 2 GODEAN
-- Platform Layanan Bimbingan & Konseling Digital
-- Kompatibel dengan PostgreSQL / Supabase
-- ========================================================

-- 1. Tabel Users (Pengguna: Siswa dan Guru BK)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('siswa', 'guru_bk')),
    nis VARCHAR(30),
    class VARCHAR(50),
    major VARCHAR(100),
    avatar_url TEXT,
    must_change_password BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Materials (Materi Layanan BK)
-- Kategori: BK Pribadi, BK Sosial, BK Belajar, BK Karier
CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('BK Pribadi', 'BK Sosial', 'BK Belajar', 'BK Karier')),
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    video_url TEXT,
    quiz_data JSONB,
    reflection_prompt TEXT,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Assessments (Instrumen Self-Assessment Siswa)
-- Kategori: Kondisi belajar, Manajemen waktu, Kepercayaan diri, Relasi sosial, Perencanaan karier, Penggunaan media sosial
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Assessment Results (Hasil Self-Assessment)
CREATE TABLE IF NOT EXISTS assessment_results (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    interpretation TEXT NOT NULL,
    recommendations JSONB NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Consultations (Kotak Curhat / Konsultasi Siswa)
-- Urgency: rendah, sedang, tinggi, darurat
-- Status: Terkirim, Dibaca Guru BK, Dalam Proses, Sudah Ditanggapi, Selesai
CREATE TABLE IF NOT EXISTS consultations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('rendah', 'sedang', 'tinggi', 'darurat')),
    status VARCHAR(30) NOT NULL DEFAULT 'Terkirim' CHECK (status IN ('Terkirim', 'Dibaca Guru BK', 'Dalam Proses', 'Sudah Ditanggapi', 'Selesai')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    response TEXT,
    follow_up_notes TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Counseling Schedules (Booking Jadwal Konseling)
-- Type: Tatap Muka (Ruang BK), Online (Video/Chat)
-- Status: Menunggu persetujuan, Disetujui, Ditolak, Selesai, Dibatalkan
CREATE TABLE IF NOT EXISTS counseling_schedules (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    topic TEXT NOT NULL,
    counseling_mode VARCHAR(30) NOT NULL CHECK (counseling_mode IN ('Tatap Muka', 'Online')),
    status VARCHAR(30) NOT NULL DEFAULT 'Menunggu persetujuan' CHECK (status IN ('Menunggu persetujuan', 'Disetujui', 'Ditolak', 'Selesai', 'Dibatalkan')),
    rejection_reason TEXT,
    notes TEXT,
    location_or_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Journals (Jurnal / Refleksi Siswa)
CREATE TABLE IF NOT EXISTS journals (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    feeling TEXT NOT NULL,
    problems TEXT,
    actions_taken TEXT,
    improvements TEXT,
    next_goals TEXT,
    is_shared_with_counselor BOOLEAN DEFAULT FALSE,
    counselor_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Career Contents (Informasi Karier & Masa Depan)
-- Kategori: Dunia Kerja, Kuliah, PKL, Wirausaha, Persiapan CV, Persiapan Interview, Lowongan, Jurusan Kuliah, Perencanaan
CREATE TABLE IF NOT EXISTS career_contents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    tags JSONB,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabel Career Plans (Rencana Masa Depanku Siswa)
CREATE TABLE IF NOT EXISTS career_plans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    main_choice VARCHAR(50) NOT NULL, -- Bekerja, Kuliah, Wirausaha, Bekerja sambil kuliah, Masih belum menentukan
    target_after_grad TEXT NOT NULL,
    target_1_year TEXT NOT NULL,
    target_3_years TEXT NOT NULL,
    skills_needed TEXT NOT NULL,
    action_steps TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel Assistance Requests (Tombol 🚨 Saya Butuh Bantuan)
CREATE TABLE IF NOT EXISTS assistance_requests (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(150) NOT NULL,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'Perlu Ditangani Segera' CHECK (status IN ('Perlu Ditangani Segera', 'Sedang Dihubungi', 'Selesai')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabel Activity Logs (Catatan Aktivitas Penggunaan Aplikasi)
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(150),
    role VARCHAR(20),
    activity TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes untuk optimasi query
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_schedules_date_time ON counseling_schedules(date, time);
CREATE INDEX IF NOT EXISTS idx_journals_user ON journals(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
