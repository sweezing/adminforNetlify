'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWaterBodies, createWaterBody, updateWaterBody, deleteWaterBody } from '../lib/api';
import type { WaterBody } from '../types';

export default function WaterBodyManager() {
  const [items, setItems] = useState<WaterBody[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<WaterBody | null>(null);
  const [showForm, setShowForm] = useState(false);

  const empty = {
    name: '', type: '', region: '', latitude: '', longitude: '', description: '',
    surfaceArea: '', maxDepth: '', avgDepth: '', volume: '', catchmentArea: '',
    salinity: '', altitude: '', inflow: '', outflow: '',
  };
  const [form, setForm] = useState(empty);

  async function load() {
    try {
      setLoading(true);
      setItems(await getWaterBodies());
    } catch {
      setError('Failed to load water bodies');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  }

  function openEdit(w: WaterBody) {
    setEditing(w);
    setForm({
      name: w.name,
      type: w.type,
      region: w.region,
      latitude: String(w.latitude ?? ''),
      longitude: String(w.longitude ?? ''),
      description: w.description ?? '',
      surfaceArea: String(w.passport?.surfaceArea ?? ''),
      maxDepth: String(w.passport?.maxDepth ?? ''),
      avgDepth: String(w.passport?.avgDepth ?? ''),
      volume: String(w.passport?.volume ?? ''),
      catchmentArea: String(w.passport?.catchmentArea ?? ''),
      salinity: String(w.passport?.salinity ?? ''),
      altitude: String(w.passport?.altitude ?? ''),
      inflow: w.passport?.inflow ?? '',
      outflow: w.passport?.outflow ?? '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const passport = {
        surfaceArea: form.surfaceArea ? parseFloat(form.surfaceArea) : undefined,
        maxDepth: form.maxDepth ? parseFloat(form.maxDepth) : undefined,
        avgDepth: form.avgDepth ? parseFloat(form.avgDepth) : undefined,
        volume: form.volume ? parseFloat(form.volume) : undefined,
        catchmentArea: form.catchmentArea ? parseFloat(form.catchmentArea) : undefined,
        salinity: form.salinity ? parseFloat(form.salinity) : undefined,
        altitude: form.altitude ? parseFloat(form.altitude) : undefined,
        inflow: form.inflow || undefined,
        outflow: form.outflow || undefined,
      };
      const payload = {
        name: form.name,
        type: form.type,
        region: form.region,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        description: form.description || undefined,
        passport,
      };
      if (editing) {
        await updateWaterBody(editing.id, payload);
      } else {
        await createWaterBody(payload);
      }
      setShowForm(false);
      load();
    } catch {
      setError('Failed to save water body');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this water body?')) return;
    try {
      await deleteWaterBody(id);
      load();
    } catch {
      setError('Failed to delete water body');
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading water bodies...</div>;

  return (
    <div>
      {error && <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium transition-colors">
          + Add Water Body
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              {editing ? 'Edit Water Body' : 'Create Water Body'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { key: 'name', label: 'Name', required: true },
                { key: 'type', label: 'Type (lake/river/reservoir...)', required: true },
                { key: 'region', label: 'Region', required: true },
                { key: 'latitude', label: 'Latitude' },
                { key: 'longitude', label: 'Longitude' },
              ].map(({ key, label, required }) => (
                <input
                  key={key}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder={label}
                  value={(form as Record<string, string>)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                />
              ))}
              <textarea
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <div className="pt-2 pb-1 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Passport</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'surfaceArea', label: 'Area (km²)' },
                  { key: 'maxDepth', label: 'Max Depth (m)' },
                  { key: 'avgDepth', label: 'Avg Depth (m)' },
                  { key: 'volume', label: 'Volume (km³)' },
                  { key: 'catchmentArea', label: 'Catchment Area (km²)' },
                  { key: 'salinity', label: 'Salinity' },
                  { key: 'altitude', label: 'Altitude (m)' },
                ].map(({ key, label }) => (
                  <input
                    key={key}
                    type="number"
                    step="any"
                    className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder={label}
                    value={(form as Record<string, string>)[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                  />
                ))}
              </div>
              {[
                { key: 'inflow', label: 'Inflow' },
                { key: 'outflow', label: 'Outflow' },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder={label}
                  value={(form as Record<string, string>)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              ))}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 text-sm font-medium transition-colors">
                  {editing ? 'Save' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 text-sm font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Measurements</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(w => (
              <tr key={w.id} className="text-gray-800 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{w.name}</td>
                <td className="px-4 py-3 text-gray-600">{w.type}</td>
                <td className="px-4 py-3 text-gray-600">{w.region}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 border border-gray-300 text-gray-600 bg-gray-50 text-xs font-mono">
                    {w.measurements?.length ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <Link href={`/water-bodies/${w.id}`} className="text-orange-500 hover:text-orange-600 text-xs font-medium">Details</Link>
                  <button onClick={() => openEdit(w)} className="text-gray-600 hover:text-gray-900 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
