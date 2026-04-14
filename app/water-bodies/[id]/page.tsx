import ProtectedShell from '../../../components/ProtectedShell';
import Sidebar from '../../../components/Sidebar';
import PageHeader from '../../../components/PageHeader';
import WaterBodyDetails from '../../../components/WaterBodyDetails';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WaterBodyPage({ params }: Props) {
  const { id } = await params;
  return (
    <ProtectedShell>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50">
          <Link href="/water-bodies" className="text-orange-500 hover:text-orange-600 text-sm mb-4 inline-block font-mono">
            ← Back to Water Bodies
          </Link>
          <PageHeader title="Water Body Details" description="View and manage water body data and measurements" />
          <WaterBodyDetails id={parseInt(id)} />
        </main>
      </div>
    </ProtectedShell>
  );
}
