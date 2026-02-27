import React, { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import { Heart, TrendingUp, TrendingDown, Minus, Save, RotateCcw } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

interface WeekData {
  training: number; protein: number; sleep: number; mood: number;
  weekOf: string;
}

const STORAGE_KEY = 'elan-wellness-scores';

const getStoredWeeks = (): WeekData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const getCurrentWeekLabel = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1);
  return start.toISOString().slice(0, 10);
};

const mockLastWeek: WeekData = { training: 3, protein: 4, sleep: 3, mood: 4, weekOf: '2026-02-17' };

export default function WellnessScore({ lang }: Props) {
  const [weeks, setWeeks] = useState<WeekData[]>(getStoredWeeks);
  const currentWeekLabel = getCurrentWeekLabel();
  const currentWeek = weeks.find(w => w.weekOf === currentWeekLabel);
  const lastWeek = weeks.length > 1
    ? weeks.find(w => w.weekOf !== currentWeekLabel)
    : mockLastWeek;

  const [training, setTraining] = useState(currentWeek?.training ?? 0);
  const [protein, setProtein] = useState(currentWeek?.protein ?? 0);
  const [sleep, setSleep] = useState(currentWeek?.sleep ?? 0);
  const [mood, setMood] = useState(currentWeek?.mood ?? 0);
  const [saved, setSaved] = useState(false);

  const totalScore = training + protein + sleep + mood;
  const maxScore = 20;
  const lastWeekTotal = lastWeek ? lastWeek.training + lastWeek.protein + lastWeek.sleep + lastWeek.mood : 0;
  const diff = totalScore - lastWeekTotal;

  const trend = diff > 1 ? 'improving' : diff < -1 ? 'attention' : 'stable';
  const trendLabel = {
    improving: l('Improving ↑', 'Paranemas ↑', lang),
    stable: l('Stable →', 'Stabiilne →', lang),
    attention: l('Needs attention ↓', 'Vajab tähelepanu ↓', lang),
  }[trend];
  const trendColor = { improving: 'var(--emerald)', stable: 'var(--teal-light)', attention: '#f59e0b' }[trend];
  const TrendIcon = { improving: TrendingUp, stable: Minus, attention: TrendingDown }[trend];

  const radarData = [
    { category: l('Training', 'Treening', lang), current: training, last: lastWeek?.training ?? 0 },
    { category: l('Protein', 'Valk', lang), current: protein, last: lastWeek?.protein ?? 0 },
    { category: l('Sleep', 'Uni', lang), current: sleep, last: lastWeek?.sleep ?? 0 },
    { category: l('Mood', 'Tuju', lang), current: mood, last: lastWeek?.mood ?? 0 },
  ];

  const handleSave = () => {
    const entry: WeekData = { training, protein, sleep, mood, weekOf: currentWeekLabel };
    const updated = [entry, ...weeks.filter(w => w.weekOf !== currentWeekLabel)].slice(0, 12);
    setWeeks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ScoreSlider = ({ label, value, onChange, emoji }: { label: string; value: number; onChange: (v: number) => void; emoji: string }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{emoji} {label}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: value >= 4 ? 'var(--emerald)' : value >= 3 ? 'var(--teal-light)' : value >= 2 ? '#f59e0b' : 'var(--text-muted)' }}>{value}/5</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => onChange(n)} style={{
            flex: 1, height: 36, borderRadius: 8, border: '1px solid',
            borderColor: value >= n ? 'var(--teal)' : 'var(--border)',
            background: value >= n ? 'rgba(13,148,136,0.2)' : 'var(--bg-primary)',
            color: value >= n ? 'var(--teal-light)' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={20} style={{ color: 'var(--teal-light)' }} />
          {l('Weekly Wellness Score', 'Nädala Heaolu Skoor', lang)}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {l('Rate your week across four pillars. Track trends, not perfection.', 'Hinda oma nädalat nelja samba lõikes. Jälgi trende, mitte täiuslikkust.', lang)}
        </p>
      </div>

      {/* Score overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {l('This Week', 'See Nädal', lang)}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal-light)', lineHeight: 1 }}>{totalScore}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ {maxScore}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {l('Last Week', 'Eelmine Nädal', lang)}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-secondary)', lineHeight: 1 }}>{lastWeekTotal}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ {maxScore}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {l('Trend', 'Trend', lang)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <TrendIcon size={20} style={{ color: trendColor }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: trendColor }}>{trendLabel}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Scoring inputs */}
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 16 }}>
            {l('Rate This Week', 'Hinda Seda Nädalat', lang)}
          </h3>
          <ScoreSlider label={l('Training Consistency', 'Treeningu Järjepidevus', lang)} value={training} onChange={setTraining} emoji="💪" />
          <ScoreSlider label={l('Protein Target', 'Valgu Eesmärk', lang)} value={protein} onChange={setProtein} emoji="🥩" />
          <ScoreSlider label={l('Sleep Quality', 'Une Kvaliteet', lang)} value={sleep} onChange={setSleep} emoji="😴" />
          <ScoreSlider label={l('Overall Mood', 'Üldine Tuju', lang)} value={mood} onChange={setMood} emoji="🧠" />

          <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            <Save size={16} />
            {saved ? l('Saved! ✓', 'Salvestatud! ✓', lang) : l('Save This Week', 'Salvesta See Nädal', lang)}
          </button>
        </div>

        {/* Radar chart */}
        <div className="card">
          <h3 className="section-title" style={{ marginBottom: 16 }}>
            {l('This Week vs Last Week', 'See Nädal vs Eelmine', lang)}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
              <Radar name={l('This Week', 'See Nädal', lang)} dataKey="current" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.3} strokeWidth={2} />
              <Radar name={l('Last Week', 'Eelmine', lang)} dataKey="last" stroke="rgba(200,167,126,0.5)" fill="rgba(200,167,126,0.1)" fillOpacity={0.2} strokeWidth={1} strokeDasharray="4 4" />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: 'var(--text-secondary)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 3, background: 'var(--teal)', borderRadius: 2 }} />
              {l('This Week', 'See Nädal', lang)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 3, background: 'rgba(200,167,126,0.5)', borderRadius: 2, borderTop: '1px dashed rgba(200,167,126,0.5)' }} />
              {l('Last Week', 'Eelmine Nädal', lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Insight card */}
      <div className="card" style={{ marginTop: 20, background: 'rgba(13,148,136,0.05)', borderColor: 'rgba(13,148,136,0.2)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>💡</div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              {l('Weekly Insight', 'Nädala Tähelepanek', lang)}
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {totalScore >= 16
                ? l('Excellent week! Your consistency across all four pillars is strong. Keep this momentum.', 'Suurepärane nädal! Sinu järjepidevus kõigis neljas sambas on tugev. Jätka samas vaimus.', lang)
                : totalScore >= 12
                ? l('Good progress. Look at your lowest-scoring area — one small improvement there could shift your entire week.', 'Hea areng. Vaata oma madalaima skooriga valdkonda — üks väike paranemine seal võib muuta kogu nädala.', lang)
                : totalScore >= 8
                ? l('Room for growth. Focus on just one pillar this week — don\'t try to fix everything at once.', 'Arenguruumi on. Keskendu sel nädalal ainult ühele sambale — ära proovi kõike korraga parandada.', lang)
                : l('Tough week — and that\'s okay. One small step tomorrow is all it takes to change direction.', 'Raske nädal — ja see on okei. Üks väike samm homme on kõik, mis suuna muutmiseks vaja.', lang)
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
