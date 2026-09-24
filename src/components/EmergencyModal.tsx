import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import {
  AlertTriangle,
  X,
  PhoneCall,
  ShieldAlert,
  Send,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onOpenConsultationDirect?: (topic: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenConsultationDirect,
}) => {
  const options = [
    'Saya ingin berbicara dengan Guru BK',
    'Saya sedang mengalami masalah dengan teman',
    'Saya mengalami masalah belajar',
    'Saya mengalami masalah pribadi',
    'Saya membutuhkan bantuan terkait karier',
    'Saya merasa tidak aman',
    'Lainnya',
  ];

  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('ruang_bk_student_name') || user?.name || '';
  });
  const [studentClass, setStudentClass] = useState(() => {
    return localStorage.getItem('ruang_bk_student_class') || user?.class || 'Kelas 10 DPB';
  });

  const [selectedCategory, setSelectedCategory] = useState(options[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (studentName.trim()) {
        localStorage.setItem('ruang_bk_student_name', studentName.trim());
      }
      if (studentClass.trim()) {
        localStorage.setItem('ruang_bk_student_class', studentClass.trim());
      }

      await api.sendEmergencyAssistance({
        category: selectedCategory,
        notes,
        student_name: studentName.trim() || 'Siswa SMKN 2 Godean (Mendesak)',
        student_class: studentClass.trim() || 'SMKN 2 Godean',
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Gagal mengirimkan permintaan bantuan.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickConsult = () => {
    onClose();
    if (onOpenConsultationDirect) {
      onOpenConsultationDirect(`[Bantuan Cepat] ${selectedCategory}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden relative">
        {/* Header Alert */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-600 to-red-700 text-white relative">
          <button
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Layanan Prioritas Siswa
              </span>
              <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
                🚨 Saya Butuh Bantuan
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Emergency Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-900 mb-1">PENTING:</p>
              <p className="text-xs text-rose-800 leading-relaxed font-medium">
                “Jika kamu berada dalam keadaan darurat atau merasa berada dalam bahaya, segera hubungi orang dewasa yang dapat dipercaya atau layanan darurat setempat.”
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-rose-700">
                <span className="px-2 py-1 rounded bg-rose-100/80">Layanan Darurat: 112</span>
                <span className="px-2 py-1 rounded bg-rose-100/80">Hotline SAPA Anak: 129</span>
                <span className="px-2 py-1 rounded bg-rose-100/80">Puskesmas Godean I: (0274) 798028</span>
              </div>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                Permintaan Bantuan Terkirim!
              </h4>
              <p className="mt-2 text-xs text-slate-600 max-w-sm mx-auto">
                Guru BK SMKN 2 Godean telah menerima notifikasi prioritas tinggi dan akan segera menghubungimu atau mengajakmu berbicara.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Siswa (Opsional/Boleh Anonim):
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nama lengkapmu"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kelas:
                  </label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="Contoh: Kelas 10 DPB"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Apa yang sedang kamu rasakan atau butuhkan saat ini?
                </label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        selectedCategory === opt
                          ? 'border-rose-500 bg-rose-50/70 text-rose-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === opt}
                        onChange={() => setSelectedCategory(opt)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ceritakan sedikit apa yang terjadi jika kamu merasa nyaman untuk menuliskannya..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                ></textarea>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Mengirim Sinyal...' : 'Kirim Sinyal ke Guru BK'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickConsult}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-blue-600" />
                  <span>Kirim Kotak Curhat</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
