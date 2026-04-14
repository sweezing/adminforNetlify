import ProtectedShell from '../../components/ProtectedShell';
import Sidebar from '../../components/Sidebar';
import PageHeader from '../../components/PageHeader';
import UserManager from '../../components/UserManager';

export default function UsersPage() {
  return (
    <ProtectedShell>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <PageHeader title="Users" description="Manage system users and roles" />
          <UserManager />
        </main>
      </div>
    </ProtectedShell>
  );
}
