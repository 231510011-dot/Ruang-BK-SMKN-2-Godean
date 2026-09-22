import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../api';
import { Users, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const students = users.filter((u) => u.role === 'siswa');
  const filtered = students.filter((u) => {
    const term = search.toLowerCase();
    const className = u.class_name || u.class || '';
    const major = u.major || '';
    return (
      u.name.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      className.toLowerCase().includes(term) ||
      major.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Basis Data Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            👥 Siswa Terdaftar SMKN 2 Godean ({students.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar akun siswa yang memiliki akses layanan bimbingan konseling daring.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NISN, atau kelas..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username / NISN</th>
                <th className="py-3 px-4">Kelas & Jurusan</th>
                <th className="py-3 px-4">Tanggal Registrasi</th>
                <th className="py-3 px-4">Status Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {s.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {s.class_name || s.class || 'SMK'}
                      {s.major ? ` • ${s.major}` : ''}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {s.created_at
                      ? new Date(s.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Terdaftar'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <UserCheck className="w-3 h-3" /> Aktif
                    </span>
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
