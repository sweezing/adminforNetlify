'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { Measurement } from '../types';

interface Props {
  measurements: Measurement[];
}

const PARAMS = [
  { key: 'temperature', label: 'Temperature (C)', color: '#f97316' },
  { key: 'pH', label: 'pH', color: '#ea580c' },
  { key: 'oxygen', label: 'Oxygen (mg/L)', color: '#fb923c' },
  { key: 'waterLevel', label: 'Water Level (m)', color: '#374151' },
  { key: 'transparency', label: 'Transparency (m)', color: '#6b7280' },
  { key: 'turbidity', label: 'Turbidity (NTU)', color: '#9ca3af' },
];

export default function WaterQualityChart({ measurements }: Props) {
  const [selectedParam, setSelectedParam] = useState('pH');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const sorted = [...measurements].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const data = sorted.map(m => ({
    date: new Date(m.date).toLocaleDateString(),
    value: (m as unknown as Record<string, unknown>)[selectedParam] ?? null,
  })).filter(d => d.value != null);

  const param = PARAMS.find(p => p.key === selectedParam)!;

  return (
    <div className="bg-white border border-gray-200 p-5">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h3 className="text-gray-900 font-semibold mr-auto text-sm uppercase tracking-wide">Water Quality Chart</h3>
        <select
          className="bg-white border border-gray-300 text-gray-900 text-sm px-3 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          value={selectedParam}
          onChange={e => setSelectedParam(e.target.value)}
        >
          {PARAMS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
        </select>
        <div className="flex border border-gray-300">
          {(['line', 'bar'] as const).map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                chartType === t
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No data for selected parameter</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 0 }} />
              <Legend />
              <Line type="monotone" dataKey="value" name={param.label} stroke={param.color} strokeWidth={2} dot={{ fill: param.color }} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 0 }} />
              <Legend />
              <Bar dataKey="value" name={param.label} fill={param.color} radius={[0, 0, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
