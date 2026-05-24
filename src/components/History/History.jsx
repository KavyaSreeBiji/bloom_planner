// src/components/History/History.jsx
import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { getTodoHistory, getWeeklyHistory } from '../../hooks/useFirestore'
import { useAuth } from '../../context/AuthContext'
import { Calendar, CheckSquare, Clock, Flower2 } from 'lucide-react'

export default function History() {
  const { user } = useAuth()
  const [tab, setTab]           = useState('todos')
  const [todos, setTodos]       = useState([])
  const [weeks, setWeeks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      getTodoHistory(user.uid),
      getWeeklyHistory(user.uid),
    ]).then(([t, w]) => {
      setTodos(t)
      setWeeks(w)
      setLoading(false)
    })
  }, [user])

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300 }}>
      <Flower2 size={28} style={{ color: 'var(--blush-mid)', animation: 'spin 1.2s linear infinite' }} />
    </div>
  )

  return (
    <div style={styles.page} className="fade-up">
      <div style={styles.header}>
        <p style={styles.heroLabel}>✦ History ✦</p>
        <h1 style={styles.title}>HISTORY LOG</h1>
        <p style={styles.sub}>Your journey, saved forever</p>
      </div>

      {/* Sub tabs */}
      <div style={styles.subTabs}>
        <button
          style={{ ...styles.subTab, ...(tab === 'todos' ? styles.subTabActive : {}) }}
          onClick={() => { setTab('todos'); setExpanded(null) }}
        >
          <CheckSquare size={14} /> Daily To-Dos
        </button>
        <button
          style={{ ...styles.subTab, ...(tab === 'weeks' ? styles.subTabActive : {}) }}
          onClick={() => { setTab('weeks'); setExpanded(null) }}
        >
          <Calendar size={14} /> Weekly Plans
        </button>
      </div>

      {tab === 'todos' && (
        <div style={styles.list}>
          {todos.length === 0 && <EmptyState label="No to-do history yet." />}
          {todos.map(entry => {
            const isOpen = expanded === entry.dateKey
            const doneCount = (entry.items || []).filter(i => i.done).length
            const total = (entry.items || []).length
            const dateLabel = (() => {
              try { return format(parseISO(entry.dateKey), 'EEEE, MMMM d yyyy') }
              catch { return entry.dateKey }
            })()
            return (
              <div key={entry.dateKey} className="card" style={styles.entryCard}>
                <div style={styles.entryHeader} onClick={() => setExpanded(isOpen ? null : entry.dateKey)}>
                  <div style={styles.entryLeft}>
                    <span style={styles.entryDate}>{dateLabel}</span>
                    <span style={styles.entryMeta}>{doneCount}/{total} completed</span>
                  </div>
                  <div style={styles.entryRight}>
                    <div style={styles.progressPill}>
                      <div style={{ ...styles.progressFill, width: `${total ? Math.round(doneCount/total*100) : 0}%` }} />
                    </div>
                    <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={styles.entryBody}>
                    {(entry.items || []).length === 0 && <p style={styles.emptySmall}>No tasks.</p>}
                    {(entry.items || []).map(item => (
                      <div key={item.id} style={styles.histItem}>
                        <span style={{ ...styles.histCheck, background: item.done ? 'var(--terracotta)' : 'transparent' }}>
                          {item.done ? '✓' : ''}
                        </span>
                        <span style={{ ...styles.histText, textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.6 : 1 }}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'weeks' && (
        <div style={styles.list}>
          {weeks.length === 0 && <EmptyState label="No weekly plans saved yet." />}
          {weeks.map(entry => {
            const isOpen = expanded === entry.weekKey
            const weekLabel = (() => {
              try {
                const d = parseISO(entry.weekKey)
                return `Week of ${format(d, 'MMM d, yyyy')}`
              } catch { return entry.weekKey }
            })()
            const taskCount = entry.tasks
              ? Object.values(entry.tasks).flat().filter(t => t && t.trim()).length
              : 0
            return (
              <div key={entry.weekKey} className="card" style={styles.entryCard}>
                <div style={styles.entryHeader} onClick={() => setExpanded(isOpen ? null : entry.weekKey)}>
                  <div style={styles.entryLeft}>
                    <span style={styles.entryDate}>{weekLabel}</span>
                    <span style={styles.entryMeta}>{taskCount} tasks planned</span>
                  </div>
                  <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                  <div style={styles.entryBody}>
                    {entry.goals && (
                      <div style={styles.histSection}>
                        <p style={styles.histLabel}>Goals</p>
                        <p style={styles.histValue}>{entry.goals}</p>
                      </div>
                    )}
                    {entry.topPriorities?.some(p => p) && (
                      <div style={styles.histSection}>
                        <p style={styles.histLabel}>Top Priorities</p>
                        {entry.topPriorities.filter(p=>p).map((p,i) => (
                          <p key={i} style={styles.histValue}>{i+1}. {p}</p>
                        ))}
                      </div>
                    )}
                    {entry.tasks && (
                      <div style={styles.histSection}>
                        <p style={styles.histLabel}>Tasks by Day</p>
                        {Object.entries(entry.tasks).map(([day, tasks]) => {
                          const filtered = tasks.filter(t => t && t.trim())
                          if (!filtered.length) return null
                          return (
                            <div key={day} style={{ marginBottom:6 }}>
                              <p style={{ fontSize:11, fontWeight:600, color:'var(--brown-mid)', textTransform:'capitalize', marginBottom:2 }}>{day}</p>
                              {filtered.map((t,i) => <p key={i} style={{ fontSize:13, color:'var(--brown-dark)', paddingLeft:10 }}>• {t}</p>)}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div style={{ textAlign:'center', padding:'48px 0' }}>
      <p style={{ fontSize:14, color:'var(--brown-soft)', marginTop:10, fontStyle:'italic' }}>{label}</p>
      <p style={{ fontSize:12, color:'var(--brown-soft)', marginTop:4 }}>Start planning and it will appear here!</p>
    </div>
  )
}

const styles = {
  page: { maxWidth:700, margin:'0 auto', padding:'24px 16px 40px' },
  header: { marginBottom:24 },
  heroLabel: { fontSize: 11, letterSpacing:'0.12em', color:'var(--brown-soft)', textTransform:'uppercase', marginBottom:4 },
  title: { fontFamily:'var(--font-display)', fontSize: 32, fontWeight:700, color:'var(--brown-dark)', letterSpacing:'-0.01em' },
  sub: { fontSize:13, color:'var(--brown-soft)', marginTop:4 },
  subTabs: { display:'flex', gap:8, marginBottom:20 },
  subTab: {
    display:'flex', alignItems:'center', gap:6,
    padding:'9px 18px', border:'1.5px solid var(--border)',
    borderRadius:'var(--radius-pill)', background:'transparent',
    fontFamily:'var(--font-body)', fontSize:13, color:'var(--brown-soft)',
    cursor:'pointer', transition:'all 0.2s',
  },
  subTabActive: { background:'var(--blush-light)', borderColor:'var(--blush-mid)', color:'var(--brown-dark)', fontWeight:500 },
  list: { display:'flex', flexDirection:'column', gap:10 },
  entryCard: { overflow:'hidden' },
  entryHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', cursor:'pointer' },
  entryLeft: { display:'flex', flexDirection:'column', gap:3 },
  entryDate: { fontSize:14, fontWeight:600, color:'var(--brown-dark)' },
  entryMeta: { fontSize:12, color:'var(--brown-soft)' },
  entryRight: { display:'flex', alignItems:'center', gap:10 },
  progressPill: { width:80, height:6, background:'var(--cream-deep)', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:'var(--terracotta)', borderRadius:99, transition:'width 0.4s' },
  chevron: { fontSize:10, color:'var(--brown-soft)' },
  entryBody: { padding:'0 16px 16px', borderTop:'1px solid var(--border-soft)' },
  histItem: { display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--border-soft)' },
  histCheck: { width:18, height:18, border:'1.5px solid var(--blush-mid)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'white', flexShrink:0 },
  histText: { fontSize:13, color:'var(--brown-dark)' },
  histSection: { marginTop:12 },
  histLabel: { fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--brown-soft)', marginBottom:4 },
  histValue: { fontSize:13, color:'var(--brown-dark)', lineHeight:1.6 },
  emptySmall: { fontSize:13, color:'var(--brown-soft)', fontStyle:'italic', padding:'10px 0' },
}
