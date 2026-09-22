import React, { useState, useEffect } from 'react';
import { User, Material, AdminStatistics } from '../../types';
import { api } from '../../api';
import { AdminDashboard } from './AdminDashboard';
import { AdminMaterials } from './AdminMaterials';
import { AdminConsultations } from './AdminConsultations';
import { AdminSchedules } from './AdminSchedules';
import { AdminAssessments } from './AdminAssessments';
import { AdminJournals } from './AdminJournals';
import { AdminCareer } from './AdminCareer';
import { AdminEmergency } from './AdminEmergency';
import { AdminStatisticsComponent } from './AdminStatistics';
import { AdminUsers } from './AdminUsers';
import { AdminProfileView } from './AdminProfileView';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareHeart,
  CalendarCheck,
  BrainCircuit,
  PenLine,
  Compass,
  ShieldAlert,
  Users,
  TrendingUp,
  KeyRound,
  UserCheck,
} from 'lucide-react';

interface AdminDashboardShellProps {
  user: User;
  onOpenChangePassword: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const AdminDashboardShell: React.FC<AdminDashboardShellProps> = ({
  user,
  onOpenChangePassword,
  activeTab: controlledTab,
  onSelectTab,
}) => {
  const [internalTab, setInternalTab] = useState<string>('overview');
  const currentTab = (controlledTab && controlledTab !== 'dashboard') ? controlledTab : internalTab;

  const handleTabChange = (tab: string) => {
    setInternalTab(tab);
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsData, matData] = await Promise.all([
        api.getAdminStats(),
        api.getMaterials(),
      ]);
      setStats(statsData);
      setMaterials(matData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Kelola Materi', icon: BookOpen },
    { id: 'consultations', label: 'Konsultasi Siswa', icon: MessageSquareHeart },
    { id: 'schedules', label: 'Jadwal Konseling', icon: CalendarCheck },
    { id: 'assessments', label: 'Hasil Assessment', icon: BrainCircuit },
    { id: 'journals', label: 'Jurnal Siswa', icon: PenLine },
    { id: 'career', label: 'Karier & BKK', icon: Compass },
    { id: 'emergency', label: 'Bantuan Darurat', icon: ShieldAlert },
    { id: 'users', label: 'Data Siswa', icon: Users },
    { id: 'statistics', label: 'Rekap & Statistik', icon: TrendingUp },
    { id: 'profile', label: 'Profil Guru BK', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Navigation Submenu for Guru BK */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const isEmergency = item.id === 'emergency' && stats && stats.summary.urgentAssistanceCount > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isEmergency
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 animate-pulse'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.id === 'consultations' && stats && stats.summary.pendingConsultations > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                        {stats.summary.pendingConsultations}
                      </span>
                    )}
                    {isEmergency && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-extrabold">
                        {stats?.summary.urgentAssistanceCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onOpenChangePassword}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 cursor-pointer border border-slate-200 ml-2"
              title="Ganti Password Guru BK"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Ganti Sandi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'overview' && (
          <AdminDashboard
            stats={stats}
            user={user}
            onNavigateTab={(tab) => handleTabChange(tab)}
            onRefreshStats={loadInitialData}
          />
        )}

        {currentTab === 'materials' && (
          <AdminMaterials
            materials={materials}
            onRefresh={loadInitialData}
          />
        )}

        {currentTab === 'consultations' && (
          <AdminConsultations onRefreshStats={loadInitialData} />
        )}

        {currentTab === 'schedules' && (
          <AdminSchedules onRefreshStats={loadInitialData} />
        )}

        {currentTab === 'assessments' && <AdminAssessments />}

        {currentTab === 'journals' && <AdminJournals />}

        {currentTab === 'career' && <AdminCareer />}

        {currentTab === 'emergency' && (
          <AdminEmergency onRefreshStats={loadInitialData} />
        )}

        {currentTab === 'users' && <AdminUsers />}

        {currentTab === 'statistics' && <AdminStatisticsComponent />}

        {currentTab === 'profile' && (
          <AdminProfileView
            user={user}
            onOpenChangePassword={onOpenChangePassword}
            stats={stats}
          />
        )}
      </main>
    </div>
  );
};
