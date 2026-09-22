import React, { useState, useEffect } from 'react';
import { Consultation, UrgencyLevel, User } from '../../types';
import { api } from '../../api';
import {
  MessageSquareHeart,
  Send,
  Lock,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface ConsultationViewProps {
  user: User;
  initialTopic?: string;
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({
  user,
  initialTopic = '',
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  // Form State
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await api.getConsultations();
      setConsultations(data);
      if (data.length > 0 && !selectedConsultation) {
        setSelectedConsultation(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const created = await api.createConsultation({
        topic,
        message,
        urgency,
        is_anonymous: isAnonymous,
      });

      setConsultations((prev) => [created, ...prev]);
      setSelectedConsultation(created);
      setSuccessMsg('Curhatmu berhasil dikirimkan ke Guru BK.');
      setTopic('');
      setMessage('');
      setUrgency('sedang');
      setIsAnonymous(false);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim konsultasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sudah Ditanggapi':
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Dalam Proses':
      case 'Dibaca Guru BK':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getUrgencyBadge = (urg: string) => {
    switch (urg) {
      case 'darurat':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'tinggi':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'sedang':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Ruang Cerita & Bimbingan Privat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              💬 Kotak Curhat & Konsultasi BK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Tuliskan unek-unek, kegelisahan, masalah belajar, pertemanan, atau rencana masa depan. Guru BK akan membaca dan memberikan balasan penuh empati.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kerahasiaan terjamin etika profesi Guru BK SMKN 2 Godean</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Send Consultation (Left Column) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Kirim Konsultasi Baru</span>
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik / Perihal Konsultasi *
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Kesulitan mengatur waktu antara tugas dan PKL"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cerita / Keluhan Lengkap *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan apa yang kamu rasakan, kronologi singkat, atau apa yang sedang membebanimu. Tidak perlu takut salah kata..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              ></textarea>
            </div>

            {/* Urgency Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tingkat Urgensi Konsultasi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['rendah', 'sedang', 'tinggi', 'darurat'] as UrgencyLevel[]).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setUrgency(urg)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                      urgency === urg
                        ? urg === 'darurat'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Kirim sebagai Anonim</p>
                  <p className="text-[11px] text-slate-500">
                    Nama dan identitasmu akan disamarkan dari tampilan
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Mengirimkan...' : 'Kirim Konsultasi ke Guru BK'}</span>
            </button>
          </form>
        </div>

        {/* Consultation History & Details (Right Column) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Riwayat Kotak Curhat ({consultations.length})</span>
              <button
                onClick={loadConsultations}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Muat Ulang
              </button>
            </h3>

            {consultations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <MessageSquareHeart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-500">
                  Belum ada konsultasi yang kamu kirimkan.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gunakan formulir di samping untuk mulai berbagi cerita.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConsultation(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedConsultation?.id === c.id
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">
                        {c.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {c.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="capitalize font-semibold text-slate-500">
                        Urgensi: {c.urgency}
                      </span>
                      <span>
                        {new Date(c.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Counselor Response Snippet if available */}
                    {c.response && (
                      <div className="mt-2.5 p-2 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          <strong>Guru BK:</strong> "{c.response}"
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
