import React, { useState } from 'react';
import { myPlan } from '../data/mockData';
import { Pill, Utensils, Dumbbell, Flag, CheckCircle2, Circle, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const tabs = [
  { id: 'medication', icon: Pill, en: 'Medication', et: 'Ravim' },
  { id: 'nutrition', icon: Utensils, en: 'Nutrition', et: 'Toitumine' },
  { id: 'training', icon: Dumbbell, en: 'Training', et: 'Treening' },
  { id: 'milestones', icon: Flag, en: 'Milestones', et: 'Vahe-eesmärgid' },
];

const dayColors: Record<string, string> = {
  Monday: '#C8A77E', Tuesday: '#C8A77E', Wednesday: '#C8A77E',
  Thursday: '#C8A77E', Friday: '#3b82f6', Saturday: '#C8A77E', Sunday: '#64748b',
};

const typeColors: Record<string, string> = {
  Strength: 'badge-teal',
  Cardio: 'badge-blue',
  'Active Rest': 'badge-gray',
};

export default function MyPlan({ lang }: Props) {
  const [activeTab, setActiveTab] = useState('medication');
  const [expandedNote, setExpandedNote] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {l('My Treatment Plan', 'Minu Ravimiaplaan', lang)}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {l('Your personalised Élan Clinic protocol', 'Sinu personaalne Élan Kliiniku protokoll', lang)}
        </p>
      </div>

      {/* Protocol header */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(200,167,126,0.05))', borderColor: 'rgba(200,167,126,0.3)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, #C8A77E, #9D7C49)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff', flexShrink: 0, boxShadow: '0 0 20px rgba(200,167,126,0.3)' }}>É</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: 'var(--teal-light)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>
              {l('Active Protocol', 'Aktiivne Protokoll', lang)}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Tirzepatide Weight Management Protocol</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Dr. Ingmar Lindström · Élan Clinic, Tallinn · Started Sep 2024</div>
          </div>
          <span className="badge badge-teal" style={{ fontSize: 12, padding: '6px 14px' }}>
            {l('Week 22', 'Nädal 22', lang)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="myplan-tabs" style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: 20, border: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 10px', borderRadius: 8, border: 'none',
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--teal-light)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              boxShadow: activeTab === tab.id ? 'var(--shadow)' : 'none',
            }}>
            <tab.icon size={15} />
            <span>{lang === 'en' ? tab.en : tab.et}</span>
          </button>
        ))}
      </div>

      {/* Medication tab */}
      {activeTab === 'medication' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
            {[
              { label: l('Medication', 'Ravim', lang), value: 'Tirzepatide (Mounjaro)', mono: false },
              { label: l('Current Dose', 'Praegune Annus', lang), value: '7.5 mg', mono: true },
              { label: l('Schedule', 'Ajakava', lang), value: 'Every Friday', mono: false },
              { label: l('Next Dose', 'Järgmine Annus', lang), value: 'Sat, Feb 28', mono: false },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="label">{item.label}</div>
                <div style={{ fontSize: item.mono ? 22 : 15, fontWeight: 700, color: item.mono ? 'var(--teal-light)' : 'var(--text-primary)', marginTop: 4 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              {l('Dose Escalation Schedule', 'Annuste Suurendamise Ajakava', lang)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { dose: '2.5 mg', period: 'Weeks 1–4', status: 'done' },
                { dose: '5 mg', period: 'Weeks 5–8', status: 'done' },
                { dose: '7.5 mg', period: 'Weeks 9+', status: 'current' },
                { dose: '10 mg', period: 'TBD — if plateau > 6 weeks', status: 'future' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
                  background: step.status === 'current' ? 'rgba(200,167,126,0.08)' : step.status === 'done' ? 'transparent' : 'transparent',
                  border: '1px solid', borderColor: step.status === 'current' ? 'rgba(200,167,126,0.3)' : 'var(--border)' }}>
                  <div style={{ color: step.status === 'done' ? 'var(--emerald)' : step.status === 'current' ? 'var(--teal)' : 'var(--text-muted)', flexShrink: 0 }}>
                    {step.status === 'done' ? <CheckCircle2 size={16} /> : step.status === 'current' ? <Zap size={16} /> : <Circle size={16} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: step.status === 'current' ? 'var(--text-primary)' : step.status === 'done' ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{step.dose}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{step.period}</span>
                  </div>
                  {step.status === 'current' && <span className="badge badge-teal">{l('Current', 'Praegune', lang)}</span>}
                  {step.status === 'done' && <span className="badge badge-green">{l('Complete', 'Lõpetatud', lang)}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div onClick={() => setExpandedNote(!expandedNote)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                {l('Storage & Administration Notes', 'Hoiustamise ja Manustamise Juhised', lang)}
              </h4>
              {expandedNote ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
            </div>
            {expandedNote && (
              <div style={{ marginTop: 12 }}>
                {[myPlan.medication.storage, 'Inject subcutaneously in abdomen, thigh, or upper arm. Rotate sites.', 'If you miss a dose by < 4 days: inject ASAP. If > 4 days: skip and resume next scheduled dose.'].map((note, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nutrition tab */}
      {activeTab === 'nutrition' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 16 }}>
            {[
              { label: l('Daily Calories', 'Päevakaloreid', lang), value: '1,600–1,800', unit: 'kcal', color: '#f59e0b' },
              { label: l('Protein Target', 'Valgusihttase', lang), value: '120–140', unit: 'g/day', color: 'var(--teal)' },
              { label: l('Net Carbs', 'Netosuivesik', lang), value: '< 150', unit: 'g/day', color: '#3b82f6' },
              { label: l('Meals / Day', 'Toitu / Päev', lang), value: '3', unit: 'no snacks', color: 'var(--emerald)' },
              { label: l('Water', 'Vesi', lang), value: '2.5+', unit: 'litres', color: '#06b6d4' },
            ].map((m, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.unit}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              {l('Daily Supplements', 'Päevased Toidulisandid', lang)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myPlan.nutrition.supplements.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              {l('Nutrition Principles', 'Toitumispõhimõtted', lang)}
            </h4>
            {['Protein first at every meal — hit 30g before adding carbs or fats',
              'Eat slowly (20+ min meals). Tirzepatide slows gastric emptying — eat too fast and you\'ll feel sick.',
              'Prioritise whole, minimally processed foods. Your gut bacteria thank you.',
              'Limit alcohol — it blocks fat oxidation for 12-24h and adds empty calories',
              'Don\'t fear fats. Olive oil, nuts, avocado, and fatty fish are your allies.'].map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(200,167,126,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--teal-light)', flexShrink: 0 }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training tab */}
      {activeTab === 'training' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div className="card">
              <div className="label">{l('Daily Steps', 'Päevasammud', lang)}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal-light)', marginTop: 4 }}>8,000–10,000</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l('steps per day minimum', 'sammu päevas minimaalselt', lang)}</div>
            </div>
            <div className="card">
              <div className="label">{l('Cardio Target', 'Kardio Eesmärk', lang)}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--emerald-light)', marginTop: 4 }}>120–140 bpm</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l('Zone 2 heart rate', 'Tsooni 2 südame löögisagedus', lang)}</div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
              {l('Weekly Schedule', 'Iganädalane Ajakava', lang)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myPlan.training.weeklySchedule.map((session, i) => (
                <div key={i} className="training-session" style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderRadius: 10, background: 'var(--bg-primary)', border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 44, height: 36, borderRadius: 8, flexShrink: 0,
                    background: `${dayColors[session.day] ?? 'var(--teal)'}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: dayColors[session.day] ?? 'var(--teal)',
                  }}>
                    {session.day.slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{session.detail}</div>
                  </div>
                  <span className={`badge ${typeColors[session.type] ?? 'badge-gray'}`}>{session.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestones tab */}
      {activeTab === 'milestones' && (
        <div className="card">
          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
            {l('Journey Milestones', 'Teekonna Vahe-eesmärgid', lang)}
          </h4>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {myPlan.milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: m.done ? 'linear-gradient(135deg, #C8A77E, #9D7C49)' : 'var(--bg-secondary)',
                    border: `2px solid ${m.done ? 'var(--teal)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, boxShadow: m.done ? '0 0 10px rgba(200,167,126,0.3)' : 'none',
                  }}>
                    {m.done
                      ? <CheckCircle2 size={16} style={{ color: '#fff' }} />
                      : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div style={{ flex: 1, paddingTop: 6 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: m.done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: m.done ? 'var(--teal-light)' : 'var(--text-muted)' }}>
                        {m.value}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.date}</div>
                  </div>
                  {m.done && <span className="badge badge-green">{l('Done', 'Tehtud', lang)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
