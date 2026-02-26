import React, { useState } from 'react';
import { Brain, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const questions = [
  {
    id: 'stable_weight',
    category: 'Weight Stability',
    question: 'How long has your weight been stable (±1 kg)?',
    options: [
      { label: 'Less than 1 month', value: 0 },
      { label: '1–2 months', value: 10 },
      { label: '2–3 months', value: 18 },
      { label: '3+ months', value: 25 },
    ],
    maxPoints: 25,
    info: 'Weight stability for 3+ months is the strongest predictor of successful discontinuation.',
  },
  {
    id: 'training',
    category: 'Physical Activity',
    question: 'How consistently do you strength train?',
    options: [
      { label: 'Rarely or never', value: 0 },
      { label: '1x per week', value: 5 },
      { label: '2x per week', value: 12 },
      { label: '3+ times per week', value: 20 },
    ],
    maxPoints: 20,
    info: 'Muscle mass is your primary metabolic insurance. Regular strength training is essential for maintenance.',
  },
  {
    id: 'protein',
    category: 'Nutrition',
    question: 'Are you consistently hitting your protein target (120g+ daily)?',
    options: [
      { label: 'No, rarely', value: 0 },
      { label: 'Sometimes (3-4 days/week)', value: 4 },
      { label: 'Most days (5-6 days/week)', value: 8 },
      { label: 'Yes, consistently 7 days', value: 12 },
    ],
    maxPoints: 12,
    info: 'High protein intake supports muscle preservation and satiety during maintenance.',
  },
  {
    id: 'sleep',
    category: 'Sleep',
    question: 'How would you rate your sleep quality over the past month?',
    options: [
      { label: 'Poor — under 6h or frequent waking', value: 0 },
      { label: 'Fair — 6–7h, occasional issues', value: 3 },
      { label: 'Good — 7–8h most nights', value: 7 },
      { label: 'Excellent — 8h+, restful consistently', value: 10 },
    ],
    maxPoints: 10,
    info: 'Poor sleep dramatically increases hunger hormones (ghrelin) and reduces willpower.',
  },
  {
    id: 'hunger_management',
    category: 'Behavioral Readiness',
    question: 'Can you reliably distinguish physical hunger from emotional eating?',
    options: [
      { label: 'No, I often eat emotionally', value: 0 },
      { label: 'Sometimes, I\'m still learning', value: 4 },
      { label: 'Usually, with occasional lapses', value: 8 },
      { label: 'Yes, I have strong awareness', value: 13 },
    ],
    maxPoints: 13,
    info: 'GLP-1 medications suppress appetite artificially. Behavioral skills must compensate after stopping.',
  },
  {
    id: 'habits',
    category: 'Habits',
    question: 'How embedded are your healthy lifestyle habits?',
    options: [
      { label: 'Still effortful — requires constant attention', value: 0 },
      { label: 'Mostly routines but some struggle areas', value: 4 },
      { label: 'Mostly automatic, sustainable', value: 8 },
      { label: 'Fully automatic — part of my identity', value: 10 },
    ],
    maxPoints: 10,
    info: 'Habits that require willpower are fragile. The goal is to make healthy choices effortless.',
  },
  {
    id: 'stress',
    category: 'Stress & Mental Health',
    question: 'How well are you managing stress and emotional wellbeing?',
    options: [
      { label: 'Poorly — high stress, no coping tools', value: 0 },
      { label: 'Managing but struggling', value: 3 },
      { label: 'Good — active stress management', value: 7 },
      { label: 'Excellent — resilient and balanced', value: 10 },
    ],
    maxPoints: 10,
    info: 'Chronic stress increases cortisol, which promotes fat storage and drives cravings.',
  },
];

const getRecommendation = (score: number) => {
  if (score < 40) return {
    level: 'not-ready',
    label: 'Not Ready Yet',
    color: '#ef4444',
    badgeClass: 'badge-red',
    message: 'Your score suggests there are important foundations still being built. Continue on medication and focus on strengthening your exercise routine, sleep quality, and behavioral habits. Discontinuing now carries a high risk of weight regain.',
    actions: ['Prioritize sleep improvement', 'Increase strength training to 3x/week', 'Work with a nutritionist on protein targets', 'Continue current medication dose'],
  };
  if (score < 65) return {
    level: 'getting-close',
    label: 'Getting Closer',
    color: '#f59e0b',
    badgeClass: 'badge-amber',
    message: 'Good progress — you\'re building the foundations. A few more months of consolidating habits and achieving weight stability will significantly improve your readiness. Discuss a gradual dose-reduction plan at your next appointment.',
    actions: ['Focus on the lower-scoring areas', 'Aim for 3+ months of weight stability', 'Review protein targets with your team', 'Ask about dose reduction timeline'],
  };
  if (score < 80) return {
    level: 'discuss',
    label: 'Discuss with Doctor',
    color: '#3b82f6',
    badgeClass: 'badge-blue',
    message: 'Your score indicates you\'re approaching readiness. This is worth a detailed conversation with Dr. Lindström at your next appointment. A supervised taper — with a clear monitoring plan — may be appropriate.',
    actions: ['Book a dedicated discontinuation consultation', 'Prepare your question list', 'Review your maintenance plan', 'Plan weekly monitoring post-taper'],
  };
  return {
    level: 'ready',
    label: 'Strong Readiness',
    color: '#C4A265',
    badgeClass: 'badge-green',
    message: 'Excellent work. Your score suggests strong foundations for a supervised discontinuation. This doesn\'t mean it\'s definitely the right time — your doctor will evaluate full clinical context — but you\'re well-positioned for a conversation.',
    actions: ['Schedule a discontinuation planning appointment', 'Prepare a post-medication monitoring plan', 'Review maintenance protocol', 'Discuss relapse warning signs with your team'],
  };
};

export default function Readiness({ lang }: Props) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = 100;
  const rec = getRecommendation(totalScore);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(a => ({ ...a, [questionId]: value }));
  };

  const canProgress = answers[questions[current]?.id] !== undefined;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {l('Discontinuation Readiness Score', 'Lõpetamise Valmisoleku Skoor', lang)}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {l('Evaluate your readiness to safely reduce or stop GLP-1 medication', 'Hinda oma valmisolekut GLP-1 ravimi vähendamiseks või lõpetamiseks', lang)}
        </p>
      </div>

      {step === 'intro' && (
        <div>
          <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Info size={20} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {l('What is this assessment?', 'Mis on see hindamine?', lang)}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  GLP-1 medications (semaglutide, tirzepatide) are powerful tools — but they work best when paired with lasting lifestyle changes. This 7-question assessment evaluates whether your habits, stability, and readiness support a successful transition off medication without regaining weight.
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
                  ⚠️ This is a clinical support tool — not a medical recommendation. All discontinuation decisions are made with your Élan physician.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Questions', value: '7', sub: 'Evidence-based factors' },
              { label: 'Max Score', value: '100', sub: 'Composite readiness score' },
              { label: 'Time', value: '~3 min', sub: 'Quick self-assessment' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--teal-light)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" style={{ fontSize: 15, padding: '12px 24px' }} onClick={() => setStep('quiz')}>
            {l('Start Assessment', 'Alusta Hindamist', lang)} <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div>
          {/* Progress */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              <span>Question {current + 1} of {questions.length}</span>
              <span>{questions[current].category}</span>
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), var(--emerald))', borderRadius: 2, transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(196,162,101,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={18} style={{ color: 'var(--teal-light)' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--teal-light)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {questions[current].category}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {questions[current].question}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {questions[current].options.map(opt => {
                const selected = answers[questions[current].id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(questions[current].id, opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 10, border: '1px solid',
                      borderColor: selected ? 'var(--teal)' : 'var(--border)',
                      background: selected ? 'rgba(196,162,101,0.1)' : 'var(--bg-primary)',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: '2px solid', borderColor: selected ? 'var(--teal)' : 'var(--border)',
                      background: selected ? 'var(--teal)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {opt.label}
                    </span>
                    {selected && <CheckCircle2 size={14} style={{ color: 'var(--teal-light)' }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Info size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{questions[current].info}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => { current === 0 ? setStep('intro') : setCurrent(c => c - 1); }} disabled={false}>
              <ChevronLeft size={14} /> {l('Back', 'Tagasi', lang)}
            </button>
            {current < questions.length - 1 ? (
              <button className="btn btn-primary" disabled={!canProgress} onClick={() => setCurrent(c => c + 1)}
                style={{ opacity: canProgress ? 1 : 0.4, cursor: canProgress ? 'pointer' : 'not-allowed' }}>
                {l('Next', 'Edasi', lang)} <ChevronRight size={14} />
              </button>
            ) : (
              <button className="btn btn-primary" disabled={!canProgress} onClick={() => setStep('result')}
                style={{ opacity: canProgress ? 1 : 0.4, cursor: canProgress ? 'pointer' : 'not-allowed' }}>
                {l('See Results', 'Vaata Tulemusi', lang)} <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'result' && (
        <div>
          {/* Score card */}
          <div className="card" style={{ textAlign: 'center', marginBottom: 20, borderColor: `${rec.color}33`, background: `${rec.color}08` }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              {l('Your Readiness Score', 'Sinu Valmisoleku Skoor', lang)}
            </div>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle cx="70" cy="70" r="60" fill="none" stroke={rec.color} strokeWidth="10"
                  strokeDasharray={`${(totalScore / maxScore) * 377} 377`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: rec.color, lineHeight: 1 }}>{totalScore}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ 100</div>
              </div>
            </div>
            <div>
              <span className={`badge ${rec.badgeClass}`} style={{ fontSize: 14, padding: '6px 16px' }}>{rec.label}</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              {l('Recommendation', 'Soovitus', lang)}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              {rec.message}
            </p>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {l('Suggested Next Steps', 'Soovituslikud Järgmised Sammud', lang)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rec.actions.map((action, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={15} style={{ color: rec.color, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
              {l('Score Breakdown', 'Tulemuste Jaotus', lang)}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions.map(q => {
                const score = answers[q.id] ?? 0;
                const pct = (score / q.maxPoints) * 100;
                const color = pct < 40 ? '#ef4444' : pct < 70 ? '#f59e0b' : '#C4A265';
                return (
                  <div key={q.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{q.category}</span>
                      <span style={{ color: color, fontWeight: 600 }}>{score}/{q.maxPoints}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => { setStep('intro'); setAnswers({}); setCurrent(0); }}>
              {l('Retake Assessment', 'Tee Uuesti', lang)}
            </button>
            <button className="btn btn-primary">
              <AlertCircle size={14} />
              {l('Share with Dr. Lindström', 'Jaga dr. Lindströmiga', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
