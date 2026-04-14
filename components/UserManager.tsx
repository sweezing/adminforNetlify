'use client';

import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../lib/api';
import type { User } from '../types';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = { login: '', email: '', password: '', role: 'CLIENT' as 'ADMIN' | 'CLIENT' };
  const [form, setForm] = useState(emptyForm);

  async function load() {
    try {
      setLoading(true);
      setUsers(await getUsers());
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({ login: u.login, email: u.email, password: '', role: u.role });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        const payload: Record<string, unknown> = { login: form.login, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await updateUser(editing.id, payload);
      } else {
        await createUser(form);
      }
      setShowForm(false);
      load();
    } catch {
      setError('Failed to save user');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      load();
    } catch {
      setError('Failed to delete user');
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading users...</div>;

  return (
    <div>
      {error && <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium transition-colors">
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              {editing ? 'Edit User' : 'Create User'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="Login"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                required
              />
              <input
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required={!editing}
              />
              <input
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                type="password"
                placeholder={editing ? 'New password (leave blank to keep)' : 'Password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required={!editing}
              />
              <select
                className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as 'ADMIN' | 'CLIENT' })}
              >
                <option value="CLIENT">CLIENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
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
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="text-gray-800 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                <td className="px-4 py-3 font-medium">{u.login}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-semibold border ${
                    u.role === 'ADMIN'
                      ? 'border-orange-300 text-orange-600 bg-orange-50'
                      : 'border-gray-300 text-gray-600 bg-gray-50'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => openEdit(u)} className="text-orange-500 hover:text-orange-600 text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
