import React, { useState } from 'react';
import { glp1Logs } from '../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { Plus, ChevronDown, ChevronUp, CheckCircle2, XCircle, Pill, Smile, Zap, FileText } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const sideEffectOptions = ['Nausea', 'Fatigue', 'GI discomfort', 'Hair thinning', 'Headache', 'Constipation', 'Dizziness', 'None'];

const moodData = glp1Logs.slice().reverse().map(log => ({
  date: new Date(log.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  mood: log.mood,
  energy: log.energy,
}));

export default function Tracker({ lang }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    medicationTaken: true,
    dose: '7.5 mg',
    sideEffects: [] as string[],
    mood: 7,
    energy: 7,
    notes: '',
  });

  const toggleSideEffect = (se: string) => {
    setForm(f => ({
      ...f,
      sideEffects: f.sideEffects.includes(se)
        ? f.sideEffects.filter(x => x !== se)
        : [...f.sideEffects, se],
    }));
  };

  const getMoodLabel = (v: number) => {
    if (v <= 3) return '😞 Poor';
    if (v <= 5) return '😐 Okay';
    if (v <= 7) return '🙂 Good';
    return '😄 Great';
  };

  const getEnergyLabel = (v: number) => {
    if (v <= 3) return '🪫 Low';
    if (v <= 5) return '⚡ Moderate';
    if (v <= 7) return '🔋 Good';
    return '⚡⚡ High';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {l('GLP-1 Injection Log', 'GLP-1 Süstide Logi', lang)}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {l('Track your weekly injections, side effects, mood & energy', 'Jälgi iganädalasi süste, kõrvaltoimeid, meeleolu ja energiat', lang)}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          {l('Log This Week', 'Märgi Seekord', lang)}
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(196,162,101,0.3)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
            {l('New Entry', 'Uus Sissekanne', lang)}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">{l('Date of injection', 'Süsti kuupäev', lang)}</label>
              <input type="date" className="form-input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">{l('Dose', 'Annus', lang)}</label>
              <select className="form-select" value={form.dose}
                onChange={e => setForm(f => ({ ...f, dose: e.target.value }))}>
                {['2.5 mg', '5 mg', '7.5 mg', '10 mg', '12.5 mg', '15 mg'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{l('Medication taken?', 'Ravim võetud?', lang)}</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[true, false].map(val => (
                <button key={String(val)} onClick={() => setForm(f => ({ ...f, medicationTaken: val }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, border: '1px solid',
                    borderColor: form.medicationTaken === val ? 'var(--teal)' : 'var(--border)',
                    background: form.medicationTaken === val ? 'rgba(196,162,101,0.12)' : 'transparent',
                    color: form.medicationTaken === val ? 'var(--teal-light)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                  }}>
                  {val ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {val ? l('Yes', 'Jah', lang) : l('No', 'Ei', lang)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{l('Side Effects (select all that apply)', 'Kõrvaltoimed (vali kõik sobivad)', lang)}</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sideEffectOptions.map(se => (
                <button key={se} onClick={() => toggleSideEffect(se)}
                  style={{
                    padding: '6px 12px', borderRadius: 20, border: '1px solid',
                    borderColor: form.sideEffects.includes(se) ? 'var(--teal)' : 'var(--border)',
                    background: form.sideEffects.includes(se) ? 'rgba(196,162,101,0.12)' : 'transparent',
                    color: form.sideEffects.includes(se) ? 'var(--teal-light)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                  }}>
                  {se}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">
                {l('Mood', 'Meeleolu', lang)}: <b style={{ color: 'var(--teal-light)' }}>{getMoodLabel(form.mood)}</b>
              </label>
              <input type="range" min={1} max={10} value={form.mood}
                onChange={e => setForm(f => ({ ...f, mood: +e.target.value }))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                <span>1</span><span>10</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                {l('Energy', 'Energia', lang)}: <b style={{ color: 'var(--teal-light)' }}>{getEnergyLabel(form.energy)}</b>
              </label>
              <input type="range" min={1} max={10} value={form.energy}
                onChange={e => setForm(f => ({ ...f, energy: +e.target.value }))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                <span>1</span><span>10</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{l('Notes', 'Märkused', lang)}</label>
            <textarea className="form-textarea" placeholder={l('How did you feel this week? Any observations...', 'Kuidas enesetunne oli? Tähelepanekuid...', lang)}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>{l('Cancel', 'Tühista', lang)}</button>
            <button className="btn btn-primary" onClick={() => setShowForm(false)}>
              <CheckCircle2 size={14} />{l('Save Entry', 'Salvesta', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">{l('Mood & Energy Trends', 'Meeleolu ja Energia Trendid', lang)}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={moodData} barGap={4} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }} />
            <Bar dataKey="mood" fill="#C4A265" radius={[4, 4, 0, 0]} name="Mood" />
            <Bar dataKey="energy" fill="#C4A265" radius={[4, 4, 0, 0]} name="Energy" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Log list */}
      <div>
        <h3 className="section-title">{l('Recent Logs', 'Viimased Kanded', lang)}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {glp1Logs.map(log => (
            <div key={log.id} className="card card-hover" style={{ cursor: 'default' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                {/* Status icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: log.medicationTaken ? 'rgba(196,162,101,0.12)' : 'rgba(239,68,68,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {log.medicationTaken
                    ? <Pill size={18} style={{ color: 'var(--teal-light)' }} />
                    : <XCircle size={18} style={{ color: '#f87171' }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {new Date(log.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="badge badge-teal">{log.dose}</span>
                    {log.sideEffects.length > 0
                      ? log.sideEffects.map(se => <span key={se} className="badge badge-amber">{se}</span>)
                      : <span className="badge badge-green">No side effects</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span><Smile size={11} style={{ display: 'inline', marginRight: 3 }} />Mood: <b style={{ color: 'var(--text-secondary)' }}>{log.mood}/10</b></span>
                    <span><Zap size={11} style={{ display: 'inline', marginRight: 3 }} />Energy: <b style={{ color: 'var(--text-secondary)' }}>{log.energy}/10</b></span>
                  </div>
                </div>
                <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  {expandedLog === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedLog === log.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <FileText size={13} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{log.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
