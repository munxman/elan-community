import React from 'react';
import { patient, weightHistory } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  TrendingDown, Calendar, Pill, Target, Award,
  Clock, ChevronRight, AlertCircle, CheckCircle2, Flame
} from 'lucide-react';

interface Props { lang: 'en' | 'et' }

const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px',
      }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>{label}</div>
        <div style={{ color: 'var(--teal-light)', fontWeight: 700, fontSize: 16 }}>
          {payload[0].value} kg
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ lang }: Props) {
  const bmi = (patient.currentWeight / ((patient.height / 100) ** 2)).toFixed(1);
  const pctToGoal = Math.round(((patient.startWeight - patient.currentWeight) / (patient.startWeight - patient.goalWeight)) * 100);
  const kgToGoal = (patient.currentWeight - patient.goalWeight).toFixed(1);

  const daysUntilAppt = Math.ceil((new Date(patient.nextAppointment).getTime() - Date.now()) / 86400000);
  const nextDoseDays = Math.ceil((new Date(patient.nextDoseDate).getTime() - Date.now()) / 86400000);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13,148,136,0.2) 0%, rgba(196,162,101,0.08) 100%)',
        border: '1px solid rgba(196,162,101,0.25)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--teal-light)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6 }}>
            {l('THURSDAY, FEB 26, 2026', 'NELJAPÄEV, 26. VEEBRUAR 2026', lang)}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {l(`Welcome back, Moonika`, `Tere tulemast, Moonika`, lang)} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {l('Week 22 on Tirzepatide. You\'re doing exceptionally well.', 'Nädal 22 Tirzepatiidil. Läheb erakordselt hästi.', lang)}
          </p>
        </div>
        <div style={{
          background: 'rgba(196,162,101,0.1)', border: '1px solid rgba(196,162,101,0.2)',
          borderRadius: 12, padding: '12px 20px', textAlign: 'center', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
        }}>
          <Flame size={20} style={{ color: 'var(--teal-light)' }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal-light)', lineHeight: 1 }}>22</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {l('Week Streak', 'Nädala Streak', lang)}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: l('Current Weight', 'Praegune Kaal', lang), value: `${patient.currentWeight} kg`, sub: `BMI ${bmi}`, icon: <TrendingDown size={18} />, color: 'var(--teal)' },
          { label: l('Total Lost', 'Kaotatud Kokku', lang), value: `−${patient.totalLost} kg`, sub: `${patient.percentLost}% of start weight`, icon: <Award size={18} />, color: 'var(--emerald)' },
          { label: l('To Goal', 'Eesmärgini', lang), value: `${kgToGoal} kg`, sub: `${pctToGoal}% of the way there`, icon: <Target size={18} />, color: '#f59e0b' },
          { label: l('Next Appointment', 'Järgmine Visiit', lang), value: `${daysUntilAppt}d`, sub: 'Mar 4 · Dr. Lindström', icon: <Calendar size={18} />, color: '#3b82f6' },
        ].map((kpi, i) => (
          <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div className="label">{kpi.label}</div>
              <div style={{ color: kpi.color, opacity: 0.8 }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{kpi.sub}</div>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${kpi.color}, transparent)`,
            }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>
        {/* Weight chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              {l('Weight Progress', 'Kaalu Progress', lang)}
            </h3>
            <span className="badge badge-green">−{patient.totalLost} kg total</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[65, 110]} unit=" kg" width={55} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={patient.goalWeight} stroke="rgba(196,162,101,0.4)" strokeDasharray="5 5" label={{ value: 'Goal', fill: 'var(--emerald)', fontSize: 10, position: 'right' }} />
              <Line type="monotone" dataKey="weight" stroke="var(--teal)" strokeWidth={2.5} dot={{ fill: 'var(--teal)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'var(--teal-light)' }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{l('Start', 'Algus', lang)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)' }}>103.2 kg</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{l('Now', 'Praegu', lang)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--teal-light)' }}>78.4 kg</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{l('Goal', 'Eesmärk', lang)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--emerald-light)' }}>70.0 kg</div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Medication status */}
          <div className="card" style={{ borderColor: 'rgba(196,162,101,0.25)', background: 'rgba(13,148,136,0.08)' }}>
            <div className="label" style={{ marginBottom: 10 }}><Pill size={12} style={{ display: 'inline', marginRight: 4 }} />{l('Medication', 'Ravim', lang)}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>Tirzepatide</div>
            <div style={{ fontSize: 13, color: 'var(--teal-light)', fontWeight: 600, marginBottom: 10 }}>7.5 mg · Weekly</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <Clock size={12} />
              {nextDoseDays <= 0 ? (
                <span style={{ color: '#f87171' }}>{l('Dose due today!', 'Annus täna!', lang)}</span>
              ) : (
                <span>{l('Next dose in', 'Järgmine annus', lang)} <b style={{ color: 'var(--text-primary)' }}>{nextDoseDays}d</b> · Sat</span>
              )}
            </div>
            <div style={{ marginTop: 10, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${((7 - nextDoseDays) / 7) * 100}%`, height: '100%', background: 'var(--teal)', borderRadius: 2 }} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="card">
            <div className="label" style={{ marginBottom: 10 }}>{l('Journey Progress', 'Teekonna Progress', lang)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>0 kg</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal-light)' }}>{pctToGoal}%</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>−{(patient.startWeight - patient.goalWeight).toFixed(1)} kg</span>
            </div>
            <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{
                width: `${pctToGoal}%`, height: '100%',
                background: 'linear-gradient(90deg, var(--teal), var(--emerald))',
                borderRadius: 5, transition: 'width 1s ease'
              }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              {kgToGoal} kg {l('remaining to goal weight', 'eesmärgi kaaluni', lang)}
            </div>
          </div>

          {/* Next appointment */}
          <div className="card card-hover">
            <div className="label"><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{l('Next Visit', 'Järgmine Visiit', lang)}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>Mar 4, 2026 · 10:00</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Dr. Ingmar Lindström</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Élan Clinic, Sepapaja 12/1</div>
            <div style={{ marginTop: 10 }}>
              <span className="badge badge-teal">{l('Confirmed', 'Kinnitatud', lang)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="section-title">{l('Quick Actions', 'Kiired Toimingud', lang)}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { icon: <CheckCircle2 size={16} />, text: l('Log this week\'s injection', 'Märgi selle nädala süst', lang), badge: 'Due Friday', badgeClass: 'badge-amber' },
            { icon: <TrendingDown size={16} />, text: l('Log today\'s weight', 'Märgi tänane kaal', lang), badge: 'Daily', badgeClass: 'badge-teal' },
            { icon: <AlertCircle size={16} />, text: l('Check readiness score', 'Vaata valmisoleku skoori', lang), badge: 'Score: 62/100', badgeClass: 'badge-blue' },
          ].map((a, i) => (
            <button key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'var(--bg-primary)',
              border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
              textAlign: 'left', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ color: 'var(--teal)', flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>{a.text}</div>
              <span className={`badge ${a.badgeClass}`}>{a.badge}</span>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
