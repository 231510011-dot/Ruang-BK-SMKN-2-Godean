import React, { useState, useEffect } from 'react';
import { CounselingSchedule, CounselingMode, User } from '../../types';
import { api } from '../../api';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Ban,
} from 'lucide-react';

interface BookingViewProps {
  user: User;
}

export const BookingView: React.FC<BookingViewProps> = ({ user }) => {
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [takenSlots, setTakenSlots] = useState<{ date: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState('08:45 - 09:30');
  const [serviceType, setServiceType] = useState('Bimbingan Pribadi');
  const [counselingMode, setCounselingMode] = useState<CounselingMode>('Tatap Muka');
  const [topic, setTopic] = useState('');

  const availableSlots = [
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:45 - 10:30',
    '10:30 - 11:15',
    '13:00 - 13:45',
    '14:00 - 14:45',
  ];

  const serviceTypes = [
    'Bimbingan Pribadi',
    'Bimbingan Sosial / Pertemanan',
    'Bimbingan Belajar & Kesulitan Praktik',
    'Bimbingan Karier & Persiapan PKL',
    'Bimbingan Kelanjutan Studi / Beasiswa Kuliah',
    'Bimbingan Wirausaha SMK',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await api.getSchedules();
      if (res && res.mySchedules) {
        setSchedules(res.mySchedules);
        setTakenSlots(res.takenSlots || []);
      } else if (Array.isArray(res)) {
        setSchedules(res);
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

  const isSlotTaken = (slotTime: string) => {
    return takenSlots.some((s) => s.date === date && s.time === slotTime);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (isSlotTaken(time)) {
      setError(`Slot waktu ${time} pada tanggal ${date} sudah dibooking oleh siswa lain. Silakan pilih jam atau tanggal lain.`);
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createSchedule({
        date,
        time,
        service_type: serviceType,
        topic,
        counseling_mode: counselingMode,
      });

      setSchedules((prev) => [created, ...prev]);
      setTakenSlots((prev) => [...prev, { date, time }]);
      setSuccessMsg('Pengajuan jadwal konseling berhasil dikirim. Menunggu persetujuan Guru BK.');
      setTopic('');
    } catch (err: any) {
      setError(err.message || 'Gagal mengajukan jadwal konseling.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin membatalkan jadwal konseling ini?')) return;
    try {
      await api.updateSchedule(id, { status: 'Dibatalkan' });
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'Dibatalkan' } : s))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Sistem Janji Temu Bimbingan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              📅 Booking Jadwal Konseling BK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Pilih tanggal dan sesi jam yang kamu inginkan. Sistem dilengkapi proteksi anti-bentrok untuk memastikan kenyamanan sesi privatmu.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Lokasi: Ruang BK SMKN 2 Godean atau Sesi Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Booking (Left Column) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Ajukan Jadwal Baru</span>
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

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Tanggal Konseling *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              />
            </div>

            {/* Time Slot Picker with Anti-Collision Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Slot Jam (Anti-Bentrok) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  const taken = isSlotTaken(slot);
                  const isSelected = time === slot;

                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={taken}
                      onClick={() => setTime(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center cursor-pointer ${
                        taken
                          ? 'bg-rose-50 border-rose-200 text-rose-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50/50'
                      }`}
                    >
                      <span>{slot}</span>
                      <span className="text-[10px] font-normal mt-0.5">
                        {taken ? 'Sudah Terisi' : isSelected ? 'Dipilih' : 'Tersedia'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Layanan Bimbingan *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {serviceTypes.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mode Konseling *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCounselingMode('Tatap Muka')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    counselingMode === 'Tatap Muka'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Tatap Muka (Ruang BK)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCounselingMode('Online')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    counselingMode === 'Online'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Online (Google Meet)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik / Gambaran Singkat yang Ingin Dibahas *
              </label>
              <textarea
                rows={3}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Konsultasi mengenai pilihan tempat PKL dan strategi wawancara industri..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{submitting ? 'Memproses Jadwal...' : 'Ajukan Jadwal Konseling'}</span>
            </button>
          </form>
        </div>

        {/* My Schedules List (Right Column) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center justify-between pb-3 border-b border-slate-100">
              <span>Jadwal Konseling Saya ({schedules.length})</span>
              <button
                onClick={loadData}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Segarkan
              </button>
            </h3>

            {schedules.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-500">
                  Belum ada jadwal konseling yang diajukan.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pilih waktu luangmu di formulir untuk membuat janji temu bimbingan.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {s.service_type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          s.status === 'Disetujui'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : s.status === 'Menunggu persetujuan'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : s.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Topik:</strong> {s.topic}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{s.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{s.time} WIB</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        {s.counseling_mode === 'Online' ? (
                          <Video className="w-3.5 h-3.5 text-sky-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        <span>{s.counseling_mode} {s.location_or_link ? `(${s.location_or_link})` : ''}</span>
                      </div>
                    </div>

                    {s.notes && (
                      <div className="p-2 rounded-xl bg-blue-50 text-[11px] text-blue-900 border border-blue-200">
                        <strong>Catatan Guru BK:</strong> {s.notes}
                      </div>
                    )}

                    {s.rejection_reason && (
                      <div className="p-2 rounded-xl bg-rose-50 text-[11px] text-rose-900 border border-rose-200">
                        <strong>Alasan Penolakan:</strong> {s.rejection_reason}
                      </div>
                    )}

                    {s.status === 'Menunggu persetujuan' && (
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => handleCancelBooking(s.id)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Batalkan Pengajuan</span>
                        </button>
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
