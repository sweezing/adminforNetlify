'use client';

import { useEffect, useState } from 'react';
import ProtectedShell from '../components/ProtectedShell';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import { getUsers, getWaterBodies } from '../lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, admins: 0, clients: 0, waterBodies: 0, measurements: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [users, wbs] = await Promise.all([getUsers(), getWaterBodies()]);
        setStats({
          total: users.length,
          admins: users.filter(u => u.role === 'ADMIN').length,
          clients: users.filter(u => u.role === 'CLIENT').length,
          waterBodies: wbs.length,
          measurements: wbs.reduce((acc, wb) => acc + (wb.measurements?.length ?? 0), 0),
        });
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  return (
    <ProtectedShell>
      <div className="flex min-h-screen pt-12 md:pt-0">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <PageHeader title="Dashboard" description="System overview and key metrics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard label="Total Users" value={stats.total} icon="[u]" />
            <KpiCard label="Administrators" value={stats.admins} icon="[a]" />
            <KpiCard label="Clients" value={stats.clients} icon="[c]" />
            <KpiCard label="Water Bodies" value={stats.waterBodies} icon="[~]" />
            <KpiCard label="Measurements" value={stats.measurements} icon="[m]" />
          </div>
        </main>
      </div>
    </ProtectedShell>
  );
}
