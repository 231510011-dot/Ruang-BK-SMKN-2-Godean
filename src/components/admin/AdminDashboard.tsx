import React from 'react';
import { AdminStatistics, User } from '../../types';
import {
  Users,
  BookOpen,
  MessageSquareHeart,
  CalendarCheck,
  BrainCircuit,
  PenLine,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStatistics | null;
  user: User;
  onNavigateTab: (tab: string) => void;
  onRefreshStats: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  user,
  onNavigateTab,
  onRefreshStats,
}) => {
  if (!stats) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-xs text-slate-500">Memuat statistik sistem BK...</p>
      </div>
    );
  }

  const { summary } = stats;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Pusat Kendali Guru BK SMKN 2 Godean
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2.5">
            Selamat Bertugas Guru BK SMKN 2 Godean 👋
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pantau dan layani kebutuhan bimbingan siswa secara real-time. Tinjau konsultasi yang masuk, konfirmasi jadwal konseling, dan analisa capaian self-assessment siswa.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('consultations')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Balas Konsultasi ({summary.pendingConsultations} Menunggu)
            </button>
            <button
              onClick={() => onNavigateTab('schedules')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-colors cursor-pointer"
            >
              Jadwal Hari Ini ({summary.schedulesToday})
            </button>
            <button
              onClick={onRefreshStats}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer ml-1"
            >
              Segarkan Data
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Alert Signal Banner if Any */}
      {summary.urgentAssistanceCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-rose-900">
                🚨 {summary.urgentAssistanceCount} Permintaan Bantuan Mendesak Siswa Perlu Penanganan!
              </h4>
              <p className="text-xs text-rose-700">
                Ada siswa yang mengirimkan sinyal "Saya Butuh Bantuan" dan membutuhkan respon segera.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('emergency')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Buka Meja Bantuan Darurat →
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Siswa Aktif</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.activeStudents}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total {summary.totalStudents} terdaftar</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Curhat Masuk</span>
            <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalConsultations}</p>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">
            {summary.pendingConsultations} perlu direspon
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Konseling Hari Ini</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.schedulesToday}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total {summary.totalSchedules} sesi diajukan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Self-Assessment</span>
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalAssessmentsCompleted}</p>
          <p className="text-[10px] text-slate-400 mt-1">Pengisian selesai</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Materi BK</span>
            <BookOpen className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalMaterials}</p>
          <p className="text-[10px] text-slate-400 mt-1">Materi aktif dipublikasi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500">Jurnal Siswa</span>
            <PenLine className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{summary.totalJournals}</p>
          <p className="text-[10px] text-slate-400 mt-1">Refleksi tercatat</p>
        </div>
      </div>

      {/* Two Columns: Today's Schedule & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Counseling Sessions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Agenda Konseling Hari Ini
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('schedules')}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Kelola Semua
              </button>
            </div>

            {stats.todaySchedulesList.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs">Tidak ada agenda konseling untuk hari ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.todaySchedulesList.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{s.user_name}</span>
                        <span className="text-[10px] text-slate-500">({s.user_class})</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {s.service_type} • Topik: {s.topic}
                      </p>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-1">
                        ⏰ {s.time} WIB ({s.counseling_mode})
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('schedules')}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 justify-end"
            >
              <span>Buka Kalender Konseling Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time System Activity Log */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Log Aktivitas Penggunaan Media
                </h3>
              </div>
              <span className="text-xs text-slate-400">Audit Trail Real-time</span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {stats.recentActivities.slice(0, 7).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start gap-2.5 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">
                      <strong className="text-slate-900">{act.user_name || 'Pengguna'}</strong>: {act.activity}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} WIB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigateTab('statistics')}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 justify-end"
            >
              <span>Lihat Rekapitulasi Statistik Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
