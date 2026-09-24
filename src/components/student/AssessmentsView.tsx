import React, { useState, useEffect } from 'react';
import { Assessment, AssessmentResult, User } from '../../types';
import { api } from '../../api';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquareHeart,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AssessmentsViewProps {
  user?: User | null;
  onNavigateToConsultation: (topic?: string) => void;
  onNavigateToMaterials: () => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  user,
  onNavigateToConsultation,
  onNavigateToMaterials,
}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [historyResults, setHistoryResults] = useState<AssessmentResult[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const scaleOptions = [
    { value: 1, label: 'Sangat Tidak Sesuai', short: '1' },
    { value: 2, label: 'Tidak Sesuai', short: '2' },
    { value: 3, label: 'Cukup Sesuai', short: '3' },
    { value: 4, label: 'Sesuai', short: '4' },
    { value: 5, label: 'Sangat Sesuai', short: '5' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [assList, resList] = await Promise.all([
        api.getAssessments(),
        api.getAssessmentResults(),
      ]);
      setAssessments(assList);
      setHistoryResults(resList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectAssessment = (ass: Assessment) => {
    setSelectedAssessment(ass);
    setCurrentResult(null);
    // Initialize default answers with 3 (Cukup Sesuai)
    const initAns: Record<number, number> = {};
    ass.questions.forEach((q) => {
      initAns[q.id] = 3;
    });
    setAnswers(initAns);
  };

  const handleAnswerChange = (questionId: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;

    setSubmitting(true);
    try {
      const res = await api.submitAssessment(selectedAssessment.id, answers);
      setCurrentResult(res);
      setHistoryResults((prev) => [res, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan hasil assessment.');
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Instrumen Refleksi Diri Siswa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              🧠 Self-Assessment Mandiri
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Kenali kebiasaan belajar, manajemen waktu, relasi sosial, efikasi diri, dan kesiapan kariermu melalui kuesioner reflektif skala 1-5.
            </p>
          </div>

          {/* Psychological Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs max-w-sm">
            <p className="font-bold flex items-center gap-1.5 text-amber-950 mb-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pemberitahuan Etis BK:</span>
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Self-assessment ini hanya digunakan sebagai refleksi awal dan pemetaan potensi, bukan alat diagnosis psikologis formal.
            </p>
          </div>
        </div>
      </div>

      {/* Active Form Mode */}
      {selectedAssessment && !currentResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Kategori: {selectedAssessment.category}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {selectedAssessment.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAssessment.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedAssessment(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {selectedAssessment.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3"
                >
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {idx + 1}. {q.text}
                  </p>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
                    {scaleOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => handleAnswerChange(q.id, opt.value)}
                        className={`p-2 sm:p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          answers[q.id] === opt.value
                            ? 'bg-purple-600 border-purple-600 text-white shadow-xs scale-102 font-bold'
                            : 'bg-white border-slate-200 hover:bg-purple-50/50 text-slate-700'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-extrabold">
                          {opt.short}
                        </span>
                        <span className="text-[10px] sm:text-[11px] hidden sm:block mt-1 font-medium line-clamp-1">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                {submitting ? 'Menghitung Hasil...' : 'Lihat Hasil & Interpretasi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Result Display Card */}
      {currentResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg animate-in zoom-in-95 duration-200 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Hasil Analisis Self-Assessment
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {currentResult.assessment_title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentResult(null);
                setSelectedAssessment(null);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Tutup Hasil
            </button>
          </div>

          {/* Score & Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
              <span className="text-xs font-semibold text-emerald-800">Skor Diperoleh</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">
                {currentResult.score}{' '}
                <span className="text-sm font-normal text-emerald-600">/ {currentResult.max_score}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-center">
              <span className="text-xs font-semibold text-blue-800">Persentase Capaian</span>
              <p className="text-3xl font-extrabold text-blue-700 mt-1">
                {currentResult.percentage}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center flex flex-col justify-center">
              <span className="text-xs font-semibold text-purple-800">Kategori Evaluasi</span>
              <p className="text-base font-extrabold text-purple-700 mt-1">
                {currentResult.percentage >= 80
                  ? 'Sangat Baik'
                  : currentResult.percentage >= 60
                  ? 'Cukup Baik'
                  : 'Perlu Pendampingan'}
              </p>
            </div>
          </div>

          {/* Interpretation */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Interpretasi Hasil Refleksi:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentResult.interpretation}
            </p>
          </div>

          {/* Recommendations */}
          <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Rekomendasi Tindak Lanjut:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-indigo-900">
              {currentResult.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToConsultation(`Tindak Lanjut Hasil ${currentResult.assessment_title}`)}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Konsultasi dengan Guru BK Tentang Hasil Ini</span>
            </button>

            <button
              onClick={onNavigateToMaterials}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Baca Materi Rekomendasi</span>
            </button>
          </div>
        </div>
      )}

      {/* Available Assessments Grid */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
          Daftar Instrumen Self-Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((ass) => (
            <div
              key={ass.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {ass.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2.5 group-hover:text-purple-700 transition-colors">
                  {ass.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                  {ass.description}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-3">
                  {ass.questions.length} Pertanyaan Reflektif
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleSelectAssessment(ass)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Mulai Pengisian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment History */}
      {historyResults.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-3">
            Riwayat Self-Assessment Kamu
          </h3>
          <div className="space-y-3">
            {historyResults.slice(0, 5).map((h) => (
              <div
                key={h.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {h.assessment_title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tanggal: {new Date(h.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    Skor: {h.score}/{h.max_score} ({h.percentage}%)
                  </span>
                  <button
                    onClick={() => setCurrentResult(h)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
