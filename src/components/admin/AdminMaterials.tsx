import React, { useState } from 'react';
import { Material, MaterialCategory, QuizQuestion } from '../../types';
import { api } from '../../api';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminMaterialsProps {
  materials: Material[];
  onRefresh: () => void;
}

export const AdminMaterials: React.FC<AdminMaterialsProps> = ({
  materials,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('BK Pribadi');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [reflectionPrompt, setReflectionPrompt] = useState('');

  // Quiz Editor
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setCategory('BK Pribadi');
    setDescription('');
    setContent('');
    setImage('');
    setVideoUrl('');
    setReflectionPrompt('');
    setQuizQuestions([]);
    setError(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (m: Material) => {
    setCurrentId(m.id);
    setTitle(m.title);
    setCategory(m.category);
    setDescription(m.description);
    setContent(m.content);
    setImage(m.image || '');
    setVideoUrl(m.video_url || '');
    setReflectionPrompt(m.reflection_prompt || '');
    setQuizQuestions(m.quiz_data || []);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus materi bimbingan konseling ini?')) return;
    try {
      await api.deleteMaterial(id);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus materi.');
    }
  };

  const handleAddQuizQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        question: 'Pertanyaan baru',
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctIndex: 0,
        explanation: 'Penjelasan jawaban benar...',
      },
    ]);
  };

  const handleRemoveQuizQuestion = (idx: number) => {
    setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateQuizQuestion = (idx: number, updated: Partial<QuizQuestion>) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...updated } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      category,
      description,
      content,
      image,
      video_url: videoUrl,
      reflection_prompt: reflectionPrompt,
      quiz_data: quizQuestions,
    };

    try {
      if (currentId) {
        await api.updateMaterial(currentId, payload);
      } else {
        await api.createMaterial(payload);
      }
      onRefresh();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan materi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manajemen Konten Bimbingan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            📚 Kelola Materi BK ({materials.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah, perbarui, atau susun kuis interaktif untuk siswa SMKN 2 Godean.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Materi Baru</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              {currentId ? 'Edit Materi BK' : 'Tambah Materi BK Baru'}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Batal
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Materi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Manajemen Waktu Efektif untuk Siswa SMK"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori BK *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                >
                  <option value="BK Pribadi">BK Pribadi</option>
                  <option value="BK Sosial">BK Sosial</option>
                  <option value="BK Belajar">BK Belajar</option>
                  <option value="BK Karier">BK Karier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Ringkas *
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rangkuman 1-2 kalimat pengantar materi..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Gambar Cover (Opsional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Video Pembelajaran (Opsional)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Materi Lengkap *
              </label>
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan materi pembelajaran secara runtut dan jelas..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pertanyaan Refleksi Diri (Disimpan ke Jurnal Siswa)
              </label>
              <input
                type="text"
                value={reflectionPrompt}
                onChange={(e) => setReflectionPrompt(e.target.value)}
                placeholder="Contoh: Apa 1 kebiasaan belajar yang ingin kamu ubah mulai minggu ini?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Quiz Management */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-purple-950 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-purple-700" />
                    <span>Kuis Singkat Interaktif ({quizQuestions.length})</span>
                  </h4>
                  <p className="text-[11px] text-purple-800">
                    Siswa dapat menguji pemahaman materi setelah selesai membaca
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuizQuestion}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Tambah Pertanyaan
                </button>
              </div>

              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white p-4 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900">Pertanyaan #{qIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuizQuestion(qIdx)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleUpdateQuizQuestion(qIdx, { question: e.target.value })}
                    placeholder="Kalimat pertanyaan kuis..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleUpdateQuizQuestion(qIdx, { correctIndex: oIdx })}
                          title="Tandai sebagai jawaban benar"
                          className="text-purple-600"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...q.options];
                            newOptions[oIdx] = e.target.value;
                            handleUpdateQuizQuestion(qIdx, { options: newOptions });
                          }}
                          placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => handleUpdateQuizQuestion(qIdx, { explanation: e.target.value })}
                    placeholder="Penjelasan edukatif saat siswa memilih jawaban..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Materi BK'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Judul Materi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Dibaca</th>
                <th className="py-3 px-4">Kuis</th>
                <th className="py-3 px-4">Terakhir Diperbarui</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {m.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {m.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    {m.read_count || 0} kali
                  </td>
                  <td className="py-3.5 px-4">
                    {m.quiz_data && m.quiz_data.length > 0 ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ {m.quiz_data.length} Soal
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(m.updated_at || m.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Edit Materi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
