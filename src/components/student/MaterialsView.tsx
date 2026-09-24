import React, { useState } from 'react';
import { Material, MaterialCategory, User } from '../../types';
import { api } from '../../api';
import {
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  PlayCircle,
  HelpCircle,
  PenTool,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';

interface MaterialsViewProps {
  materials: Material[];
  user?: User | null;
  onRefreshMaterials: () => void;
  onOpenJournalWithPrompt?: (prompt: string, title: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  user,
  onRefreshMaterials,
  onOpenJournalWithPrompt,
}) => {
  const categories: ('Semua' | MaterialCategory)[] = [
    'Semua',
    'BK Pribadi',
    'BK Sosial',
    'BK Belajar',
    'BK Karier',
  ];

  const [activeCategory, setActiveCategory] = useState<'Semua' | MaterialCategory>('Semua');
  const [search, setSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Modal Interactive States
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const filteredMaterials = materials.filter((m) => {
    const matchCategory = activeCategory === 'Semua' || m.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenMaterial = (mat: Material) => {
    setSelectedMaterial(mat);
    setHasMarkedRead(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setReflectionText('');
    setReflectionSaved(false);
  };

  const handleMarkAsRead = async () => {
    if (!selectedMaterial || hasMarkedRead) return;
    try {
      await api.markMaterialRead(selectedMaterial.id);
      setHasMarkedRead(true);
      onRefreshMaterials();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveReflection = async () => {
    if (!selectedMaterial || !reflectionText.trim()) return;
    try {
      await api.createJournal({
        mood: 'Senang',
        title: `Refleksi Materi: ${selectedMaterial.title}`,
        feeling: reflectionText.trim(),
        problems: 'Tantangan dalam mempraktikkan materi di sekolah',
        actions_taken: 'Membaca dan menuntaskan materi di Ruang BK SMKN 2 Godean',
        improvements: 'Terus mempraktikkan wawasan positif secara rutin',
        next_goals: 'Menerapkan kiat ini saat jam sekolah dan praktik kejuruan',
        is_shared_with_counselor: true,
      });
      setReflectionSaved(true);
      if (onOpenJournalWithPrompt) {
        onRefreshMaterials();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              📚 Materi Bimbingan & Konseling
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jelajahi panduan pengembangan diri, kecakapan sosial, teknik belajar efektif, dan perencanaan karier SMK.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul materi atau topik..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            onClick={() => handleOpenMaterial(mat)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="h-44 bg-slate-100 relative overflow-hidden">
              {mat.image ? (
                <img
                  src={mat.image}
                  alt={mat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold">
                  BK SMKN 2 Godean
                </div>
              )}
              <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                {mat.category}
              </span>
              {mat.quiz_data && mat.quiz_data.length > 0 && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-xs">
                  Ada Kuis
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {mat.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {mat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Dibaca {mat.read_count || 0}x</span>
                </span>
                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Baca Materi →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-700">Tidak ada materi ditemukan</h4>
          <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
        </div>
      )}

      {/* Detail Material Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500 text-white">
                  {selectedMaterial.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• Materi BK Siswa</span>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Cover Image & Title */}
              {selectedMaterial.image && (
                <div className="rounded-2xl overflow-hidden max-h-64 sm:max-h-72 w-full bg-slate-100">
                  <img
                    src={selectedMaterial.image}
                    alt={selectedMaterial.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {selectedMaterial.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
                  {selectedMaterial.description}
                </p>
              </div>

              {/* Video Link if Available */}
              {selectedMaterial.video_url && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-6 h-6 text-sky-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-sky-900">Tersedia Video Pembelajaran</p>
                      <p className="text-[11px] text-sky-700">Simak penjelasan visual tambahan mengenai materi ini</p>
                    </div>
                  </div>
                  <a
                    href={selectedMaterial.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                  >
                    Buka Video
                  </a>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-b border-slate-100 py-6">
                {selectedMaterial.content}
              </div>

              {/* Mark as read button */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-5 h-5 ${hasMarkedRead ? 'text-emerald-600' : 'text-blue-600'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {hasMarkedRead ? 'Materi Selesai Dibaca!' : 'Tandai Selesai Membaca'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Mencatat progres belajarmu ke sistem dan guru BK
                    </p>
                  </div>
                </div>
                <button
                  disabled={hasMarkedRead}
                  onClick={handleMarkAsRead}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasMarkedRead
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {hasMarkedRead ? '✓ Sudah Dibaca' : 'Saya Sudah Membaca'}
                </button>
              </div>

              {/* Interactive Quiz if Available */}
              {selectedMaterial.quiz_data && selectedMaterial.quiz_data.length > 0 && (
                <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-700" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-purple-950">
                        Kuis Singkat Pemahaman
                      </h4>
                      <p className="text-[11px] text-purple-800">
                        Uji pemahamanmu setelah membaca materi di atas
                      </p>
                    </div>
                  </div>

                  {selectedMaterial.quiz_data.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2.5 bg-white p-4 rounded-xl border border-purple-100">
                      <p className="text-xs font-bold text-slate-800">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                              quizAnswers[qIdx] === optIdx
                                ? 'bg-purple-50 border-purple-400 font-semibold text-purple-900'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${qIdx}`}
                              checked={quizAnswers[qIdx] === optIdx}
                              onChange={() =>
                                setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                              }
                              className="text-purple-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`mt-2 p-2.5 rounded-lg text-xs ${
                            quizAnswers[qIdx] === q.correctIndex
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}
                        >
                          <p className="font-bold">
                            {quizAnswers[qIdx] === q.correctIndex
                              ? '✓ Jawaban Tepat!'
                              : `✗ Kurang Tepat. Jawaban benar: "${q.options[q.correctIndex]}"`}
                          </p>
                          <p className="text-[11px] mt-0.5">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Periksa Jawaban Kuis
                    </button>
                  ) : (
                    <p className="text-xs font-bold text-purple-800">
                      Kuis telah diperiksa! Terima kasih telah menguji pemahamanmu.
                    </p>
                  )}
                </div>
              )}

              {/* Reflection Box */}
              {selectedMaterial.reflection_prompt && (
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                        Pertanyaan Refleksi Diri
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        {selectedMaterial.reflection_prompt}
                      </p>
                    </div>
                  </div>

                  {reflectionSaved ? (
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Refleksimu telah berhasil disimpan ke menu Jurnal & Refleksi!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="Tuliskan jawaban atau apa yang kamu rasakan berdasarkan pertanyaan refleksi ini..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                      ></textarea>
                      <button
                        onClick={handleSaveReflection}
                        disabled={!reflectionText.trim()}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                      >
                        Simpan ke Jurnal Refleksi Saya
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
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
