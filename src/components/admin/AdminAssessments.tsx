import React, { useState, useEffect } from 'react';
import { AssessmentResult } from '../../types';
import { api } from '../../api';
import {
  BrainCircuit,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminAssessments: React.FC = () => {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessmentResults();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = results.filter((r) => {
    const term = search.toLowerCase();
    return (
      (r.user_name && r.user_name.toLowerCase().includes(term)) ||
      (r.assessment_title && r.assessment_title.toLowerCase().includes(term)) ||
      (r.user_class && r.user_class.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Hasil Pengukuran Diri Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            🧠 Hasil Self-Assessment Siswa ({results.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau pemetaan kondisi belajar, manajemen waktu, relasi sosial, dan perencanaan karier siswa.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari siswa atau instrumen..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Siswa / Kelas</th>
                <th className="py-3 px-4">Instrumen Assessment</th>
                <th className="py-3 px-4">Skor Diperoleh</th>
                <th className="py-3 px-4">Persentase</th>
                <th className="py-3 px-4">Evaluasi</th>
                <th className="py-3 px-4">Tanggal Pengisian</th>
                <th className="py-3 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{r.user_name || 'Siswa'}</p>
                    <p className="text-[11px] text-slate-400">{r.user_class || '-'}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {r.assessment_title}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-700">
                    {r.score} / {r.max_score}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {r.percentage}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.percentage >= 60
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.percentage >= 80 ? 'Optimal' : r.percentage >= 60 ? 'Cukup Baik' : 'Perlu Pendampingan'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedResult(r)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Lihat Hasil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Result */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase">
                  Analisis Jawaban Siswa
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedResult.assessment_title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-purple-950">{selectedResult.user_name}</p>
                <p className="text-[11px] text-purple-800">{selectedResult.user_class}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-purple-700">{selectedResult.score} / {selectedResult.max_score}</p>
                <p className="text-[10px] text-purple-600 font-bold">{selectedResult.percentage}% Capaian</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Interpretasi:</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedResult.interpretation}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Rekomendasi Tindak Lanjut:</h4>
              <ul className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
