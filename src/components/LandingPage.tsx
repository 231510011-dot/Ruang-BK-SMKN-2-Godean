import React from 'react';
import {
  GraduationCap,
  BookOpen,
  MessageSquareHeart,
  CalendarCheck,
  BrainCircuit,
  Compass,
  PenLine,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  ArrowRight,
  School,
  Gamepad2,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (defaultTab?: 'siswa' | 'guru_bk') => void;
  onOpenEmergency: () => void;
  onNavigate?: (view: string) => void;
  onStartStudent?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onOpenEmergency,
  onNavigate,
  onStartStudent,
}) => {
  const services = [
    {
      id: 'materials',
      icon: BookOpen,
      color: 'bg-blue-500 text-white',
      badge: '4 Kategori',
      title: 'Materi Bimbingan & Konseling',
      desc: 'Materi terstruktur seputar BK Pribadi, BK Sosial, BK Belajar, dan BK Karier dilengkapi kuis singkat interaktif dan refleksi.',
    },
    {
      id: 'consultations',
      icon: MessageSquareHeart,
      color: 'bg-emerald-500 text-white',
      badge: 'Privat & Rahasia',
      title: 'Kotak Curhat & Konsultasi',
      desc: 'Sampaikan unek-unek atau kesulitan belajarmu dengan aman. Tersedia opsi kirim anonim dan balasan langsung dari Guru BK.',
    },
    {
      id: 'booking',
      icon: CalendarCheck,
      color: 'bg-indigo-500 text-white',
      badge: 'Bebas Antre',
      title: 'Booking Jadwal Konseling',
      desc: 'Pilih jadwal tatap muka di Ruang BK SMKN 2 Godean atau sesi online. Sistem anti-bentrok menjamin slot khusus untukmu.',
    },
    {
      id: 'assessments',
      icon: BrainCircuit,
      color: 'bg-purple-500 text-white',
      badge: 'Skala 1-5',
      title: 'Self-Assessment Mandiri',
      desc: 'Refleksi awal untuk mengenali kondisi belajar, manajemen waktu, kepercayaan diri, pertemanan, dan kesiapan karier.',
    },
    {
      id: 'games',
      icon: Gamepad2,
      color: 'bg-pink-500 text-white',
      badge: 'Online & Interaktif',
      title: 'Permainan Edukasi BK',
      desc: 'Mini-game edukatif untuk 4 bidang BK: Detektif Empati Sosial, Regulasi Emosi & Pernapasan, Tantangan Manajemen Waktu, dan Petualangan Karier Holland RIASEC.',
    },
    {
      id: 'career',
      icon: Compass,
      color: 'bg-amber-500 text-white',
      badge: 'BMW: Bekerja/Kuliah/Wirausaha',
      title: 'Karier & Masa Depan SMK',
      desc: 'Informasi persiapan PKL, tips CV lolos HRD, strategi wawancara, info beasiswa kuliah KIP-K, serta wirausaha muda.',
    },
    {
      id: 'journals',
      icon: PenLine,
      color: 'bg-rose-500 text-white',
      badge: 'Refleksi Harian',
      title: 'Jurnal & Refleksi Siswa',
      desc: 'Catat perasaan hari ini, tantangan yang dihadapi, dan target berikutnya. Sepenuhnya privat kecuali jika ingin kamu bagikan.',
    },
  ];

  const handleGoStudent = (viewId: string = 'dashboard') => {
    if (onNavigate) {
      onNavigate(viewId);
    } else if (onStartStudent) {
      onStartStudent();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* School Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6">
              <School className="w-4 h-4 text-blue-700" />
              <span>Portal Resmi Bimbingan & Konseling SMKN 2 Godean</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
              Ruang BK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600">SMKN 2 Godean</span>
            </h1>

            <p className="mt-5 text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
              “Temanmu untuk Mengenal Diri, Berkembang, dan Merencanakan Masa Depan.”
            </p>

            {/* Main Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                id="btn-hero-siswa"
                onClick={() => handleGoStudent('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <span>Buka Layanan Siswa (Tanpa Login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-guru"
                onClick={() => onOpenAuth('guru_bk')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Login Guru BK</span>
              </button>

              <button
                id="btn-hero-emergency"
                onClick={onOpenEmergency}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-sm sm:text-base transition-all cursor-pointer"
              >
                <span>🚨 Butuh Bantuan Cepat?</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200/50">
            Layanan Unggulan
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ruang Nyaman untuk Setiap Siswa SMK
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Disediakan khusus untuk mendukung perkembangan akademis, keterampilan kejuruan, kepribadian, dan karier masa depan siswa SMKN 2 Godean (Dapat diakses langsung tanpa registrasi).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                onClick={() => handleGoStudent(svc.id)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${svc.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {svc.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>Buka Layanan Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assurance / Trust Section */}
      <section className="bg-slate-900 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Kerahasiaan Terjamin</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Semua sesi curhat dan catatan konseling dilindungi etika profesi bimbingan konseling dan keamanan enkripsi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Terbuka Tanpa Menghakimi</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ruang BK bukan tempat siswa "bermasalah", melainkan kawan bertumbuh untuk mengurai tantangan dan meraih potensi terbaik.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Akses Layanan Fleksibel</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Akses materi, pengisian jurnal, dan booking jadwal kapan saja melalui smartphone tanpa perlu menunggu jam istirahat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Ruang BK SMKN 2 Godean
              </p>
              <p className="text-[11px] text-slate-500">
                Jl. Senuko, Sidoagung, Godean, Sleman, Daerah Istimewa Yogyakarta
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center sm:text-right">
            © 2026 Layanan Bimbingan dan Konseling SMKN 2 Godean. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};
