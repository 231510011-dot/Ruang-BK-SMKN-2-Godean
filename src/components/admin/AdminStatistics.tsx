import React, { useState, useEffect } from 'react';
import { AdminStatistics } from '../../types';
import { api } from '../../api';
import {
  TrendingUp,
  Download,
  Printer,
  Calendar,
  BookOpen,
  Users,
  MessageSquareHeart,
  CalendarCheck,
  BrainCircuit,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export const AdminStatisticsComponent: React.FC = () => {
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'semester'>('month');
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async (f = filter) => {
    setLoading(true);
    try {
      const data = await api.getAdminStats(f);
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(filter);
  }, [filter]);

  const handlePrint = () => {
    window.print();
  };

  if (!stats) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-xs text-slate-500">Memuat data rekapitulasi statistik...</p>
      </div>
    );
  }

  const { summary } = stats;

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Laporan & Analitik Penggunaan Layanan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            📈 Rekap & Statistik Penggunaan Media BK
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data keterlibatan siswa, efektivitas materi bimbingan, konsultasi, dan rekap semesteran.
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: 'today', label: 'Hari Ini' },
              { key: 'week', label: '1 Minggu Terakhir' },
              { key: 'month', label: '1 Bulan Terakhir' },
              { key: 'semester', label: '1 Semester' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === item.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cetak Laporan"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* CSV Export Quick Center */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Pusat Unduhan Rekapitulasi (Format CSV / Excel)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Unduh data mentah bimbingan konseling untuk arsip administrasi akreditasi sekolah SMKN 2 Godean.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={api.getExportCsvUrl('consultations')}
              download="rekap_konsultasi_bk.csv"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Data Konsultasi</span>
            </a>
            <a
              href={api.getExportCsvUrl('schedules')}
              download="rekap_jadwal_konseling.csv"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Jadwal Konseling</span>
            </a>
            <a
              href={api.getExportCsvUrl('assessments')}
              download="rekap_self_assessment.csv"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Self-Assessment</span>
            </a>
            <a
              href={api.getExportCsvUrl('logs')}
              download="log_aktivitas_media.csv"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Log Aktivitas</span>
            </a>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Total Siswa Terdaftar</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{summary.totalStudents}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            ✓ {summary.activeStudents} Siswa Aktif Berinteraksi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Konsultasi BK</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{summary.totalConsultations}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {summary.pendingConsultations} Menunggu Tanggapan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Jadwal Konseling</span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">{summary.totalSchedules}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            {summary.schedulesToday} Sesi untuk Hari Ini
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Self-Assessment Tuntas</span>
          <p className="text-3xl font-extrabold text-purple-600 mt-1">{summary.totalAssessmentsCompleted}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Instrumen Refleksi Terisi
          </p>
        </div>
      </div>

      {/* Materials Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top vs Least Read Materials */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <span>Materi Paling Banyak Dibaca vs Perlu Dipromosikan</span>
          </h3>

          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
              🏆 3 Materi Paling Banyak Dibaca:
            </h4>
            <div className="space-y-2">
              {stats.topMaterials.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 truncate max-w-xs">
                    #{idx + 1} {m.title}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {m.read_count}x dibaca
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              📌 Materi yang Perlu Disosialisasikan Lebih Lanjut:
            </h4>
            <div className="space-y-2">
              {stats.leastMaterials.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-slate-700 truncate max-w-xs">
                    {m.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {m.read_count}x dibaca
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Access Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Distribusi Pembacaan Berdasarkan Kategori BK</span>
          </h3>

          <div className="space-y-4 pt-2">
            {stats.categoryDistribution.map((item) => {
              const total = stats.categoryDistribution.reduce((acc, c) => acc + c.value, 0) || 1;
              const percent = Math.round((item.value / total) * 100);

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-extrabold text-blue-600">
                      {item.value}x ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-0.5">Catatan Bimbingan:</p>
            <p className="text-[11px] leading-relaxed">
              Materi BK Karier dan BK Belajar menunjukkan antusiasme tertinggi terutama menjelang musim penempatan Praktik Kerja Lapangan (PKL) dan ujian kompetensi keahlian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
