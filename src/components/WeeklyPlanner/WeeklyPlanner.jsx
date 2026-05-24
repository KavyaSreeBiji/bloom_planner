// src/components/WeeklyPlanner/WeeklyPlanner.jsx
import { useState, useEffect } from 'react'
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight, Heart, Flower2, Plus, Trash2 } from 'lucide-react'
import { useWeeklyPlan } from '../../hooks/useFirestore'
import { useAuth } from '../../context/AuthContext'
import { useIsMobile } from '../../hooks/useIsMobile'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAY_KEYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

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

export default function WeeklyPlanner() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [baseDate, setBaseDate] = useState(new Date())
  const weekKey = getWeekKey(baseDate)
  const { plan, loading, save } = useWeeklyPlan(user?.uid, weekKey)
  const [local, setLocal] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (plan) setLocal(JSON.parse(JSON.stringify(plan))) }, [plan])

  if (loading || !local) return <LoadingSpinner />

  function updateTask(day, idx, value) {
    setLocal(p => {
      const tasks = { ...p.tasks, [day]: p.tasks[day].map((v, i) => i === idx ? value : v) }
      return { ...p, tasks }
    })
  }

  function updatePriority(idx, value) {
    setLocal(p => {
      const arr = [...p.topPriorities]
      arr[idx] = value
      return { ...p, topPriorities: arr }
    })
  }

  function addPriority() {
    setLocal(p => ({ ...p, topPriorities: [...p.topPriorities, ''] }))
  }

  function removePriority(idx) {
    setLocal(p => {
      const arr = [...p.topPriorities]
      arr.splice(idx, 1)
      return { ...p, topPriorities: arr }
    })
  }

  async function handleSave() {
    setSaving(true)
    await save(local)
    setSaving(false)
  }

  return (
    <div style={styles.page} className="fade-up">
      {/* Header */}
      <div style={styles.hero}>
        <div style={styles.heroTop}>
          <div>
            <p style={styles.heroLabel}>✦ weekly planner ✦</p>
            <h1 style={styles.heroTitle}>WEEKLY PLANNER</h1>
            <p style={styles.heroSub}>Plan your week. Stay organized. Get things done! <Heart size={12} fill="var(--blush-mid)" stroke="none" style={{display:'inline',verticalAlign:'middle'}} /></p>
          </div>
          <div style={styles.weekNav}>
            <button className="btn-ghost" onClick={() => setBaseDate(d => subWeeks(d, 1))}>
              <ChevronLeft size={14} />
            </button>
            <span style={styles.weekLabel}>{getWeekLabel(baseDate)}</span>
            <button className="btn-ghost" onClick={() => setBaseDate(d => addWeeks(d, 1))}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Top priorities + Goals */}
        <div style={{ ...styles.topRow, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
          <div style={styles.topCard} className="card">
            <h3 style={styles.sectionTitle}>✦ TOP PRIORITIES</h3>
            {local.topPriorities.map((p, i) => (
              <div key={i} style={styles.priorityRow}>
                <span style={styles.priorityNum}>{i+1}.</span>
                <input
                  className="input-field"
                  style={{ background: 'transparent', border: 'none', borderBottom: '1.5px solid var(--border)', borderRadius: 0, padding: '4px 0', fontSize: 13 }}
                  value={p}
                  onChange={e => updatePriority(i, e.target.value)}
                  placeholder={`Priority ${i+1}`}
                />
                <button
                  className="btn-ghost"
                  style={{ padding: 4, border: 'none', minWidth: 'auto' }}
                  onClick={() => removePriority(i)}
                  title="Remove Priority"
                >
                  <Trash2 size={12} color="var(--brown-soft)" />
                </button>
                <Heart size={12} fill="var(--blush-mid)" stroke="none" />
              </div>
            ))}
            <button className="btn-ghost" onClick={addPriority} style={{ fontSize: 12, padding: '4px 8px', marginTop: 4 }}>
              <Plus size={12} /> Add Priority
            </button>
          </div>
          <div style={styles.topCard} className="card">
            <h3 style={styles.sectionTitle}>✦ GOALS OF THE WEEK</h3>
            <textarea
              style={{ ...styles.textarea, minHeight: 90 }}
              value={local.goals}
              onChange={e => setLocal(p => ({...p, goals: e.target.value}))}
              placeholder="What do you want to achieve this week?"
            />
            <Heart size={12} fill="var(--blush-mid)" stroke="none" style={{ float:'right' }} />
          </div>
        </div>
      </div>

      {/* Day grids */}
      <div style={{ ...styles.daysGrid, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4, 1fr)' }}>
        {DAYS.map((day, di) => (
          <div key={day} style={{ ...styles.dayCard, ...(di >= 5 ? styles.dayCardWeekend : {}) }} className="card">
            <div style={{
              ...styles.dayHeader,
              background: di >= 5 ? 'var(--blush)' : di >= 4 ? 'var(--blush-light)' : 'var(--cream-deep)'
            }}>
              {day.toUpperCase()}
            </div>
            <div style={styles.dayBody}>
              {local.tasks[DAY_KEYS[di]].map((task, ti) => (
                <div key={ti} style={styles.taskRow}>
                  <div style={styles.bullet} />
                  <input
                    style={styles.taskInput}
                    value={task}
                    onChange={e => updateTask(DAY_KEYS[di], ti, e.target.value)}
                    placeholder="..."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notes box */}
        <div style={styles.dayCard} className="card">
          <div style={{ ...styles.dayHeader, background: 'var(--cream-deep)' }}>NOTES</div>
          <div style={styles.dayBody}>
            <textarea
              style={{ ...styles.textarea, minHeight: 100, width: '100%' }}
              value={local.notesIdeas || ''}
              onChange={e => setLocal(p => ({...p, notesIdeas: e.target.value}))}
              placeholder="Notes & ideas..."
            />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div style={styles.bottomRow}>
        <div style={{ ...styles.topCard, flex: 1 }} className="card">
          <h3 style={styles.sectionTitle}>DON'T FORGET</h3>
          <textarea
            style={{ ...styles.textarea, minHeight: 70, width: '100%' }}
            value={local.dontForget || ''}
            onChange={e => setLocal(p => ({...p, dontForget: e.target.value}))}
            placeholder="Reminders..."
          />
          <Heart size={12} fill="var(--blush-mid)" stroke="none" style={{ float:'right' }} />
        </div>
        <div style={{ ...styles.topCard, flex: 1 }} className="card">
          <h3 style={styles.sectionTitle}>NOTES & IDEAS</h3>
          <textarea
            style={{ ...styles.textarea, minHeight: 70, width: '100%' }}
            value={local.notesBottom || ''}
            onChange={e => setLocal(p => ({...p, notesBottom: e.target.value}))}
            placeholder="Any other thoughts..."
          />
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 12 }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Locking it in...' : 'Lock it in!'}
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
  page: { maxWidth: 960, margin: '0 auto', padding: '24px 16px 40px' },
  hero: { marginBottom: 20 },
  heroTop: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:16 },
  heroLabel: { fontSize: 11, letterSpacing:'0.12em', color:'var(--brown-soft)', textTransform:'uppercase', marginBottom:4 },
  heroTitle: { fontFamily:'var(--font-display)', fontSize: 32, fontWeight:700, color:'var(--brown-dark)', letterSpacing:'-0.01em' },
  heroSub: { fontSize: 12, color:'var(--brown-soft)', marginTop:4 },
  weekNav: { display:'flex', alignItems:'center', gap:8 },
  weekLabel: { fontSize: 13, color:'var(--brown-mid)', fontWeight:500, minWidth:160, textAlign:'center' },
  topRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:8 },
  topCard: { padding:16 },
  sectionTitle: { fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--brown-soft)', marginBottom:12, fontFamily:'var(--font-body)', fontWeight:600 },
  priorityRow: { display:'flex', alignItems:'center', gap:8, marginBottom:8 },
  priorityNum: { fontSize:13, color:'var(--brown-mid)', fontWeight:500, minWidth:14 },
  daysGrid: { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:12 },
  dayCard: { overflow:'hidden', padding:0 },
  dayCardWeekend: {},
  dayHeader: { padding:'9px 12px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'var(--brown-dark)', fontFamily:'var(--font-body)' },
  dayBody: { padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 },
  taskRow: { display:'flex', alignItems:'center', gap:7 },
  bullet: { width:6, height:6, borderRadius:'50%', border:'1.5px solid var(--blush-mid)', flexShrink:0 },
  taskInput: { width:'100%', border:'none', background:'transparent', fontSize:12, color:'var(--brown-dark)', fontFamily:'var(--font-body)', outline:'none', borderBottom:'1px solid var(--border-soft)', paddingBottom:2 },
  textarea: { width:'100%', resize:'vertical', border:'none', background:'transparent', fontFamily:'var(--font-body)', fontSize:13, color:'var(--brown-dark)', outline:'none', lineHeight:1.7 },
  bottomRow: { display:'flex', gap:12 },
}
