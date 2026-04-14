interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
    </div>
  );
}
