import React from 'react';
import { User, Material, CounselingSchedule, Consultation, Journal } from '../../types';
import {
  BookOpen,
  BrainCircuit,
  MessageSquareHeart,
  CalendarCheck,
  AlertCircle,
  PenLine,
  Compass,
  User as UserIcon,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Gamepad2,
} from 'lucide-react';

interface StudentDashboardProps {
  user?: User | null;
  onNavigate: (view: string) => void;
  onOpenEmergency: () => void;
  recentMaterials: Material[];
  upcomingSchedules: CounselingSchedule[];
  recentConsultation?: Consultation;
  latestJournal?: Journal;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigate,
  onOpenEmergency,
  recentMaterials,
  upcomingSchedules,
  recentConsultation,
  latestJournal,
}) => {
  const localName = typeof window !== 'undefined' ? localStorage.getItem('ruang_bk_student_name') : null;
  const localClass = typeof window !== 'undefined' ? localStorage.getItem('ruang_bk_student_class') : null;
  const displayName = user?.name || localName || 'Siswa SMKN 2 Godean';
  const displayClass = user?.class || localClass || 'SMK Negeri 2 Godean';

  const menuItems = [
    {
      id: 'materials',
      title: 'Materi BK',
      icon: BookOpen,
      color: 'bg-blue-600 text-white',
      badge: '4 Bidang',
      desc: 'Pribadi, Sosial, Belajar, dan Karier',
    },
    {
      id: 'assessments',
      title: 'Self-Assessment',
      icon: BrainCircuit,
      color: 'bg-purple-600 text-white',
      badge: 'Skala 1-5',
      desc: 'Refleksi kondisi belajar & percaya diri',
    },
    {
      id: 'consultations',
      title: 'Konsultasi BK',
      icon: MessageSquareHeart,
      color: 'bg-emerald-600 text-white',
      badge: 'Privat',
      desc: 'Kotak curhat aman dengan Guru BK',
    },
    {
      id: 'booking',
      title: 'Booking Konseling',
      icon: CalendarCheck,
      color: 'bg-indigo-600 text-white',
      badge: 'Jadwal Teratur',
      desc: 'Pilih waktu tatap muka atau online',
    },
    {
      id: 'emergency',
      title: 'Saya Butuh Bantuan',
      icon: AlertCircle,
      color: 'bg-rose-600 text-white',
      badge: 'Prioritas',
      desc: 'Sinyal bantuan segera untuk Guru BK',
      onClick: onOpenEmergency,
    },
    {
      id: 'journals',
      title: 'Jurnal & Refleksi',
      icon: PenLine,
      color: 'bg-amber-600 text-white',
      badge: 'Harian',
      desc: 'Tulis mood, target, dan solusi masalah',
    },
    {
      id: 'career',
      title: 'Karier & Masa Depan',
      icon: Compass,
      color: 'bg-teal-600 text-white',
      badge: 'BMW',
      desc: 'PKL, CV, Lowongan, Kuliah, Wirausaha',
    },
    {
      id: 'games',
      title: 'Permainan Online BK',
      icon: Gamepad2,
      color: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white',
      badge: 'Interaktif 4 Bidang',
      desc: 'Game edukasi emosi, empati, prioritas, & karier',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal Siswa SMKN 2 Godean (Akses Terbuka)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Ruang BK 👋
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
            Halo, <strong className="text-white">{displayName}</strong> ({displayClass}). Akses seluruh layanan Bimbingan dan Konseling SMKN 2 Godean secara langsung tanpa perlu login.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('consultations')}
              className="px-4 py-2 rounded-xl bg-white text-blue-800 text-xs font-bold hover:bg-blue-50 transition-colors shadow-xs cursor-pointer"
            >
              Kirim Curhat Sekarang
            </button>
            <button
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white border border-white/20 text-xs font-bold transition-colors cursor-pointer"
            >
              Booking Jadwal Konseling
            </button>
            <button
              onClick={() => onNavigate('journals')}
              className="px-4 py-2 rounded-xl bg-amber-500/80 hover:bg-amber-500 text-white border border-white/20 text-xs font-bold transition-colors cursor-pointer"
            >
              Tulis Jurnal Refleksi
            </button>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              🚨 Butuh Bantuan Segera
            </button>
          </div>
        </div>

        {/* Decorative soft circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* 8 Main Menu Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Layanan & Menu Utama
          </h3>
          <span className="text-xs text-slate-500">Pilih menu yang kamu butuhkan</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => (item.onClick ? item.onClick() : onNavigate(item.id))}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-[11px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status & Live Updates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Counseling Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Jadwal Konseling Terdekat
                </h4>
              </div>
              <button
                onClick={() => onNavigate('booking')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            {upcomingSchedules && upcomingSchedules.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {upcomingSchedules[0].service_type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      upcomingSchedules[0].status === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-800'
                        : upcomingSchedules[0].status === 'Menunggu persetujuan'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {upcomingSchedules[0].status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">
                  Topik: {upcomingSchedules[0].topic}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span>📅 {upcomingSchedules[0].date}</span>
                  <span>⏰ {upcomingSchedules[0].time}</span>
                  <span>📍 {upcomingSchedules[0].counseling_mode}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Belum ada jadwal konseling aktif.</p>
                <button
                  onClick={() => onNavigate('booking')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Booking Jadwal Baru
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mode Konseling: Tatap Muka / Online</span>
          </div>
        </div>

        {/* Latest Consultation Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Status Kotak Curhat
                </h4>
              </div>
              <button
                onClick={() => onNavigate('consultations')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Semua Curhat
              </button>
            </div>

            {recentConsultation ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {recentConsultation.topic}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      recentConsultation.status === 'Sudah Ditanggapi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {recentConsultation.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {recentConsultation.response
                    ? `Jawaban Guru BK: "${recentConsultation.response}"`
                    : recentConsultation.message}
                </p>
                <p className="text-[10px] text-slate-400">
                  Urgensi: <span className="capitalize font-semibold">{recentConsultation.urgency}</span>
                </p>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Belum ada konsultasi yang dikirim.</p>
                <button
                  onClick={() => onNavigate('consultations')}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  + Tulis Curhat Pertama
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Privat & Terjamin Rahasia</span>
          </div>
        </div>

        {/* Latest Journal & Mood */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <PenLine className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Jurnal & Refleksi Terakhir
                </h4>
              </div>
              <button
                onClick={() => onNavigate('journals')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Buka Jurnal
              </button>
            </div>

            {latestJournal ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {latestJournal.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Mood: {latestJournal.mood}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {latestJournal.feeling}
                </p>
                {latestJournal.counselor_feedback && (
                  <p className="text-[11px] text-blue-700 bg-blue-50 p-1.5 rounded font-medium">
                    Feedback BK: {latestJournal.counselor_feedback}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">Belum ada jurnal yang ditulis.</p>
                <button
                  onClick={() => onNavigate('journals')}
                  className="mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  + Tulis Jurnal Hari Ini
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Membangun kesadaran diri setiap hari</span>
          </div>
        </div>
      </div>

      {/* Recommended BK Materials */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Materi BK Terbaru Untukmu
            </h3>
            <p className="text-xs text-slate-500">Materi bimbingan pilihan untuk pengembangan diri</p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <span>Semua Materi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentMaterials.slice(0, 3).map((mat) => (
            <div
              key={mat.id}
              onClick={() => onNavigate('materials')}
              className="rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                {mat.image ? (
                  <img
                    src={mat.image}
                    alt={mat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                    BK SMKN 2 Godean
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                  {mat.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {mat.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {mat.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Dibaca {mat.read_count || 0}x
                  </span>
                  <span className="font-semibold text-blue-600">Baca Materi →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
