import React, { useState, useEffect } from 'react';
import { Consultation, ConsultationStatus, UrgencyLevel } from '../../types';
import { api } from '../../api';
import {
  MessageSquareHeart,
  Search,
  CheckCircle2,
  Clock,
  Lock,
  Send,
  UserCheck,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface AdminConsultationsProps {
  onRefreshStats?: () => void;
}

export const AdminConsultations: React.FC<AdminConsultationsProps> = ({
  onRefreshStats,
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Response form
  const [responseText, setResponseText] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [newStatus, setNewStatus] = useState<ConsultationStatus>('Sudah Ditanggapi');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getConsultations();
      setConsultations(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
        setResponseText(data[0].response || '');
        setFollowUpNotes(data[0].follow_up_notes || '');
        setNewStatus(data[0].status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (c: Consultation) => {
    setSelected(c);
    setResponseText(c.response || '');
    setFollowUpNotes(c.follow_up_notes || '');
    setNewStatus(c.status);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setSubmitting(true);
    try {
      const updated = await api.updateConsultation(selected.id, {
        status: newStatus,
        response: responseText,
        follow_up_notes: followUpNotes,
      });

      setConsultations((prev) =>
        prev.map((c) => (c.id === selected.id ? updated : c))
      );
      setSelected(updated);
      if (onRefreshStats) onRefreshStats();
      alert('Tanggapan dan status konsultasi berhasil diperbarui.');
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui konsultasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = consultations.filter((c) => {
    const matchStatus = statusFilter === 'Semua' || c.status === statusFilter;
    const matchUrgency = urgencyFilter === 'Semua' || c.urgency === urgencyFilter;
    const matchSearch =
      !search.trim() ||
      c.topic.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase()) ||
      (c.user_name && c.user_name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchUrgency && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Layanan Konsultasi & Kotak Curhat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            💬 Tanggapi Konsultasi Siswa ({consultations.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Beri tanggapan, arahan psikopedagogis, dan catatan tindak lanjut untuk siswa.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="Semua">Semua Status</option>
            <option value="Terkirim">Terkirim</option>
            <option value="Dibaca Guru BK">Dibaca Guru BK</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Sudah Ditanggapi">Sudah Ditanggapi</option>
            <option value="Selesai">Selesai</option>
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="Semua">Semua Urgensi</option>
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
            <option value="darurat">Darurat</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Consultations List */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama siswa atau topik..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selected?.id === c.id
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                    {c.is_anonymous ? '🤫 Siswa Anonim' : c.user_name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      c.urgency === 'darurat'
                        ? 'bg-rose-100 text-rose-800'
                        : c.urgency === 'tinggi'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.urgency}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 line-clamp-1">{c.topic}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{c.message}</p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-emerald-700">{c.status}</span>
                  <span>{new Date(c.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                Tidak ada data konsultasi.
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail & Reply Desk */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          {selected ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {selected.is_anonymous ? 'Siswa Anonim (Rahasia)' : `${selected.user_name} (${selected.user_class})`}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selected.urgency === 'darurat'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Urgensi: {selected.urgency}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(selected.created_at).toLocaleString('id-ID')}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2">
                  {selected.topic}
                </h3>
              </div>

              {/* Student Message Body */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Isi Curhat Siswa:
                </p>
                {selected.message}
              </div>

              {/* Status Update Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ubah Status Konsultasi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {(['Terkirim', 'Dibaca Guru BK', 'Dalam Proses', 'Sudah Ditanggapi', 'Selesai'] as ConsultationStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewStatus(st)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                          newStatus === st
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Counselor Response */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Balasan / Tanggapan Guru BK (Dapat Dibaca Siswa) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tuliskan kata-kata penguatan, solusi bimbingan, atau ajakan diskusi lebih lanjut..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                ></textarea>
              </div>

              {/* Internal Counselor Follow-up Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tindak Lanjut Internal BK (Khusus Arsip Guru BK)
                </label>
                <textarea
                  rows={2}
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Contoh: Perlu dijadwalkan sesi tatap muka lanjutan atau koordinasi dengan wali kelas..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-amber-50/50"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Kirim Tanggapan ke Siswa'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <MessageSquareHeart className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Pilih salah satu konsultasi siswa dari daftar di sebelah kiri.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
