interface KpiCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
}

export default function KpiCard({ label, value, icon }: KpiCardProps) {
  return (
    <div className="border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-gray-400">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <div className="mt-3 h-0.5 bg-orange-500 w-8" />
    </div>
  );
}
