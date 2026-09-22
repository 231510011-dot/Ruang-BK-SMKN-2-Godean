import React, { useState, useEffect } from 'react';
import { Journal } from '../../types';
import { api } from '../../api';
import {
  PenLine,
  MessageCircle,
  Eye,
  CheckCircle2,
  Send,
  User,
  Search,
} from 'lucide-react';

export const AdminJournals: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getJournals();
      // Only journals shared with counselor are visible to counselor
      setJournals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenFeedback = (j: Journal) => {
    setSelectedJournal(j);
    setFeedbackText(j.counselor_feedback || '');
  };

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJournal) return;

    setSubmitting(true);
    try {
      const updated = await api.giveJournalFeedback(selectedJournal.id, feedbackText);
      setJournals((prev) =>
        prev.map((j) => (j.id === selectedJournal.id ? updated : j))
      );
      setSelectedJournal(null);
      alert('Feedback bimbingan berhasil dikirim ke jurnal siswa.');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = journals.filter((j) => {
    const term = search.toLowerCase();
    return (
      (j.user_name && j.user_name.toLowerCase().includes(term)) ||
      j.title.toLowerCase().includes(term) ||
      j.feeling.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
            <PenLine className="w-3.5 h-3.5" />
            <span>Refleksi Siswa SMKN 2 Godean</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            📝 Jurnal & Refleksi Siswa ({journals.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hanya menampilkan jurnal refleksi yang secara sukarela diizinkan siswa untuk dibaca Guru BK.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa atau judul jurnal..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of Shared Journals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((j) => (
          <div
            key={j.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {j.user_name} ({j.user_class})
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(j.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Mood: {j.mood}
                </span>
              </div>

              <h5 className="text-sm font-bold text-slate-800">{j.title}</h5>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
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

              {j.counselor_feedback && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <p className="font-bold flex items-center gap-1 text-[11px] text-blue-950 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Feedback yang Diberikan:</span>
                  </p>
                  <p className="text-[11px]">{j.counselor_feedback}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleOpenFeedback(j)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{j.counselor_feedback ? 'Edit Feedback BK' : 'Beri Feedback BK'}</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200">
            <PenLine className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Belum ada jurnal yang dibagikan siswa.</p>
          </div>
        )}
      </div>

      {/* Modal Feedback */}
      {selectedJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Beri Masukan Bimbingan untuk Siswa
              </h3>
              <button
                onClick={() => setSelectedJournal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Batal
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Refleksi dari <strong>{selectedJournal.user_name}</strong>: "{selectedJournal.title}"
            </p>

            <form onSubmit={handleSaveFeedback} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Penguatan / Solusi dari Guru BK:
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Berikan kata-kata empati, motivasi, atau strategi perbaikan..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJournal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Kirim ke Jurnal Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
