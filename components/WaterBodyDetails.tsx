'use client';

import { useState, useEffect } from 'react';
import { getWaterBody, addMeasurement, deleteMeasurement } from '../lib/api';
import type { WaterBody, Measurement } from '../types';
import WaterQualityChart from './WaterQualityChart';

interface Props {
  id: number;
}

const MEASUREMENT_FIELDS = [
  { key: 'waterLevel', label: 'Water Level (m)' },
  { key: 'temperature', label: 'Temperature (C)' },
  { key: 'pH', label: 'pH' },
  { key: 'oxygen', label: 'Oxygen (mg/L)' },
  { key: 'transparency', label: 'Transparency (m)' },
  { key: 'turbidity', label: 'Turbidity (NTU)' },
];

export default function WaterBodyDetails({ id }: Props) {
  const [wb, setWb] = useState<WaterBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Record<string, string>>({ date: new Date().toISOString().slice(0, 10), notes: '' });
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setWb(await getWaterBody(id));
    } catch {
      setError('Failed to load water body');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleAddMeasurement(e: React.FormEvent) {
    e.preventDefault();
    if (!wb) return;
    setSaving(true);
    try {
      const payload: Partial<Measurement> = { notes: form.notes || undefined };
      for (const { key } of MEASUREMENT_FIELDS) {
        if (form[key]) (payload as Record<string, unknown>)[key] = parseFloat(form[key]);
      }
      if (form.date) payload.date = new Date(form.date).toISOString();
      await addMeasurement(id, payload);
      setForm({ date: new Date().toISOString().slice(0, 10), notes: '' });
      load();
    } catch {
      setError('Failed to add measurement');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMeasurement(mId: number) {
    if (!confirm('Delete this measurement?')) return;
    try {
      await deleteMeasurement(id, mId);
      load();
    } catch {
      setError('Failed to delete measurement');
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;
  if (!wb) return null;

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="bg-white border border-gray-200 p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          ['Name', wb.name],
          ['Type', wb.type],
          ['Region', wb.region],
          ['Latitude', wb.latitude ?? '—'],
          ['Longitude', wb.longitude ?? '—'],
          ['Description', wb.description ?? '—'],
        ].map(([l, v]) => (
          <div key={String(l)}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{l}</p>
            <p className="text-gray-900 text-sm font-medium">{String(v)}</p>
          </div>
        ))}
      </div>

      {/* Passport */}
      {wb.passport && (
        <div className="bg-white border border-gray-200 p-5">
          <h3 className="text-gray-900 font-semibold mb-3 text-sm uppercase tracking-wide">Passport</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              ['Surface Area (km2)', wb.passport.surfaceArea],
              ['Max Depth (m)', wb.passport.maxDepth],
              ['Avg Depth (m)', wb.passport.avgDepth],
              ['Volume (km3)', wb.passport.volume],
              ['Catchment (km2)', wb.passport.catchmentArea],
              ['Salinity', wb.passport.salinity],
              ['Altitude (m)', wb.passport.altitude],
              ['Inflow', wb.passport.inflow],
              ['Outflow', wb.passport.outflow],
            ].map(([l, v]) => v != null ? (
              <div key={String(l)}>
                <p className="text-xs text-gray-500">{l}</p>
                <p className="text-gray-900">{String(v)}</p>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {/* Chart */}
      {wb.measurements && wb.measurements.length > 0 && (
        <WaterQualityChart measurements={wb.measurements} />
      )}

      {/* Add measurement */}
      <div className="bg-white border border-gray-200 p-5">
        <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">Add Measurement</h3>
        <form onSubmit={handleAddMeasurement} className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="col-span-full md:col-span-1">
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input
              type="date"
              className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={form.date ?? ''}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          {MEASUREMENT_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input
                type="number"
                step="any"
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={form[key] ?? ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="col-span-full">
            <label className="text-xs text-gray-500 mb-1 block">Notes</label>
            <textarea
              className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              rows={2}
              value={form.notes ?? ''}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="col-span-full">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2 text-sm font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Add Measurement'}
            </button>
          </div>
        </form>
      </div>

      {/* Measurements list */}
      <div className="bg-white border border-gray-200">
        <h3 className="text-gray-900 font-semibold px-5 py-4 border-b border-gray-200 text-sm uppercase tracking-wide">
          Measurements
        </h3>
        {!wb.measurements?.length ? (
          <p className="text-gray-500 text-sm px-5 py-4">No measurements yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Temp</th>
                  <th className="px-4 py-3">pH</th>
                  <th className="px-4 py-3">O2</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wb.measurements.map(m => (
                  <tr key={m.id} className="text-gray-800 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{new Date(m.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{m.temperature ?? '—'}</td>
                    <td className="px-4 py-3">{m.pH ?? '—'}</td>
                    <td className="px-4 py-3">{m.oxygen ?? '—'}</td>
                    <td className="px-4 py-3">{m.waterLevel ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{m.notes ?? '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteMeasurement(m.id)} className="text-red-500 hover:text-red-600 text-xs">Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
