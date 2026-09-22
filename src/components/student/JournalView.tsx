import React, { useState, useEffect } from 'react';
import { Journal, User } from '../../types';
import { api } from '../../api';
import {
  PenLine,
  Smile,
  Meh,
  Frown,
  Zap,
  Coffee,
  Flame,
  Plus,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface JournalViewProps {
  user: User;
}

export const JournalView: React.FC<JournalViewProps> = ({ user }) => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const [mood, setMood] = useState('Senang');
  const [title, setTitle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [problems, setProblems] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');
  const [improvements, setImprovements] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [isShared, setIsShared] = useState(false);

  const moodList = [
    { label: 'Sangat Senang', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-300' },
    { label: 'Senang', icon: Smile, color: 'text-emerald-500 bg-emerald-50 border-emerald-300' },
    { label: 'Biasa Saja', icon: Meh, color: 'text-sky-500 bg-sky-50 border-sky-300' },
    { label: 'Cemas', icon: Coffee, color: 'text-purple-500 bg-purple-50 border-purple-300' },
    { label: 'Sedih', icon: Frown, color: 'text-blue-500 bg-blue-50 border-blue-300' },
    { label: 'Lelah', icon: Coffee, color: 'text-slate-500 bg-slate-50 border-slate-300' },
    { label: 'Marah', icon: Flame, color: 'text-rose-500 bg-rose-50 border-rose-300' },
  ];

  const loadJournals = async () => {
    setLoading(true);
    try {
      const data = await api.getJournals();
      setJournals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const created = await api.createJournal({
        mood,
        title,
        feeling,
        problems,
        actions_taken: actionsTaken,
        improvements,
        next_goals: nextGoals,
        is_shared_with_counselor: isShared,
      });

      setJournals((prev) => [created, ...prev]);
      setSuccessMsg('Jurnal dan refleksimu berhasil disimpan.');
      setTitle('');
      setFeeling('');
      setProblems('');
      setActionsTaken('');
      setImprovements('');
      setNextGoals('');
      setIsShared(false);
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan jurnal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
              <PenLine className="w-3.5 h-3.5" />
              <span>Ruang Sadar & Rekam Diri</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              📝 Jurnal & Refleksi Harian
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Tuliskan suasana hatimu, tantangan harian, dan rencanakan langkah solutif. Jurnal bersifat privat secara otomatis kecuali jika kamu memilih untuk membagikannya ke Guru BK.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'Tutup Formulir' : 'Tulis Jurnal Baru'}</span>
          </button>
        </div>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-5 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Formulir Refleksi Harian</span>
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mood Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bagaimana suasana hatimu saat ini? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {moodList.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.label;
                  return (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMood(m.label)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                        isSelected
                          ? `${m.color} ring-2 ring-amber-500/30 scale-102`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[11px] truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Catatan Jurnal *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Refleksi setelah praktik kejuruan hari ini"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apa yang saya rasakan hari ini? *
                </label>
                <textarea
                  rows={3}
                  required
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Gambarkan perasaanmu dan penyebabnya..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apa masalah / tantangan yang saya hadapi?
                </label>
                <textarea
                  rows={3}
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  placeholder="Tantangan tugas, teman, atau kelelahan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apa yang sudah saya lakukan untuk mengatasinya?
                </label>
                <textarea
                  rows={3}
                  value={actionsTaken}
                  onChange={(e) => setActionsTaken(e.target.value)}
                  placeholder="Upaya yang sudah dicoba..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apa yang ingin saya perbaiki ke depan?
                </label>
                <textarea
                  rows={3}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Sikap, cara komunikasi, atau manajemen waktu..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apa target saya berikutnya?
              </label>
              <input
                type="text"
                value={nextGoals}
                onChange={(e) => setNextGoals(e.target.value)}
                placeholder="Contoh: Mengatur jadwal belajar 30 menit setiap malam dan istirahat tepat waktu"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>

            {/* Counselor Sharing Toggle */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isShared ? (
                  <Eye className="w-5 h-5 text-amber-700 shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-500 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Izinkan Guru BK melihat jurnal ini
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Jika diaktifkan, Guru BK dapat membaca dan memberikan catatan bimbingan yang menguatkan
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Jurnal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journals History Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Riwayat Jurnal Refleksi ({journals.length})
        </h3>

        {journals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <PenLine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Belum ada jurnal yang ditulis</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Mulailah merefleksikan harimu untuk membangun ketenangan dan kebiasaan positif.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Tulis Jurnal Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journals.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      Mood: {j.mood}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      {j.is_shared_with_counselor ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Eye className="w-3 h-3" /> Dibagikan ke BK
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3" /> Privat
                        </span>
                      )}
                      <span>
                        {new Date(j.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    {j.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Perasaan:</strong> {j.feeling}
                  </p>

                  {j.problems && (
                    <p className="text-xs text-slate-600">
                      <strong>Tantangan:</strong> {j.problems}
                    </p>
                  )}

                  {j.next_goals && (
                    <p className="text-xs text-slate-600">
                      <strong>Target:</strong> {j.next_goals}
                    </p>
                  )}
                </div>

                {/* Counselor Feedback */}
                {j.counselor_feedback && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-blue-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Catatan Bimbingan Guru BK:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-blue-800">
                      "{j.counselor_feedback}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
