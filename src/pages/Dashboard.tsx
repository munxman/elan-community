import React from 'react';
import { patient, weightHistory } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  TrendingDown, Calendar, Pill, Target, Award,
  Clock, ChevronRight, AlertCircle, CheckCircle2, Flame, Send, Sparkles
} from 'lucide-react';

interface Props { lang: 'en' | 'et' }

const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const CHECKIN_STORAGE = 'elan-daily-checkin';

interface CheckinData {
  date: string;
  message: string;
  streak: number;
}

const getCheckinData = (): CheckinData[] => {
  try {
    const raw = localStorage.getItem(CHECKIN_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const DailyCheckin = ({ lang }: { lang: 'en' | 'et' }) => {
  const [checkins, setCheckins] = React.useState(getCheckinData);
  const [input, setInput] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const today = getTodayStr();
  const todayCheckin = checkins.find(c => c.date === today);
  const streak = todayCheckin ? todayCheckin.streak : (checkins.length > 0 ? checkins[0].streak : 0);

  React.useEffect(() => {
    if (todayCheckin) setSubmitted(true);
  }, [todayCheckin]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const lastCheckin = checkins.length > 0 ? checkins[0] : null;
    const newStreak = lastCheckin && lastCheckin.date === yesterdayStr ? lastCheckin.streak + 1 : 1;

    const entry: CheckinData = { date: today, message: input.trim(), streak: newStreak };
    const updated = [entry, ...checkins.filter(c => c.date !== today)].slice(0, 30);
    setCheckins(updated);
    localStorage.setItem(CHECKIN_STORAGE, JSON.stringify(updated));
    setSubmitted(true);
    setInput('');
  };

  if (submitted && todayCheckin) {
    return (
      <div className="card" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Sparkles size={18} style={{ color: 'var(--emerald)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {l('Today\'s Check-In', 'Tänane Sisseregistreerimine', lang)} ✓
          </span>
          <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
            🔥 {l('Day', 'Päev', lang)} {todayCheckin.streak}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
          "{todayCheckin.message}"
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderColor: 'rgba(200,167,126,0.25)', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Sparkles size={18} style={{ color: 'var(--teal-light)' }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          {l('Daily Check-In', 'Igapäevane Sisseregistreerimine', lang)}
        </span>
        {streak > 0 && (
          <span className="badge badge-teal" style={{ marginLeft: 'auto' }}>
            🔥 {streak} {l('day streak', 'päeva järjest', lang)}
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
        {l('What\'s one healthy choice you\'re making today?', 'Mis on üks tervislik valik, mille sa täna teed?', lang)}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder={l('e.g., "Taking a 30-min walk after lunch"', 'nt. "Lähen pärast lõunat 30 min jalutama"', lang)}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit} className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

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
        background: 'linear-gradient(135deg, rgba(13,148,136,0.2) 0%, rgba(200,167,126,0.08) 100%)',
        border: '1px solid rgba(200,167,126,0.25)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
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
          background: 'rgba(200,167,126,0.1)', border: '1px solid rgba(200,167,126,0.2)',
          borderRadius: 12, padding: '12px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
        }}>
          <Flame size={20} style={{ color: 'var(--teal-light)' }} />
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal-light)', lineHeight: 1 }}>22</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {l('Week Streak', 'Nädala Streak', lang)}
          </div>
        </div>
      </div>

      {/* Daily Check-In */}
      <DailyCheckin lang={lang} />

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
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
              <ReferenceLine y={patient.goalWeight} stroke="rgba(200,167,126,0.4)" strokeDasharray="5 5" label={{ value: 'Goal', fill: 'var(--emerald)', fontSize: 10, position: 'right' }} />
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
          <div className="card" style={{ borderColor: 'rgba(200,167,126,0.25)', background: 'rgba(13,148,136,0.08)' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
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
