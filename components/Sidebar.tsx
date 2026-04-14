'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearAuth } from '../lib/auth';

const NAV = [
  { href: '/', label: 'Dashboard', icon: '[#]' },
  { href: '/users', label: 'Users', icon: '[U]' },
  { href: '/water-bodies', label: 'Water Bodies', icon: '[~]' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Lale" className="w-4 h-4" />
          <span className="font-bold text-gray-900 tracking-widest uppercase text-sm">Lale</span>
          <span className="text-orange-500 font-mono text-xs">// admin</span>
        </div>
        <button className="font-mono text-sm text-gray-600" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '[x]' : '[=]'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 px-3 py-2 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium border-l-2 ${
                pathname === href
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <span className="font-mono text-xs text-gray-400">{icon}</span>
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 border-l-2 border-transparent"
          >
            <span className="font-mono text-xs text-gray-400">[x]</span>
            Logout
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen bg-white border-r border-gray-200 flex-col">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
          <img src="/favicon.svg" alt="Lale" className="w-5 h-5" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-widest uppercase leading-none">Lale</h1>
            <p className="text-orange-500 font-mono text-xs mt-0.5">// admin</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                pathname === href
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="font-mono text-xs text-gray-400">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 border-l-2 border-transparent transition-colors"
          >
            <span className="font-mono text-xs text-gray-400">[x]</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
