import React, { useState } from 'react';
import { preventionChecklist } from '../data/mockData';
import { CheckSquare, Square, ChevronDown, ChevronUp, AlertCircle, Shield, BookOpen, TrendingDown, Phone } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const categories = ['Habits', 'Nutrition', 'Monitoring', 'Mindset'];

const warningSignsData = [
  { icon: '⚖️', title: 'Unexplained weight gain of 2+ kg', severity: 'high', detail: 'A 2kg+ increase over 2 weeks without a clear explanation (travel, illness, menstrual cycle) warrants attention. Contact your care team.' },
  { icon: '🍽️', title: 'Return of intense food cravings', severity: 'medium', detail: 'Craving specific foods intensely, especially ultra-processed options, suggests hunger regulation may be shifting. Log and discuss.' },
  { icon: '💤', title: 'Sleep deterioration', severity: 'medium', detail: 'Poor sleep increases ghrelin (hunger hormone) and decreases leptin (satiety hormone). One bad week is normal; patterns are not.' },
  { icon: '😰', title: 'Major life stressor', severity: 'medium', detail: 'Job loss, relationship changes, bereavement, or major illness significantly increase relapse risk. Proactively reach out to your team.' },
  { icon: '🏋️', title: 'Stopping exercise for 2+ weeks', severity: 'high', detail: 'Exercise is your primary metabolic defense. Missing 2+ consecutive weeks without a medical reason is a significant risk factor.' },
  { icon: '🧠', title: 'Emotional eating episodes', severity: 'high', detail: 'Using food to manage emotions is the most common pathway to weight regain. If this is happening weekly, flag it immediately.' },
];

const plateauStrategies = [
  { title: 'Audit your protein intake', body: 'Underestimating protein is the most common issue. Log everything for 5 days using MyFitnessPal. Target 30g per meal minimum.' },
  { title: 'Check sleep quality', body: 'Even 30 minutes less sleep per night meaningfully increases cortisol and hunger. Use a sleep tracker for 2 weeks and review.' },
  { title: 'Vary your exercise stimulus', body: 'Your body adapts to routine. Add one new strength exercise, increase weight, or try a new cardio format to force adaptation.' },
  { title: 'Review liquid calories', body: 'Coffee drinks, juices, kombucha, and alcohol are common invisible sources. Log all liquids for a week.' },
  { title: 'Check stress levels', body: 'High cortisol promotes fat storage, particularly visceral fat. If stress is elevated, this must be addressed before expecting the scale to move.' },
  { title: 'Discuss with your doctor', body: 'If you\'ve genuinely optimized sleep, nutrition, and exercise and the plateau continues beyond 6 weeks, discuss dose adjustment with Dr. Lindström.' },
];

export default function Prevention({ lang }: Props) {
  const [checklist, setChecklist] = useState(preventionChecklist);
  const [expandedWarning, setExpandedWarning] = useState<number | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleCheck = (id: number) => {
    setChecklist(list => list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(i => i.checked).length;
  const pct = Math.round((checkedCount / checklist.length) * 100);
  const filtered = activeCategory === 'All' ? checklist : checklist.filter(i => i.category === activeCategory);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {l('Weight Regain Prevention', 'Kaalutõusu Ennetamine', lang)}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {l('Your maintenance toolkit — habits, warning signs, and strategies', 'Sinu hooldustööriistakast — harjumused, hoiatussignaalid ja strateegiad', lang)}
        </p>
      </div>

      {/* Checklist progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>
            <Shield size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--teal)' }} />
            {l('Maintenance Checklist', 'Hooldustšeklist', lang)}
          </h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal-light)' }}>{checkedCount}/{checklist.length}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l('habits active', 'harjumust aktiivsed', lang)}</div>
          </div>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), var(--emerald))', borderRadius: 3 }} />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['All', ...categories].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '5px 12px', borderRadius: 20, border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--teal)' : 'var(--border)',
                background: activeCategory === cat ? 'rgba(200,167,126,0.12)' : 'transparent',
                color: activeCategory === cat ? 'var(--teal-light)' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(item => (
            <div key={item.id}
              onClick={() => toggleCheck(item.id)}
              style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 12px', borderRadius: 8,
                background: item.checked ? 'rgba(200,167,126,0.06)' : 'var(--bg-primary)',
                border: '1px solid', borderColor: item.checked ? 'rgba(200,167,126,0.2)' : 'var(--border)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <div style={{ color: item.checked ? 'var(--teal)' : 'var(--text-muted)', flexShrink: 0, marginTop: 1 }}>
                {item.checked ? <CheckSquare size={16} /> : <Square size={16} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: item.checked ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.checked ? 'line-through' : 'none', transition: 'all 0.15s' }}>
                  {item.text}
                </div>
              </div>
              <span className="badge badge-gray" style={{ fontSize: 10 }}>{item.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Signs */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">
          <AlertCircle size={16} style={{ display: 'inline', marginRight: 8, color: '#f87171' }} />
          {l('Early Warning Signs', 'Varajased Hoiatussignaalid', lang)}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          {l('Catching these early makes all the difference. Don\'t wait until it\'s obvious.', 'Varajane märkamine on kõik. Ära oota, kuni on ilmne.', lang)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {warningSignsData.map((w, i) => (
            <div key={i} style={{
              border: '1px solid', borderRadius: 10, overflow: 'hidden',
              borderColor: expandedWarning === i ? (w.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)') : 'var(--border)',
            }}>
              <div onClick={() => setExpandedWarning(expandedWarning === i ? null : i)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }}>
                <span style={{ fontSize: 20 }}>{w.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{w.title}</span>
                <span className={`badge ${w.severity === 'high' ? 'badge-red' : 'badge-amber'}`}>{w.severity}</span>
                {expandedWarning === i ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
              </div>
              {expandedWarning === i && (
                <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>{w.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plateau strategies */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">
          <TrendingDown size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--teal)' }} />
          {l('Plateau Strategies', 'Platoo Strateegiad', lang)}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          {l('Plateaus are normal. Here\'s your systematic approach when the scale stops moving.', 'Platood on normaalsed. Siin on süstemaatiline lähenemine, kui kaal ei liigu.', lang)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {plateauStrategies.map((s, i) => (
            <div key={i} style={{
              border: '1px solid', borderRadius: 10, overflow: 'hidden',
              borderColor: expandedStrategy === i ? 'rgba(200,167,126,0.3)' : 'var(--border)',
            }}>
              <div onClick={() => setExpandedStrategy(expandedStrategy === i ? null : i)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(200,167,126,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--teal-light)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{s.title}</span>
                {expandedStrategy === i ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
              </div>
              {expandedStrategy === i && (
                <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 10 }}>{s.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div className="card" style={{ background: 'rgba(13,148,136,0.08)', borderColor: 'rgba(200,167,126,0.25)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,167,126,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Phone size={18} style={{ color: 'var(--teal-light)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              {l('When in doubt — reach out', 'Kahtluse korral — võta ühendust', lang)}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              {l('Your Élan care team is here for you. There are no silly questions. Early intervention always beats late correction.', 'Sinu Élan meeskond on alati olemas. Rumalaid küsimusi pole. Varajane sekkumine on alati parem kui hiline parandamine.', lang)}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>
                {l('Message Care Team', 'Kirjuta Meeskonnale', lang)}
              </button>
              <button className="btn btn-secondary" style={{ fontSize: 13 }}>
                {l('Book Appointment', 'Broneeri Visiit', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
