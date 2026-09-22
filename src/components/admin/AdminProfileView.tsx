import React from 'react';
import { User, AdminStatistics } from '../../types';
import {
  ShieldCheck,
  KeyRound,
  Building2,
  MapPin,
  Clock,
  HeartHandshake,
  Award,
  BookOpen,
  MessageSquareHeart,
  CalendarCheck,
  Shield,
} from 'lucide-react';

interface AdminProfileViewProps {
  user: User;
  onOpenChangePassword: () => void;
  stats: AdminStatistics | null;
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  user,
  onOpenChangePassword,
  stats,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-blue-700 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            BK
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Akun Resmi Guru BK</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Guru BK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Bimbingan dan Konseling • <span className="font-semibold text-slate-700">SMKN 2 Godean</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChangePassword}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <KeyRound className="w-4 h-4 text-slate-500" />
          <span>Ganti Password Guru BK</span>
        </button>
      </div>

      {/* Service & Operational Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-600 mb-3">
            <Building2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-800">Unit Kerja Layanan</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Layanan Bimbingan dan Konseling SMKN 2 Godean untuk seluruh peserta didik tingkat X, XI, dan XII pada seluruh kompetensi kejuruan.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium text-slate-700">Ruang BK SMKN 2 Godean</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-indigo-600 mb-3">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-800">Waktu & Sesi Konseling</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Melayani konsultasi daring dan tatap muka terjadwal setiap hari sekolah.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
            <p>• <strong>Senin – Kamis:</strong> 07.30 – 15.30 WIB</p>
            <p>• <strong>Jumat:</strong> 07.30 – 14.30 WIB</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-600 mb-3">
            <Shield className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-800">Prinsip Kerahasiaan BK</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap informasi, riwayat konseling, curhat, dan hasil asesmen siswa dilindungi penuh asas kerahasiaan profesi bimbingan dan konseling.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <Award className="w-4 h-4" />
            <span>Etika Profesi Konseling Sekolah</span>
          </div>
        </div>
      </div>

      {/* Scope of 4 BK Services */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-indigo-600" />
          <span>4 Bidang Pelayanan Bimbingan Konseling SMKN 2 Godean</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              Bidang 1
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">BK Pribadi</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Pengembangan pemahaman diri, regulasi emosi, penerimaan diri, kepercayaan diri, dan kedisiplinan pribadi siswa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Bidang 2
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">BK Sosial</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Keterampilan komunikasi asertif, empati sosial, hubungan pertemanan sehat, pencegahan perundungan, dan adaptasi lingkungan SMK.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Bidang 3
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">BK Belajar</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Manajemen waktu, strategi belajar produktif kejuruan, mengatasi prokrastinasi, dan kesiapan menghadapi ujian kompetensi keahlian.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Bidang 4
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-2">BK Karier</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Eksplorasi minat bakat kejuruan, kesiapan PKL, informasi bursa kerja (BKK), dan perencanaan masa depan (Bekerja, Melanjutkan, Wirausaha).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary of Service Stats */}
      {stats && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
            Rekap Layanan BK Berjalan
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-2xl font-extrabold">{stats.summary.totalConsultations}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Curhat Masuk</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-2xl font-extrabold">{stats.summary.totalSchedules}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Sesi Konseling</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-2xl font-extrabold">{stats.summary.totalAssessmentsCompleted}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Asesmen Selesai</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-2xl font-extrabold">{stats.summary.activeStudents}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Siswa Terlayani</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
