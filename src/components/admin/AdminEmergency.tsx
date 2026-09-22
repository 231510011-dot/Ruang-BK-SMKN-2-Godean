import React, { useState, useEffect } from 'react';
import { AssistanceRequest } from '../../types';
import { api } from '../../api';
import {
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Check,
} from 'lucide-react';

interface AdminEmergencyProps {
  onRefreshStats?: () => void;
}

export const AdminEmergency: React.FC<AdminEmergencyProps> = ({ onRefreshStats }) => {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getEmergencyAssistance();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateEmergencyStatus(id, newStatus);
      await loadData();
      if (onRefreshStats) onRefreshStats();
    } catch (e: any) {
      alert(e.message || 'Gagal mengubah status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Layanan Prioritas Tertinggi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            🚨 Permintaan Bantuan Mendesak Siswa ({requests.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar siswa yang menekan tombol "Saya Butuh Bantuan" untuk pendampingan segera dari Guru BK.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Muat Ulang Data
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {requests.map((r) => (
          <div
            key={r.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-4 ${
              r.status === 'Perlu Ditangani Segera'
                ? 'border-rose-300 ring-2 ring-rose-500/10'
                : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    r.status === 'Perlu Ditangani Segera'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : r.status === 'Sedang Dihubungi'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {r.status}
                </span>

                <span className="text-xs text-slate-400">
                  {new Date(r.created_at).toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {r.user_name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Kelas: {r.user_class || 'Siswa SMK'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900">
                <p className="font-bold mb-0.5">Kategori Masalah:</p>
                <p className="font-semibold text-rose-950">{r.category}</p>
                {r.notes && (
                  <p className="mt-2 text-slate-700 italic bg-white p-2 rounded-xl border border-rose-100">
                    "{r.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Tindakan Guru BK:</span>
              <div className="flex items-center gap-2">
                {r.status === 'Perlu Ditangani Segera' && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, 'Sedang Dihubungi')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Tandai Sedang Dihubungi
                  </button>
                )}
                {r.status !== 'Selesai' && (
                  <button
                    onClick={() => handleUpdateStatus(r.id, 'Selesai')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Selesai Ditangani</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Tidak ada permintaan bantuan darurat</h4>
            <p className="text-xs text-slate-500 mt-1">
              Saat ini tidak ada siswa yang berada dalam kondisi sinyal darurat aktif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
