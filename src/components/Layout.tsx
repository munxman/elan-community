import React, { useState } from 'react';
import {
  LayoutDashboard, Activity, Brain, Shield, MessageSquare,
  ClipboardList, Menu, X, ChevronRight, Globe, LogOut,
  Bell, Settings, Heart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  lang: 'en' | 'et';
  onLangToggle: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, en: 'Dashboard', et: 'Avaleht' },
  { id: 'tracker', icon: Activity, en: 'GLP-1 Tracker', et: 'GLP-1 Jälgija' },
  { id: 'readiness', icon: Brain, en: 'Readiness Score', et: 'Valmisoleku Skoor' },
  { id: 'prevention', icon: Shield, en: 'Regain Prevention', et: 'Kaalutõusu Ennetamine' },
  { id: 'forum', icon: MessageSquare, en: 'Community', et: 'Kogukond' },
  { id: 'wellness', icon: Heart, en: 'Wellness Score', et: 'Heaolu Skoor' },
  { id: 'plan', icon: ClipboardList, en: 'My Plan', et: 'Minu Plaan' },
];

export default function Layout({ children, activePage, onNavigate, lang, onLangToggle }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const label = (en: string, et: string) => lang === 'en' ? en : et;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transform: mobileOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.25s ease',
      }} className="sidebar">
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={(import.meta.env.BASE_URL || '/') + 'elan-icon.png'} alt="Élan" style={{width:36,height:36,borderRadius:10}} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Élan Clinic</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>CONCIERGE WEIGHT MANAGEMENT</div>
            </div>
          </div>
        </div>

        {/* Patient chip */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #9D7C49, #9D7C49)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
            }}>MT</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Moonika Tamm</div>
              <div style={{ fontSize: 11, color: 'var(--teal-light)' }}>Premium Plan · Week 22</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 4px', fontWeight: 600 }}>
            {label('Navigation', 'Navigatsioon')}
          </div>
          {navItems.map(item => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 12px',
                  borderRadius: 8, border: 'none',
                  background: active ? 'rgba(200,167,126,0.12)' : 'transparent',
                  color: active ? 'var(--teal-light)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                  borderLeft: active ? '2px solid var(--teal)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <item.icon size={16} />
                <span style={{ flex: 1 }}>{label(item.en, item.et)}</span>
                {active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <button onClick={onLangToggle} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}>
            <Globe size={14} />
            {lang === 'en' ? 'Switch to Eesti' : 'Switch to English'}
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--text-muted)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <LogOut size={14} />
            {label('Sign out', 'Logi välja')}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99,
        }} />
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column' }} className="main-content">
        {/* Topbar */}
        <header style={{
          height: 60, background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button onClick={() => setMobileOpen(true)} className="mobile-menu-btn" style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'none',
          }}>
            <Menu size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {navItems.find(n => n.id === activePage)?.[lang] ?? 'Dashboard'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
              <Bell size={18} />
            </button>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}>
              <Settings size={18} />
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #9D7C49, #9D7C49)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff'
            }}>MT</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0) !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          main { padding: 12px !important; }
        }
        @media (max-width: 480px) {
          /* MyPlan tab bar: hide text, show icons only */
          .myplan-tabs { gap: 2px !important; }
          .myplan-tabs button span { display: none !important; }
          .myplan-tabs button { padding: 9px 12px !important; }
          /* MyPlan training schedule: stack vertically */
          .training-session { flex-wrap: wrap !important; gap: 6px !important; padding: 10px !important; }
          .training-session .badge { margin-left: auto; }
          /* Forum post cards: smaller avatar, prevent overflow */
          .forum-post-row { gap: 8px !important; }
          .forum-post-row .forum-avatar { width: 28px !important; height: 28px !important; font-size: 9px !important; }
          .forum-actions { gap: 8px !important; flex-wrap: wrap !important; }
          /* Category pills: smaller on mobile */
          .forum-categories { gap: 4px !important; }
          .forum-categories button { padding: 5px 10px !important; font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
