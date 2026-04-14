import ProtectedShell from '../../components/ProtectedShell';
import Sidebar from '../../components/Sidebar';
import PageHeader from '../../components/PageHeader';
import WaterBodyManager from '../../components/WaterBodyManager';

export default function WaterBodiesPage() {
  return (
    <ProtectedShell>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <PageHeader title="Water Bodies" description="Manage water bodies and measurements" />
          <WaterBodyManager />
        </main>
      </div>
    </ProtectedShell>
  );
}
