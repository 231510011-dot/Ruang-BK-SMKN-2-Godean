import React, { useState, useEffect } from 'react';
import { CareerContent } from '../../types';
import { api } from '../../api';
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Target,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const AdminCareer: React.FC = () => {
  const [articles, setArticles] = useState<CareerContent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dunia Kerja');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('SMK, Kerja, Industri');
  const [sourceUrl, setSourceUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
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
      const data = await api.getCareerContents();
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setCategory('Dunia Kerja');
    setSummary('');
    setContent('');
    setTagsStr('SMK, Kerja, Industri');
    setSourceUrl('');
    setError(null);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (art: CareerContent) => {
    setCurrentId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setSummary(art.summary);
    setContent(art.content);
    setTagsStr(art.tags.join(', '));
    setSourceUrl(art.source_url || '');
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus informasi karier ini?')) return;
    try {
      await api.deleteCareerContent(id);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Gagal menghapus informasi karier.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      category,
      summary,
      content,
      tags,
      source_url: sourceUrl,
    };

    try {
      if (currentId) {
        await api.updateCareerContent(currentId, payload);
      } else {
        await api.createCareerContent(payload);
      }
      loadData();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan informasi karier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Manajemen Informasi BKK & Karier</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            🎯 Kelola Informasi Karier & Masa Depan ({articles.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publikasikan panduan PKL, lowongan kerja mitra industri SMKN 2 Godean, tips CV, dan info kuliah.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Informasi Baru</span>
        </button>
      </div>

      {/* Editor Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">
              {currentId ? 'Edit Informasi Karier' : 'Tambah Informasi Karier Baru'}
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
                  Judul Informasi *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rekrutmen PT Boga Mandiri Sleman untuk Lulusan Kuliner"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ringkasan Singkat *
              </label>
              <textarea
                rows={2}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Rangkuman 1-2 kalimat untuk kartu pratinjau siswa..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Panduan / Keterangan Lengkap *
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan syarat kualifikasi, deskripsi pekerjaan, tanggal batas pendaftaran, atau panduan detail..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag Kata Kunci (Dipisahkan Koma)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Lowongan, Kuliner, Godean, BKK"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan Pendaftaran / Website Resmi (Opsional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Informasi Karier'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Career Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Judul Artikel / Informasi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tautan Eksternal</th>
                <th className="py-3 px-4">Tanggal Publikasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm truncate">
                    {art.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      {art.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {art.source_url ? (
                      <a
                        href={art.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Buka Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(art.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleStartEdit(art)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-teal-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
