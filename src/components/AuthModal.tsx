import React, { useState } from 'react';
import { api, tokenStorage } from '../api';
import { User } from '../types';
import {
  X,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  School,
  AlertCircle,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'siswa' | 'guru_bk';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'siswa',
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru_bk'>(defaultTab);
  const [siswaMode, setSiswaMode] = useState<'login' | 'register'>('login');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [className, setClassName] = useState('Kelas 10');
  const [major, setMajor] = useState('DPB');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'siswa' | 'guru_bk') => {
    setActiveTab(tab);
    setError(null);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'siswa' && siswaMode === 'register') {
        const res = await api.registerSiswa({
          name,
          username,
          password,
          nis,
          className,
          major,
        });
        tokenStorage.set(res.token);
        onLoginSuccess(res.user);
        onClose();
      } else {
        const res = await api.login(username, password);
        tokenStorage.set(res.token);
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Ruang BK SMKN 2 Godean</h3>
              <p className="text-xs text-blue-100">Silakan masuk ke akun Anda</p>
            </div>
          </div>

          {/* Role Tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-black/20 rounded-xl">
            <button
              type="button"
              onClick={() => handleTabChange('siswa')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'siswa'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Portal Siswa
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('guru_bk')}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'guru_bk'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Guru BK / Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'siswa' && (
            <div className="flex items-center justify-center gap-4 mb-5 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => {
                  setSiswaMode('login');
                  setError(null);
                }}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  siswaMode === 'login'
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Sudah Punya Akun (Masuk)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSiswaMode('register');
                  setError(null);
                }}
                className={`text-xs font-bold pb-1 cursor-pointer transition-colors ${
                  siswaMode === 'register'
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === 'siswa' && siswaMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Anindya Putri Pratama"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kelas *
                    </label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                    >
                      <option value="Kelas 10">Kelas 10</option>
                      <option value="Kelas 11">Kelas 11</option>
                      <option value="Kelas 12">Kelas 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jurusan SMK *
                    </label>
                    <select
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-medium"
                    >
                      <option value="DPB">DPB</option>
                      <option value="BUSANA">BUSANA</option>
                      <option value="TKKR">TKKR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIS (Nomor Induk Siswa)
                  </label>
                  <input
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Contoh: 20240101"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ketik username Anda"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik kata sandi Anda"
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Memproses...'
                : activeTab === 'siswa' && siswaMode === 'register'
                ? 'Daftar Akun Siswa'
                : 'Masuk ke Ruang BK'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
