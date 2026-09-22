import React from 'react';
import { User, CounselingSchedule, Consultation, AssessmentResult, Journal } from '../../types';
import {
  User as UserIcon,
  GraduationCap,
  Calendar,
  MessageSquareHeart,
  BrainCircuit,
  PenLine,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface StudentProfileViewProps {
  user: User;
  onOpenChangePassword: () => void;
  schedulesCount: number;
  consultationsCount: number;
  assessmentsCount: number;
  journalsCount: number;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  user,
  onOpenChangePassword,
  schedulesCount,
  consultationsCount,
  assessmentsCount,
  journalsCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Siswa Terdaftar SMKN 2 Godean</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              NISN: <span className="font-mono text-slate-700 font-semibold">{user.username}</span> • {user.class || 'SMK'} ({user.major || 'Kompetensi Kejuruan'})
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChangePassword}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-slate-500" />
          <span>Ganti Password Akun</span>
        </button>
      </div>

      {/* Participation Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Konseling</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{schedulesCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Sesi Dijadwalkan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Curhat Daring</span>
            <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{consultationsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Konsultasi Diajukan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Self-Assessment</span>
            <BrainCircuit className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{assessmentsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Instrumen Tuntas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Jurnal Harian</span>
            <PenLine className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{journalsCount}</p>
          <p className="text-[10px] text-slate-400 mt-1">Catatan Refleksi Diri</p>
        </div>
      </div>

      {/* Profile Details & Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
          Informasi Bimbingan & Konseling
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block mb-0.5">Sekolah:</span>
            <span className="font-bold text-slate-800">SMK Negeri 2 Godean Sleman</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block mb-0.5">Status Bimbingan:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aktif Berbimbingan & Terlindungi Kerahasiaan</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block mb-0.5">Alamat Ruang BK Fisik:</span>
            <span className="font-bold text-slate-800">Ruang BK Gedung Utama, SMKN 2 Godean</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block mb-0.5">Jadwal Pelayanan BK di Sekolah:</span>
            <span className="font-bold text-slate-800">Senin - Jumat: 07.30 - 15.30 WIB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
