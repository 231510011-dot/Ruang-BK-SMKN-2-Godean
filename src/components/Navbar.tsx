import React from 'react';
import { User } from '../types';
import {
  GraduationCap,
  LogOut,
  KeyRound,
  AlertCircle,
  LogIn,
  UserCheck,
  Sparkles,
  Gamepad2,
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onOpenAuth: (defaultTab?: 'siswa' | 'guru_bk') => void;
  onOpenEmergency: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  currentView?: string;
  onSelectView?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenEmergency,
  onOpenChangePassword,
  onLogout,
  onGoHome,
  currentView = 'dashboard',
  onSelectView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & School Name */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                  RUANG BK
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  SMKN 2 GODEAN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Bimbingan & Konseling Terpadu
              </p>
            </div>
          </div>

          {/* Navigation Links for Students */}
          {user?.role !== 'guru_bk' && onSelectView && (
            <nav className="hidden xl:flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'materials', label: 'Materi BK' },
                { id: 'consultations', label: 'Konsultasi BK' },
                { id: 'booking', label: 'Booking Jadwal' },
                { id: 'journals', label: 'Jurnal Refleksi' },
                { id: 'assessments', label: 'Asesmen Mandiri' },
                { id: 'games', label: 'Permainan Edukasi' },
                { id: 'career', label: 'Karier SMK' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => onSelectView(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentView === link.id
                      ? 'bg-blue-100/70 text-blue-800 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Always visible Emergency Bantuan Button */}
            <button
              id="btn-emergency-help"
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all duration-200 animate-pulse hover:animate-none cursor-pointer"
              title="Tombol Bantuan Mendesak"
            >
              <AlertCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
              <span>SAYA BUTUH BANTUAN</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <div className="flex items-center justify-end gap-1.5">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 max-w-[160px]">
                      {user.role === 'guru_bk' ? 'Guru BK' : user.name}
                    </p>
                    {user.role === 'guru_bk' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Guru BK
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Siswa
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {user.role === 'guru_bk' ? 'SMKN 2 Godean' : `${user.class || 'Siswa SMK'} • NIS: ${user.nis || '-'}`}
                  </p>
                </div>

                {/* Avatar */}
                <div className="relative group">
                  <button
                    id="btn-user-avatar"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-blue-500/20 hover:ring-blue-600 transition-all flex items-center justify-center bg-slate-100 cursor-pointer"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.role === 'guru_bk' ? 'Guru BK' : user.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Masuk Sebagai
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user.role === 'guru_bk' ? 'Guru BK' : user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.role === 'guru_bk' ? 'Ruang BK SMKN 2 Godean' : `@${user.username}`}
                      </p>
                    </div>

                    {user.role === 'guru_bk' && onSelectView && (
                      <button
                        onClick={() => onSelectView('profile')}
                        className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-amber-600" />
                        <span>Profil Guru BK</span>
                      </button>
                    )}

                    <button
                      onClick={onOpenChangePassword}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-400" />
                      <span>Ganti Kata Sandi</span>
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-login-guru"
                  onClick={() => onOpenAuth('guru_bk')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Login Guru BK</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile & Tablet Horizontal Nav Strip for Students */}
      {user?.role !== 'guru_bk' && onSelectView && (
        <div className="xl:hidden bg-slate-50/95 border-t border-slate-200/80 px-4 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'materials', label: 'Materi BK' },
            { id: 'consultations', label: 'Konsultasi BK' },
            { id: 'booking', label: 'Booking' },
            { id: 'journals', label: 'Jurnal' },
            { id: 'assessments', label: 'Asesmen' },
            { id: 'games', label: 'Game BK' },
            { id: 'career', label: 'Karier' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectView(link.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                currentView === link.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
