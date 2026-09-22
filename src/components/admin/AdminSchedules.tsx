import React, { useState, useEffect } from 'react';
import { CounselingSchedule, ScheduleStatus } from '../../types';
import { api } from '../../api';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Video,
  AlertCircle,
  Check,
  X,
  FileText,
} from 'lucide-react';

interface AdminSchedulesProps {
  onRefreshStats?: () => void;
}

export const AdminSchedules: React.FC<AdminSchedulesProps> = ({ onRefreshStats }) => {
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [loading, setLoading] = useState(false);

  // Action Modal State
  const [activeActionModal, setActiveActionModal] = useState<{
    type: 'approve' | 'reject' | 'complete';
    schedule: CounselingSchedule;
  } | null>(null);

  const [notes, setNotes] = useState('');
  const [locationOrLink, setLocationOrLink] = useState('Ruang BK SMKN 2 Godean');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data: any = await api.getSchedules();
      if (Array.isArray(data)) {
        setSchedules(data);
      } else if (data && data.mySchedules) {
        setSchedules(data.mySchedules);
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

  const openApproveModal = (s: CounselingSchedule) => {
    setActiveActionModal({ type: 'approve', schedule: s });
    setNotes('Silakan hadir tepat waktu di ruang BK.');
    setLocationOrLink(
      s.counseling_mode === 'Online'
        ? 'https://meet.google.com/smkn2-bk-godean'
        : 'Ruang BK SMKN 2 Godean'
    );
  };

  const openRejectModal = (s: CounselingSchedule) => {
    setActiveActionModal({ type: 'reject', schedule: s });
    setRejectionReason('Mohon maaf, pada jam tersebut ada agenda rapat dinas guru. Silakan ajukan jadwal di slot lain.');
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal) return;

    setSubmitting(true);
    const { type, schedule } = activeActionModal;

    try {
      if (type === 'approve') {
        await api.updateSchedule(schedule.id, {
          status: 'Disetujui',
          notes,
          location_or_link: locationOrLink,
        });
      } else if (type === 'reject') {
        await api.updateSchedule(schedule.id, {
          status: 'Ditolak',
          rejection_reason: rejectionReason,
        });
      } else if (type === 'complete') {
        await api.updateSchedule(schedule.id, {
          status: 'Selesai',
        });
      }

      await loadData();
      if (onRefreshStats) onRefreshStats();
      setActiveActionModal(null);
    } catch (err: any) {
      alert(err.message || 'Gagal memproses status jadwal.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = schedules.filter(
    (s) => statusFilter === 'Semua' || s.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Manajemen Jadwal Bimbingan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            📅 Konfirmasi Jadwal Konseling Siswa ({schedules.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Setujui permohonan tatap muka atau online, atur ruang pertemuan, atau beri alasan jika jadwal perlu diubah.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
        >
          <option value="Semua">Semua Status</option>
          <option value="Menunggu persetujuan">Menunggu Persetujuan</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa / Kelas</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Layanan & Mode</th>
                <th className="py-3 px-4">Topik</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{s.user_name}</p>
                    <p className="text-[11px] text-slate-400">{s.user_class}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    <div>📅 {s.date}</div>
                    <div className="text-slate-500 text-[11px] font-normal">⏰ {s.time} WIB</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{s.service_type}</span>
                    <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-0.5">
                      {s.counseling_mode === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      <span>{s.counseling_mode}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                    {s.topic}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'Menunggu persetujuan'
                          ? 'bg-amber-100 text-amber-800'
                          : s.status === 'Ditolak'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    {s.status === 'Menunggu persetujuan' ? (
                      <>
                        <button
                          onClick={() => openApproveModal(s)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => openRejectModal(s)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Tolak
                        </button>
                      </>
                    ) : s.status === 'Disetujui' ? (
                      <button
                        onClick={() =>
                          setActiveActionModal({ type: 'complete', schedule: s })
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Tandai Selesai
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Actions */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {activeActionModal.type === 'approve'
                ? 'Setujui Permohonan Konseling'
                : activeActionModal.type === 'reject'
                ? 'Tolak Permohonan Konseling'
                : 'Selesaikan Konseling'}
            </h3>

            <p className="text-xs text-slate-500">
              Siswa: <strong>{activeActionModal.schedule.user_name}</strong> • Tanggal: {activeActionModal.schedule.date} ({activeActionModal.schedule.time})
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-3.5">
              {activeActionModal.type === 'approve' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lokasi Tatap Muka / Link Video Call *
                    </label>
                    <input
                      type="text"
                      required
                      value={locationOrLink}
                      onChange={(e) => setLocationOrLink(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pesan Tambahan untuk Siswa:
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                    ></textarea>
                  </div>
                </>
              )}

              {activeActionModal.type === 'reject' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alasan Penolakan / Rekomendasi Waktu Pengganti *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  ></textarea>
                </div>
              )}

              {activeActionModal.type === 'complete' && (
                <p className="text-xs text-slate-600">
                  Tandai bahwa sesi bimbingan konseling ini telah terlaksana dengan baik.
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer ${
                    activeActionModal.type === 'reject'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {submitting ? 'Memproses...' : 'Konfirmasi Tindakan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
