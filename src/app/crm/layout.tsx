'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CrmAuthProvider, useCrmAuth } from '@/contexts/CrmAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BarChart2, Radio, Users, LogOut } from 'lucide-react';
import { trackCrmLogin } from '@/lib/sentry';

function LoginScreen() {
  const { login } = useCrmAuth();
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/crm/stats', {
      headers: { 'x-crm-password': pw },
    });

    setLoading(false);

    if (res.ok) {
      login(pw);
      trackCrmLogin();
    } else {
      setError('סיסמא שגויה, נסה שוב');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-extrabold text-white">כניסה למערכת ניהול לקוחות</h1>
          <p className="text-violet-300 mt-2">קוגנט CRM</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="סיסמא"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="הזן סיסמא..."
              error={error}
              className="bg-white/90"
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              כניסה למערכת
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CrmShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout } = useCrmAuth();
  const pathname = usePathname();

  if (!isLoggedIn) return <LoginScreen />;

  const navItems = [
    { href: '/crm', label: 'לידים', icon: Users },
    { href: '/crm/analytics', label: 'אנליטיקס', icon: BarChart2 },
    { href: '/crm/live', label: 'מבקרים חיים', icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-extrabold text-violet-700">קוגנט CRM</span>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">התנתק</span>
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmAuthProvider>
      <CrmShell>{children}</CrmShell>
    </CrmAuthProvider>
  );
}
