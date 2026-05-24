// src/components/HabitTracker/HabitTracker.jsx
import { useState, useEffect } from 'react'
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2, Star, Pencil, Check, X, CheckSquare, Calendar, Flame, Trophy, TrendingUp, Droplet, Dumbbell, Sprout, BookOpen, Apple, Ban, Moon, ClipboardList, Lightbulb, Heart, Sparkles, Flower2, Code, GraduationCap, Music, Palette, Wallet, Utensils } from 'lucide-react'
import { useHabitTracker, DEFAULT_HABITS } from '../../hooks/useFirestore'
import { useAuth } from '../../context/AuthContext'
import { useIsMobile } from '../../hooks/useIsMobile'

function getHabitIcon(id, label) {
  const text = (label || '').toLowerCase();
  if (text.includes('water') || text.includes('drink') || text.includes('hydrat')) return Droplet;
  if (text.includes('exercis') || text.includes('gym') || text.includes('workout') || text.includes('run') || text.includes('walk') || text.includes('fit') || text.includes('sport') || text.includes('move') || text.includes('train') || text.includes('yoga')) return Dumbbell;
  if (text.includes('meditat') || text.includes('breathe') || text.includes('mindful') || text.includes('calm') || text.includes('zen')) return Sprout;
  if (text.includes('code') || text.includes('programm') || text.includes('dev')) return Code;
  if (text.includes('learn') || text.includes('skill') || text.includes('study') || text.includes('class') || text.includes('course')) return GraduationCap;
  if (text.includes('read') || text.includes('book') || text.includes('novel')) return BookOpen;
  if (text.includes('music') || text.includes('guitar') || text.includes('piano') || text.includes('sing') || text.includes('instrument')) return Music;
  if (text.includes('art') || text.includes('draw') || text.includes('paint') || text.includes('sketch')) return Palette;
  if (text.includes('money') || text.includes('save') || text.includes('budget') || text.includes('financ')) return Wallet;
  if (text.includes('cook') || text.includes('bake') || text.includes('meal')) return Utensils;
  if (text.includes('eat') || text.includes('food') || text.includes('healthy') || text.includes('diet') || text.includes('salad') || text.includes('fruit') || text.includes('veg')) return Apple;
  if (text.includes('sugar') || text.includes('junk') || text.includes('sweet') || text.includes('candy') || text.includes('no ') || text.includes('bad') || text.includes('quit')) return Ban;
  if (text.includes('sleep') || text.includes('bed') || text.includes('night') || text.includes('early') || text.includes('rest')) return Moon;
  if (text.includes('plan') || text.includes('schedule') || text.includes('todo') || text.includes('organiz') || text.includes('list') || text.includes('day')) return ClipboardList;
  if (text.includes('journal') || text.includes('gratitude') || text.includes('diary') || text.includes('reflect') || text.includes('write')) return Heart;
  if (text.includes('skin') || text.includes('care') || text.includes('hair') || text.includes('beauty') || text.includes('mask') || text.includes('shower') || text.includes('bath')) return Flower2;
  if (text.includes('clean') || text.includes('tidy') || text.includes('wash') || text.includes('organi')) return Sparkles;
  if (text.includes('idea') || text.includes('create') || text.includes('innovat')) return Lightbulb;
  return Flower2;
}

