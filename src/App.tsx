import React, { useState, useEffect } from 'react';
import { User, Material, CounselingSchedule, Consultation, AssessmentResult, Journal } from './types';
import { api, tokenStorage } from './api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { MaterialsView } from './components/student/MaterialsView';
import { AssessmentsView } from './components/student/AssessmentsView';
import { ConsultationView } from './components/student/ConsultationView';
import { BookingView } from './components/student/BookingView';
import { JournalView } from './components/student/JournalView';
import { CareerView } from './components/student/CareerView';
import { BKGamesView } from './components/student/BKGamesView';
import { StudentProfileView } from './components/student/StudentProfileView';

// Admin Views
import { AdminDashboardShell } from './components/admin/AdminDashboardShell';

import {
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'siswa' | 'guru_bk'>('guru_bk');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Student Dashboard Data
  const [materials, setMaterials] = useState<Material[]>([]);
  const [schedules, setSchedules] = useState<CounselingSchedule[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);

  const loadData = async (currentUser?: User | null) => {
    try {
      const mats = await api.getMaterials();
      setMaterials(mats);

      if (!currentUser || currentUser.role === 'siswa') {
        const [schedData, consultData, assessData, jourData] = await Promise.all([
          api.getSchedules().catch(() => []),
          api.getConsultations().catch(() => []),
          api.getAssessmentResults().catch(() => []),
          api.getJournals().catch(() => []),
        ]);

        if (Array.isArray(schedData)) {
          setSchedules(schedData);
        } else if (schedData && (schedData as any).mySchedules) {
          setSchedules((schedData as any).mySchedules);
        }

        if (Array.isArray(consultData)) setConsultations(consultData);
        if (Array.isArray(assessData)) setAssessmentResults(assessData);
        if (Array.isArray(jourData)) setJournals(jourData);
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  // Check auth on startup
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      let currentUser: User | null = null;
      if (token) {
        try {
          currentUser = await api.getMe();
          setUser(currentUser);
        } catch (e) {
          console.warn('Session expired or invalid:', e);
          tokenStorage.clear();
          setUser(null);
        }
      }
      await loadData(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    loadData(loggedInUser);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentView('dashboard');
    loadData(null);
  };

  const handleOpenAuth = (defaultTab: 'siswa' | 'guru_bk' = 'guru_bk') => {
    setAuthDefaultTab(defaultTab);
    setIsAuthOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 animate-bounce mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">RUANG BK SMKN 2 GODEAN</h2>
        <p className="text-xs text-slate-500 mt-1">Memuat media bimbingan dan konseling...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Universal Top Header Navbar */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        onGoHome={() => setCurrentView('dashboard')}
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
      />

      {/* Main Body */}
      <div className="flex-1">
        {user?.role === 'guru_bk' ? (
          /* Guru BK / Admin Dashboard Shell */
          <AdminDashboardShell
            user={user}
            onOpenChangePassword={() => setIsChangePasswordOpen(true)}
            activeTab={currentView}
            onSelectTab={(v) => setCurrentView(v)}
          />
        ) : currentView === 'landing' ? (
          /* School Information Landing Page */
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onNavigate={(v) => setCurrentView(v)}
            onStartStudent={() => setCurrentView('dashboard')}
          />
        ) : (
          /* Student Views (Open access for students without login) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Student Navigation Breadcrumbs / View switcher if not on home dashboard */}
            {currentView !== 'dashboard' && (
              <div className="mb-5 flex items-center justify-between pb-3 border-b border-slate-200">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>← Kembali ke Menu Utama Siswa</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 capitalize">
                    Layanan Siswa: {currentView}
                  </span>
                </div>
              </div>
            )}

            {currentView === 'dashboard' && (
              <StudentDashboard
                user={user}
                onNavigate={(v) => setCurrentView(v)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
                recentMaterials={materials}
                upcomingSchedules={schedules}
                recentConsultation={consultations[0]}
                latestJournal={journals[0]}
              />
            )}

            {currentView === 'materials' && (
              <MaterialsView
                materials={materials}
                user={user}
                onRefreshMaterials={() => loadData(user)}
              />
            )}

            {currentView === 'assessments' && (
              <AssessmentsView
                user={user}
                onNavigateToConsultation={() => setCurrentView('consultations')}
                onNavigateToMaterials={() => setCurrentView('materials')}
              />
            )}

            {currentView === 'consultations' && (
              <ConsultationView user={user} />
            )}

            {currentView === 'booking' && (
              <BookingView user={user} />
            )}

            {currentView === 'journals' && <JournalView user={user} />}

            {currentView === 'career' && <CareerView user={user} />}

            {currentView === 'games' && (
              <BKGamesView user={user} onNavigate={(v) => setCurrentView(v)} />
            )}

            {currentView === 'profile' && (
              <StudentProfileView
                user={
                  user || {
                    id: 'guest',
                    name: (typeof window !== 'undefined' && localStorage.getItem('ruang_bk_student_name')) || 'Siswa SMKN 2 Godean',
                    username: 'siswa',
                    role: 'siswa',
                    class: (typeof window !== 'undefined' && localStorage.getItem('ruang_bk_student_class')) || 'Kelas 10 DPB',
                    major: 'SMK',
                  }
                }
                onOpenChangePassword={() => setIsChangePasswordOpen(true)}
                schedulesCount={schedules.length}
                consultationsCount={consultations.length}
                assessmentsCount={assessmentResults.length}
                journalsCount={journals.length}
              />
            )}
          </div>
        )}
      </div>

      {/* Universal Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  RUANG BK SMKN 2 GODEAN
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Media Bimbingan dan Konseling Berbasis Web untuk Membantu Siswa SMKN 2 Godean Mengenal Diri, Berkembang, dan Merencanakan Masa Depan Gemilang.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Prinsip Asas Kerahasiaan Bimbingan & Konseling Terjamin Sepenuhnya</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Layanan Bimbingan
              </p>
              <ul className="space-y-1.5 text-slate-600">
                <li>• Bimbingan Pribadi & Emosi</li>
                <li>• Bimbingan Sosial & Relasi</li>
                <li>• Bimbingan Belajar & Akademik</li>
                <li>• Bimbingan Karier & BKK (BMW)</li>
                <li>• Self-Assessment Psikologis</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Kontak & Lokasi Sekolah
              </p>
              <div className="space-y-1.5 text-slate-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Jalan Sidokarto No. 5, Godean, Sleman, D.I. Yogyakarta 55564</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Senin - Jumat: 07.30 - 15.30 WIB</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>bk@smkn2godean.sch.id</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>© {new Date().getFullYear()} Ruang BK SMKN 2 Godean. Hak Cipta Dilindungi.</p>
            <p>Dibangun dengan dedikasi untuk seluruh siswa dan civitas akademika SMK Negeri 2 Godean.</p>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultTab={authDefaultTab}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        user={user}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
