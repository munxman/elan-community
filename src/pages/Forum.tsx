import React, { useState } from 'react';
import { forumPosts } from '../data/mockData';
import { MessageSquare, Heart, Pin, Search, Plus, ThumbsUp, ChevronRight, Filter, Users, Send } from 'lucide-react';

interface Props { lang: 'en' | 'et' }
const l = (en: string, et: string, lang: 'en' | 'et') => lang === 'en' ? en : et;

const categories = ['All', 'General', 'Side Effects', 'Motivation', 'Recipes', 'Training'];

const categoryColors: Record<string, string> = {
  'General': 'badge-gray',
  'Side Effects': 'badge-amber',
  'Motivation': 'badge-teal',
  'Recipes': 'badge-green',
  'Training': 'badge-blue',
};

export default function Forum({ lang }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = forumPosts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.preview.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {l('Patient Community', 'Patsiendikogukond', lang)}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {l('Share experiences, ask questions, support each other', 'Jaga kogemusi, küsi küsimusi, toeta üksteist', lang)}
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />{l('New Post', 'Uus Postitus', lang)}
        </button>
      </div>

      {/* Community stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { value: '148', label: l('Members', 'Liiget', lang) },
          { value: '94%', label: l('Active this month', 'Aktiivsed sel kuul', lang) },
          { value: '312', label: l('Posts', 'Postitust', lang) },
          { value: '4.8★', label: l('Community rating', 'Kogukonna hinnang', lang) },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal-light)', marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 36 }}
            placeholder={l('Search posts...', 'Otsi postitusi...', lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={14} />{l('Filter', 'Filter', lang)}
        </button>
      </div>

      {/* Category tabs */}
      <div className="forum-categories" style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--teal)' : 'var(--border)',
              background: activeCategory === cat ? 'rgba(200,167,126,0.12)' : 'transparent',
              color: activeCategory === cat ? 'var(--teal-light)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(post => (
          <div key={post.id} className="card card-hover" style={{
            borderColor: post.pinned ? 'rgba(200,167,126,0.25)' : 'var(--border)',
            overflow: 'hidden',
          }}>
            <div className="forum-post-row" style={{ display: 'flex', gap: 14 }}>
              {/* Avatar */}
              <div className="forum-avatar" style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(13,148,136,0.6), rgba(8,145,178,0.6))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>
                {post.avatar}
              </div>

              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  {post.pinned && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--teal-light)', fontWeight: 600 }}>
                      <Pin size={11} />{l('Pinned', 'Kinnitatud', lang)}
                    </div>
                  )}
                  <span className={`badge ${categoryColors[post.category] ?? 'badge-gray'}`}>{post.category}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-word' as any }}>by {post.author} · {post.time}</span>
                </div>

                {/* Title */}
                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4, wordBreak: 'break-word' as any }}>
                  {post.title}
                </h4>

                {/* Preview */}
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {post.preview}
                </p>

                {/* Actions row */}
                <div className="forum-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button onClick={e => { e.stopPropagation(); toggleLike(post.id); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: liked.has(post.id) ? '#f87171' : 'var(--text-muted)', fontSize: 12, fontFamily: 'inherit', transition: 'color 0.15s' }}>
                    <Heart size={13} fill={liked.has(post.id) ? '#f87171' : 'none'} />
                    {post.likes + (liked.has(post.id) ? 1 : 0)}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12 }}>
                    <MessageSquare size={13} />
                    {post.replies} {l('replies', 'vastust', lang)}
                  </div>
                  <div style={{ flex: 1 }} />
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--teal)', fontSize: 12, fontFamily: 'inherit' }}>
                    {l('Read more', 'Loe rohkem', lang)} <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accountability Buddy */}
      <div className="card" style={{ marginTop: 20, borderColor: 'rgba(13,148,136,0.25)', background: 'rgba(13,148,136,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Users size={18} style={{ color: 'var(--teal-light)' }} />
          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            {l('Your Accountability Buddy', 'Sinu Vastutuskaaslane', lang)}
          </h4>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(200,167,126,0.6), rgba(13,148,136,0.6))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            KM
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Kadri M.</span>
              <span className="badge badge-green" style={{ fontSize: 10 }}>
                {l('Active today', 'Aktiivne täna', lang)}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
              {l('Matched since Feb 15, 2026 · Week 22 on programme', 'Sobitatud alates 15. veebr 2026 · Nädal 22 programmis', lang)}
            </div>
            <div style={{
              background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '10px 14px', marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)',
              fontStyle: 'italic', lineHeight: 1.5,
            }}>
              "{l('Had a great training session this morning — pushed through even though I didn\'t feel like it. Small wins!', 'Hommikul oli hea treening — surusin läbi, kuigi ei tahtnud. Väikesed võidud!', lang)}"
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 12 }}>
              <Send size={12} />
              {l('Send encouragement', 'Saada julgustust', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Community guidelines */}
      <div className="card" style={{ marginTop: 20, background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>🤝</div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              {l('Community Guidelines', 'Kogukonna Reeglid', lang)}
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {l('This is a private, safe space for Élan Clinic patients. Be kind and supportive. Share experiences, not medical advice. All clinical questions should go to your care team. Your privacy is protected — first name/initial only.', 
                'See on privaatne, turvaline ruum Élan Kliiniku patsientidele. Ole lahke ja toetav. Jaga kogemusi, mitte meditsiinilist nõu. Kõik kliinilised küsimused esita oma meeskonnale. Sinu privaatsus on kaitstud — ainult eesnimi/täht.', lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