function getHabitParts(label) {
  if (!label) return { icon: '⭐', text: '' };
  // Regex to detect if label starts with an emoji
  const emojiRegex = /^([\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]|\uD83E[\uDD00-\uDFFF]|[\u2600-\u27BF])/;
  const match = label.match(emojiRegex);
  if (match) {
    const icon = match[0];
    const text = label.substring(icon.length).trim();
    return { icon, text };
  }
  return { icon: '⭐', text: label };
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun']

function getWeekKey(date) {
  const mon = startOfWeek(date, { weekStartsOn: 1 })
  return format(mon, 'yyyy-MM-dd')
}
function getWeekLabel(date) {
  const mon = startOfWeek(date, { weekStartsOn: 1 })
  const sun = addWeeks(mon, 1)
  sun.setDate(sun.getDate() - 1)
  return `${format(mon, 'MMM d')} – ${format(sun, 'MMM d, yyyy')}`
}

function pct(checks, days = DAY_KEYS) {
  const total = days.length
  const done = days.filter(d => checks[d]).length
  return total ? Math.round((done / total) * 100) : 0
}

export default function HabitTracker() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [baseDate, setBaseDate] = useState(new Date())
  const weekKey = getWeekKey(baseDate)
  const { data, loading, save } = useHabitTracker(user?.uid, weekKey)
  const [local, setLocal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [newHabit, setNewHabit] = useState('')
  const [addingHabit, setAddingHabit] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => { if (data) setLocal(JSON.parse(JSON.stringify(data))) }, [data])

  function startEdit(habit) {
    setEditingId(habit.id)
    setEditText(habit.label)
  }

  function commitEdit(id) {
    if (!editText.trim()) return
    setLocal(p => {
      const habits = p.habits.map(h => h.id === id ? { ...h, label: editText.trim() } : h)
      return { ...p, habits }
    })
    setEditingId(null)
  }

  if (loading || !local) return <LoadingSpinner />

  function toggle(habitId, day) {
    setLocal(p => ({
      ...p,
      checks: { ...p.checks, [habitId]: { ...p.checks[habitId], [day]: !p.checks[habitId]?.[day] } }
    }))
  }

  function addHabit() {
    if (!newHabit.trim()) return
    const id = 'h_' + Date.now()
    const habit = { id, label: newHabit.trim(), icon: '⭐' }
    const checks = {}
    DAY_KEYS.forEach(d => { checks[d] = false })
    setLocal(p => ({
      ...p,
      habits: [...p.habits, habit],
      checks: { ...p.checks, [id]: checks }
    }))
    setNewHabit('')
    setAddingHabit(false)
  }

  function removeHabit(id) {
    setLocal(p => {
      const habits = p.habits.filter(h => h.id !== id)
      const checks = { ...p.checks }
      delete checks[id]
      return { ...p, habits, checks }
    })
  }

  async function handleSave() {
    setSaving(true)
    await save(local)
    setSaving(false)
  }

  // Stats
  const totalHabits = local.habits.length
  const allChecks = Object.values(local.checks).flatMap(d => Object.values(d))
  const totalCheckins = allChecks.filter(Boolean).length
  const maxPossible = totalHabits * 7
  const overallPct = maxPossible ? Math.round((totalCheckins / maxPossible) * 100) : 0

  let bestStreak = 0
  for (let h of local.habits) {
    let streak = 0, max = 0
    DAY_KEYS.forEach(d => {
      if (local.checks[h.id]?.[d]) { streak++; max = Math.max(max, streak) }
      else streak = 0
    })
    bestStreak = Math.max(bestStreak, max)
  }

  return (
    <div style={styles.page} className="fade-up">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleBlock}>
          <p style={styles.heroLabel}>✦ Habits ✦</p>
          <h1 style={styles.mainTitle}>HABIT TRACKER</h1>
          <p style={styles.quote}>"Small habits, big changes." <span style={{ color:'var(--blush-mid)'}}>♡</span></p>
        </div>

        <div style={styles.rightMeta}>
          <div style={styles.metaCard} className="card">
            <p style={styles.metaLabel}>WEEK OF</p>
            <div style={styles.weekNav}>
              <button className="btn-ghost" style={{padding:'4px 8px'}} onClick={() => setBaseDate(d => subWeeks(d, 1))}><ChevronLeft size={13} /></button>
              <span style={styles.weekLabel}>{getWeekLabel(baseDate)}</span>
              <button className="btn-ghost" style={{padding:'4px 8px'}} onClick={() => setBaseDate(d => addWeeks(d, 1))}><ChevronRight size={13} /></button>
            </div>
          </div>
          <div style={styles.focusCard} className="card">
            <p style={styles.metaLabel}>FOCUS</p>
            <p style={styles.focusText}>Be consistent,<br/>not perfect.</p>
            <Sparkles size={12} fill="var(--blush-mid)" stroke="none" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { icon: CheckSquare, label:'TOTAL HABITS', value: totalHabits },
          { icon: Calendar, label:'WEEK', value: `${overallPct}%` },
          { icon: Flame, label:'BEST STREAK', value: `${bestStreak} days` },
          { icon: Trophy, label:'CHECK-INS', value: `${totalCheckins} / ${maxPossible}` },
          { icon: TrendingUp, label:'PROGRESS', value: `${overallPct}%` },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} style={styles.statItem}>
              <Icon size={16} style={{ color: 'var(--terracotta)', marginBottom: 4 }} />
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          )
        })}
      </div>

      {/* Habit Table */}
      <div style={styles.tableWrap} className="card">
        <div style={styles.tableHeader}>
          <div style={{ ...styles.habitCol, minWidth: isMobile ? 100 : 160, fontWeight:600, color:'var(--brown-mid)', fontSize:11, letterSpacing:'0.08em' }}>HABIT ✦</div>
          {DAYS.map(d => (
            <div key={d} style={{ ...styles.dayCol, minWidth: isMobile ? 24 : 36, fontWeight:600, color:'var(--brown-mid)', fontSize:11, letterSpacing:'0.05em' }}>{isMobile ? d.charAt(0) : d.toUpperCase()}</div>
          ))}
          <div style={{ ...styles.progressCol, minWidth: isMobile ? 45 : 60, fontWeight:600, color:'var(--brown-mid)', fontSize:11, letterSpacing:'0.05em' }}>{isMobile ? '%' : 'WEEKLY'}</div>
        </div>

        {local.habits.map((habit, idx) => {
          const habitPct = pct(local.checks[habit.id] || {})
          const { icon, text } = getHabitParts(habit.label)
          const isEditing = editingId === habit.id

          return (
            <div key={habit.id} style={{ ...styles.tableRow, background: idx % 2 === 0 ? 'transparent' : 'rgba(245,237,230,0.4)', padding: isMobile ? '8px 6px' : '9px 14px' }}>
              <div style={{ ...styles.habitCol, minWidth: isMobile ? 100 : 160 }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center' }}>
                    <input
                      style={styles.editInput}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit(habit.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                    />
                    <button style={styles.iconBtn} onClick={() => commitEdit(habit.id)}><Check size={11} /></button>
                    <button style={styles.iconBtn} onClick={() => setEditingId(null)}><X size={11} /></button>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const HabitIcon = getHabitIcon(habit.id, habit.label);
                      return <HabitIcon size={14} style={{ color: 'var(--blush-mid)', marginRight: 8, flexShrink: 0 }} />;
                    })()}
                    <span style={styles.habitLabel}>{text}</span>
                    <div style={styles.actionBtns}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => startEdit(habit)}
                        title="Edit Habit"
                      ><Pencil size={11} /></button>
                      <button
                        style={styles.actionBtn}
                        onClick={() => removeHabit(habit.id)}
                        title="Delete Habit"
                      ><Trash2 size={11} /></button>
                    </div>
                  </>
                )}
              </div>
              {DAY_KEYS.map(day => (
                <div key={day} style={{ ...styles.dayCol, minWidth: isMobile ? 24 : 36 }}>
                  <div
                    className={`check-box ${local.checks[habit.id]?.[day] ? 'checked' : ''}`}
                    onClick={() => toggle(habit.id, day)}
                  />
                </div>
              ))}
              <div style={{ ...styles.progressCol, minWidth: isMobile ? 45 : 60, fontSize:12, color:'var(--terracotta)', fontWeight:500 }}>
                <div style={styles.miniBarWrap}>
                  <div style={{ ...styles.miniBar, width: `${habitPct}%` }} />
                </div>
                {habitPct}%
              </div>
            </div>
          )
        })}

        {/* Add habit row */}
        {addingHabit ? (
          <div style={styles.addRow}>
            <input
              className="input-field"
              style={{ flex:1, fontSize:13 }}
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              placeholder="e.g. 🚶 Evening walk"
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              autoFocus
            />
            <button className="btn-primary" onClick={addHabit} style={{ padding:'8px 16px', fontSize:13 }}>Add</button>
            <button className="btn-ghost" onClick={() => setAddingHabit(false)} style={{ padding:'8px 14px', fontSize:13 }}>Cancel</button>
          </div>
        ) : (
          <div style={styles.addRow}>
            <button className="btn-ghost" onClick={() => setAddingHabit(true)} style={{ fontSize:13 }}>
              <Plus size={14} /> Add Habit
            </button>
          </div>
        )}
      </div>

      {/* Bottom: Notes, Achieved, Reflection */}
      <div style={{ ...styles.bottomGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
        <div style={styles.bottomCard} className="card">
          <h3 style={styles.sectionTitle}>NOTES ✦</h3>
          <textarea
            style={styles.textarea}
            value={local.notes || ''}
            onChange={e => setLocal(p => ({...p, notes: e.target.value}))}
            placeholder="Notes for the week..."
          />
        </div>

        <div style={styles.bottomCard} className="card">
          <h3 style={styles.sectionTitle}>THIS WEEK I ACHIEVED ✦</h3>
          {local.achieved.map((v, i) => (
            <div key={i} style={styles.achieveRow}>
              <div style={styles.achieveCheck} />
              <input
                style={styles.achieveInput}
                value={v}
                onChange={e => {
                  const arr = [...local.achieved]; arr[i] = e.target.value
                  setLocal(p => ({...p, achieved: arr}))
                }}
                placeholder={`Achievement ${i+1}`}
              />
            </div>
          ))}
        </div>

        <div style={styles.bottomCard} className="card">
          <h3 style={styles.sectionTitle}>REFLECTION ✦</h3>
          {[
            { key:'well', label:'What went well?' },
            { key:'improve', label:'What can I improve?' },
            { key:'focus', label:'What will I focus on next week?' },
          ].map(r => (
            <div key={r.key} style={{ marginBottom:10 }}>
              <p style={{ fontSize:11, color:'var(--brown-soft)', marginBottom:4 }}>{r.label}</p>
              <textarea
                style={{ ...styles.textarea, minHeight:38 }}
                value={local.reflection[r.key] || ''}
                onChange={e => setLocal(p => ({...p, reflection: {...p.reflection, [r.key]: e.target.value}}))}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Locking it in...' : 'Lock in my habits!'}
        </button>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300 }}>
      <Flower2 size={28} style={{ color: 'var(--blush-mid)', animation: 'spin 1.2s linear infinite' }} />
    </div>
  )
}

const styles = {
  page: { maxWidth: 960, margin:'0 auto', padding:'24px 16px 40px' },
  header: { display:'flex', gap:16, justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap' },
  titleBlock: {},
  heroLabel: { fontSize: 11, letterSpacing:'0.12em', color:'var(--brown-soft)', textTransform:'uppercase', marginBottom:4 },
  mainTitle: { fontFamily:'var(--font-display)', fontSize: 32, fontWeight:700, color:'var(--brown-dark)', letterSpacing:'-0.01em' },
  quote: { fontSize:12, color:'var(--brown-soft)', fontStyle:'italic', marginTop:6 },
  rightMeta: { display:'flex', gap:10, flexWrap:'wrap' },
  metaCard: { padding:'12px 16px', minWidth:140 },
  focusCard: { padding:'12px 16px', minWidth:120, textAlign:'center' },
  metaLabel: { fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--brown-soft)', marginBottom:6 },
  weekNav: { display:'flex', alignItems:'center', gap:6 },
  weekLabel: { fontSize:12, color:'var(--brown-mid)', minWidth:130, textAlign:'center' },
  focusText: { fontSize:13, color:'var(--brown-mid)', fontStyle:'italic', lineHeight:1.5, marginBottom:4 },
  statsRow: { display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' },
  statItem: {
    flex:1, minWidth:100, display:'flex', flexDirection:'column', alignItems:'center',
    padding:'10px 8px', background:'var(--card-bg)', border:'1.5px solid var(--border-soft)',
    borderRadius:'var(--radius-md)',
  },
  statIcon: { fontSize:18, marginBottom:4 },
  statValue: { fontSize:15, fontWeight:700, color:'var(--brown-dark)', marginBottom:2 },
  statLabel: { fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--brown-soft)', textAlign:'center' },
  tableWrap: { overflowX:'hidden', marginBottom:14 },
  tableHeader: { display:'flex', padding:'10px 14px', borderBottom:'1.5px solid var(--border-soft)' },
  tableRow: { display:'flex', alignItems:'center', padding:'9px 14px', borderBottom:'1px solid var(--border-soft)' },
  habitCol: { flex:2, display:'flex', alignItems:'center', gap:6, minWidth:160 },
  dayCol: { flex:1, display:'flex', justifyContent:'center', minWidth:36 },
  progressCol: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, minWidth:60 },
  habitBullet: { color: 'var(--blush-mid)', fontSize: 13, marginRight: 8, display: 'inline-block', fontWeight: 'bold' },
  habitLabel: { fontSize:13, color:'var(--brown-dark)', flex:1 },
  actionBtns: { display: 'flex', gap: 4, marginLeft: 'auto' },
  actionBtn: { background:'none', border:'none', cursor:'pointer', color:'var(--brown-soft)', padding:2, opacity:0.5 },
  iconBtn: { background:'none', border:'none', cursor:'pointer', color:'var(--brown-mid)', padding:2, display:'flex', alignItems:'center' },
  editInput: { flex: 1, border: '1.5px solid var(--border-soft)', background: 'var(--cream)', borderRadius: 6, padding: '2px 6px', fontSize: 13, outline: 'none', color: 'var(--brown-dark)', fontFamily: 'var(--font-body)' },
  miniBarWrap: { width:'100%', height:4, background:'var(--cream-deep)', borderRadius:99, overflow:'hidden' },
  miniBar: { height:'100%', background:'var(--terracotta)', borderRadius:99, transition:'width 0.4s ease' },
  addRow: { display:'flex', gap:8, padding:'10px 14px', alignItems:'center' },
  bottomGrid: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:12 },
  bottomCard: { padding:16 },
  sectionTitle: { fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--brown-soft)', marginBottom:12, fontWeight:600 },
  noteLine: { height:1, background:'var(--border-soft)', marginBottom:10 },
  textarea: { width:'100%', resize:'vertical', border:'none', background:'transparent', fontFamily:'var(--font-body)', fontSize:13, color:'var(--brown-dark)', outline:'none', lineHeight:1.7, minHeight:60 },
  achieveRow: { display:'flex', alignItems:'center', gap:8, marginBottom:8 },
  achieveCheck: { width:12, height:12, border:'1.5px solid var(--blush-mid)', borderRadius:3, flexShrink:0 },
  achieveInput: { flex:1, border:'none', background:'transparent', fontFamily:'var(--font-body)', fontSize:13, color:'var(--brown-dark)', outline:'none', borderBottom:'1px solid var(--border-soft)', paddingBottom:2 },
}
