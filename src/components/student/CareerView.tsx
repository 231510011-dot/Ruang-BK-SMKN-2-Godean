import React, { useState, useEffect } from 'react';
import { CareerContent, CareerPlan, User } from '../../types';
import { api } from '../../api';
import {
  Compass,
  Briefcase,
  GraduationCap,
  Store,
  FileText,
  Users2,
  Building2,
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  Target,
} from 'lucide-react';

interface CareerViewProps {
  user?: User | null;
}

export const CareerView: React.FC<CareerViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'my_plan'>('articles');
  const [careerCategory, setCareerCategory] = useState<string>('Semua');
  const [articles, setArticles] = useState<CareerContent[]>([]);
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSuccessMsg, setPlanSuccessMsg] = useState<string | null>(null);

  // Form Fields for My Plan
  const [mainChoice, setMainChoice] = useState<CareerPlan['main_choice']>('Bekerja');
  const [targetAfterGrad, setTargetAfterGrad] = useState('');
  const [target1Year, setTarget1Year] = useState('');
  const [target3Years, setTarget3Years] = useState('');
  const [skillsNeeded, setSkillsNeeded] = useState('');
  const [actionSteps, setActionSteps] = useState('');

  const categories = [
    'Semua',
    'Dunia Kerja',
    'Kuliah',
    'PKL',
    'Wirausaha',
    'Persiapan CV',
    'Persiapan Interview',
    'Lowongan BKK',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [artList, userPlan] = await Promise.all([
        api.getCareerContents(),
        api.getCareerPlan(),
      ]);
      setArticles(artList);
      if (userPlan) {
        setPlan(userPlan);
        setMainChoice(userPlan.main_choice);
        setTargetAfterGrad(userPlan.target_after_grad);
        setTarget1Year(userPlan.target_1_year);
        setTarget3Years(userPlan.target_3_years);
        setSkillsNeeded(userPlan.skills_needed);
        setActionSteps(userPlan.action_steps);
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

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlan(true);
    setPlanSuccessMsg(null);
    try {
      const saved = await api.saveCareerPlan({
        main_choice: mainChoice,
        target_after_grad: targetAfterGrad,
        target_1_year: target1Year,
        target_3_years: target3Years,
        skills_needed: skillsNeeded,
        action_steps: actionSteps,
      });
      setPlan(saved);
      setPlanSuccessMsg('Rencana masa depanmu berhasil disimpan dan diperbarui.');
      setTimeout(() => setPlanSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan rencana karier.');
    } finally {
      setSavingPlan(false);
    }
  };

  const filteredArticles = articles.filter(
    (a) => careerCategory === 'Semua' || a.category === careerCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Pusat Informasi Karier & Masa Depan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              🎯 Karier, Studi Lanjut & Masa Depan SMK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Fokus Bekerja, Melanjutkan Kuliah, atau Berwirausaha (BMW). Temukan panduan PKL, lowongan BKK SMKN 2 Godean, tips CV, dan rumuskan peta rencana masa depanmu.
            </p>
          </div>

          {/* Submenu Top Switch */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Informasi & Panduan
            </button>
            <button
              onClick={() => setActiveTab('my_plan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_plan'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-teal-600" />
              <span>Rencana Masa Depanku</span>
            </button>
          </div>
        </div>

        {/* Filter categories if on articles tab */}
        {activeTab === 'articles' && (
          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCareerCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  careerCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Articles / Info */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(art.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {art.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {art.summary}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {art.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {art.source_url ? (
                  <a
                    href={art.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>Buka Tautan Resmi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">Informasi BK SMKN 2 Godean</span>
                )}
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-3 bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">Belum ada artikel pada kategori ini</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: "Rencana Masa Depanku" Interactive Planner */}
      {activeTab === 'my_plan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Peta Perjalanan Karier Siswa
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                🎯 Rencana Masa Depanku
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rancang cita-cita dan target terukurmu setelah menyelesaikan pendidikan di SMKN 2 Godean.
              </p>
            </div>
            {plan?.updated_at && (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Terakhir disimpan: {new Date(plan.updated_at).toLocaleDateString('id-ID')}
              </span>
            )}
          </div>

          {planSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{planSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSavePlan} className="space-y-5">
            {/* Primary Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Pilihan Utama Setelah Lulus SMK *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {(
                  [
                    'Bekerja',
                    'Kuliah',
                    'Wirausaha',
                    'Bekerja sambil kuliah',
                    'Masih belum menentukan',
                  ] as CareerPlan['main_choice'][]
                ).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setMainChoice(c)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      mainChoice === c
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Tepat Setelah Lulus (0-6 Bulan) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={targetAfterGrad}
                  onChange={(e) => setTargetAfterGrad(e.target.value)}
                  placeholder="Contoh: Diterima bekerja di hotel berbintang / industri boga, atau lolos SNBP di PTN..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target 1 Tahun ke Depan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={target1Year}
                  onChange={(e) => setTarget1Year(e.target.value)}
                  placeholder="Contoh: Menjadi karyawan tetap, membuka usaha katering mandiri, atau IPK kuliah di atas 3.5..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target 3 Tahun ke Depan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={target3Years}
                  onChange={(e) => setTarget3Years(e.target.value)}
                  placeholder="Contoh: Posisi supervisor / memiliki cabang usaha sendiri / menyelesaikan skripsi tepat waktu..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterampilan yang Perlu Dikembangkan (Hard/Soft Skills) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={skillsNeeded}
                  onChange={(e) => setSkillsNeeded(e.target.value)}
                  placeholder="Contoh: Bahasa Inggris percakapan, keahlian pastry modern, komunikasi publik, manajemen kas..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Langkah Konkret yang Akan Dilakukan Mulai Sekarang *
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionSteps}
                  onChange={(e) => setActionSteps(e.target.value)}
                  placeholder="Contoh: Memperbaiki portofolio kejuruan, rajin konsultasi dengan Guru BK, dan latihan interview..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPlan}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingPlan ? 'Menyimpan...' : 'Simpan Rencana Masa Depanku'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
