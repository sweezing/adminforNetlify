'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';
import { saveTokens, saveUser } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.login, form.password);
      if (data.user.role !== 'ADMIN') {
        setError('Access denied: ADMIN role required');
        return;
      }
      saveTokens(data.accessToken, data.refreshToken);
      saveUser(data.user);
      router.push('/');
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-widest uppercase">Lale</h1>
          <p className="text-orange-500 font-mono text-xs mt-1">// admin panel</p>
        </div>
        <div className="bg-white border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-600 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Login</label>
              <input
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="admin"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
              <input
                type="password"
                className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 text-sm font-semibold transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
