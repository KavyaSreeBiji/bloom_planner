// src/components/TodoList/TodoList.jsx
import { useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2, Pencil, Check, X, Flower2 } from 'lucide-react'
import { useTodoList } from '../../hooks/useFirestore'
import { useAuth } from '../../context/AuthContext'

function getDateKey(date) { return format(date, 'yyyy-MM-dd') }
function getDateLabel(date) { return format(date, 'EEEE, MMMM d') }

export default function TodoList() {
  const { user } = useAuth()
  const [baseDate, setBaseDate] = useState(new Date())
  const dateKey = getDateKey(baseDate)
  const { todos, loading, addTodo, toggleTodo, deleteTodo, editTodo } = useTodoList(user?.uid, dateKey)

  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText]   = useState('')

  if (loading) return <LoadingSpinner />

  async function handleAdd(e) {
    e.preventDefault()
    if (!input.trim()) return
    await addTodo(input.trim())
    setInput('')
  }

  function startEdit(todo) {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  async function commitEdit(id) {
    if (editText.trim()) await editTodo(id, editText.trim())
    setEditingId(null)
  }

  const done  = todos.filter(t => t.done)
  const pending = todos.filter(t => !t.done)
  const pct   = todos.length ? Math.round((done.length / todos.length) * 100) : 0

  const isToday = getDateKey(baseDate) === getDateKey(new Date())

  return (
    <div style={styles.page} className="fade-up">
      {/* Title */}
      <div style={styles.titleArea}>
        <p style={styles.labelSmall}>✦ Daily ✦</p>
        <h1 style={styles.scriptTitle}>TO-DO LIST</h1>
        <p style={styles.sub}>"One step at a time."</p>
      </div>

      {/* Date nav */}
      <div style={styles.dateNav}>
        <button className="btn-ghost" onClick={() => setBaseDate(d => subDays(d, 1))}>
          <ChevronLeft size={14} />
        </button>
        <div style={styles.dateBlock}>
          <span style={styles.dateLabel}>{getDateLabel(baseDate)}</span>
          {isToday && <span style={styles.todayBadge}>Today</span>}
        </div>
        <button className="btn-ghost" onClick={() => setBaseDate(d => addDays(d, 1))}>
          <ChevronRight size={14} />
        </button>
        <button className="btn-ghost" onClick={() => setBaseDate(new Date())} style={{ marginLeft:4, fontSize:12 }}>
          Today
        </button>
      </div>

      {/* Progress */}
      {todos.length > 0 && (
        <div style={styles.progressWrap}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width:`${pct}%` }} />
          </div>
          <span style={styles.progressText}>{done.length}/{todos.length} done ✨</span>
        </div>
      )}

      {/* Add input */}
      <form onSubmit={handleAdd} style={styles.addForm}>
        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task... ✦"
          style={{ flex:1 }}
        />
        <button className="btn-primary" type="submit" style={{ padding:'10px 18px' }}>
          <Plus size={16} />
        </button>
      </form>

      {/* Task list */}
      <div style={styles.taskList}>
        {todos.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No tasks yet for today!</p>
            <p style={{ fontSize:12, color:'var(--brown-soft)' }}>Add something above to get started.</p>
          </div>
        )}

        {pending.map((todo, idx) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            idx={idx}
            isEditing={editingId === todo.id}
            editText={editText}
            setEditText={setEditText}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onEdit={() => startEdit(todo)}
            onCommitEdit={() => commitEdit(todo.id)}
            onCancelEdit={() => setEditingId(null)}
          />
        ))}

        {done.length > 0 && (
          <>
            <div style={styles.divider}>
              <span style={styles.dividerText}>✓ Completed ({done.length})</span>
            </div>
            {done.map((todo, idx) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                idx={idx}
                isEditing={false}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onEdit={() => {}}
                done
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function TodoItem({ todo, idx, isEditing, editText, setEditText, onToggle, onDelete, onEdit, onCommitEdit, onCancelEdit, done }) {
  return (
    <div style={{
      ...styles.pill,
      opacity: done ? 0.65 : 1,
      background: done ? 'var(--cream-deep)' : getPillColor(idx),
      animationDelay: `${idx * 0.04}s`,
    }} className="fade-up">

      {/* Checkbox */}
      <div
        style={{
          ...styles.pillCheck,
          border: `2px solid ${done ? 'var(--brown-soft)' : 'rgba(255,255,255,0.6)'}`,
          background: done ? 'rgba(139,94,74,0.2)' : 'rgba(255,255,255,0.3)',
        }}
        onClick={onToggle}
      >
        {done && <Check size={11} color="var(--brown-mid)" strokeWidth={3} />}
      </div>

      {/* Text */}
      {isEditing ? (
        <input
          style={styles.editInput}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter') onCommitEdit(); if(e.key==='Escape') onCancelEdit() }}
          autoFocus
        />
      ) : (
        <span style={{ ...styles.pillText, textDecoration: done ? 'line-through' : 'none' }}>
          {todo.text}
        </span>
      )}

      {/* Actions */}
      <div style={styles.pillActions}>
        {isEditing ? (
          <>
            <button style={styles.iconBtn} onClick={onCommitEdit}><Check size={13} /></button>
            <button style={styles.iconBtn} onClick={onCancelEdit}><X size={13} /></button>
          </>
        ) : (
          <>
            {!done && <button style={styles.iconBtn} onClick={onEdit}><Pencil size={12} /></button>}
            <button style={styles.iconBtn} onClick={onDelete}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  )
}

// Pill colors cycling through the terracotta/salmon palette (from image 1)
function getPillColor(idx) {
  const colors = [
    'var(--salmon)',       // #E8B49A
    '#DCAB94',
    '#D0A28E',
    '#C49988',
    '#B89082',
    '#AC877C',
  ]
  return colors[idx % colors.length]
}

function LoadingSpinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300 }}>
      <Flower2 size={28} style={{ color: 'var(--blush-mid)', animation: 'spin 1.2s linear infinite' }} />
    </div>
  )
}

const styles = {
  page: { maxWidth: 520, margin:'0 auto', padding:'24px 16px 40px' },
  titleArea: { textAlign:'center', marginBottom:20, position:'relative' },
  labelSmall: { fontSize: 11, letterSpacing:'0.12em', color:'var(--brown-soft)', textTransform:'uppercase', marginBottom:4 },
  scriptTitle: { fontFamily:'var(--font-display)', fontSize: 32, fontWeight:700, color:'var(--brown-dark)', letterSpacing:'-0.01em' },
  sub: { fontSize: 12, color:'var(--brown-soft)', fontStyle:'italic', marginTop:4 },
  dateNav: { display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 },
  dateBlock: { display:'flex', alignItems:'center', gap:8 },
  dateLabel: { fontSize:14, fontWeight:500, color:'var(--brown-dark)', minWidth:180, textAlign:'center' },
  todayBadge: {
    background:'var(--blush)', color:'var(--brown-dark)',
    fontSize:10, fontWeight:600, padding:'2px 8px',
    borderRadius:'var(--radius-pill)', letterSpacing:'0.05em',
  },
  progressWrap: { display:'flex', alignItems:'center', gap:10, marginBottom:14 },
  progressBar: { flex:1, height:6, background:'var(--cream-deep)', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:'var(--terracotta)', borderRadius:99, transition:'width 0.4s ease' },
  progressText: { fontSize:12, color:'var(--brown-mid)', whiteSpace:'nowrap', fontWeight:500 },
  addForm: { display:'flex', gap:8, marginBottom:16 },
  taskList: { display:'flex', flexDirection:'column', gap:8 },
  pill: {
    display:'flex', alignItems:'center', gap:10,
    padding:'12px 16px',
    borderRadius:'var(--radius-pill)',
    boxShadow:'0 2px 8px rgba(139,94,74,0.10)',
    transition:'all 0.2s',
  },
  pillCheck: {
    width:22, height:22, borderRadius:6,
    display:'flex', alignItems:'center', justifyContent:'center',
    cursor:'pointer', flexShrink:0, transition:'all 0.15s',
  },
  pillText: { flex:1, fontSize:14, color:'var(--brown-dark)', fontWeight:400 },
  pillActions: { display:'flex', gap:4, opacity:0.7 },
  iconBtn: { background:'none', border:'none', cursor:'pointer', color:'rgba(74,44,32,0.7)', padding:4, borderRadius:4, display:'flex', alignItems:'center' },
  editInput: { flex:1, border:'none', background:'rgba(255,255,255,0.4)', borderRadius:6, padding:'2px 8px', fontSize:14, fontFamily:'var(--font-body)', outline:'none', color:'var(--brown-dark)' },
  divider: { display:'flex', alignItems:'center', gap:10, margin:'8px 0' },
  dividerText: { fontSize:11, color:'var(--brown-soft)', letterSpacing:'0.06em', whiteSpace:'nowrap' },
  empty: { display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'40px 0', textAlign:'center' },
  emptyText: { fontSize:15, color:'var(--brown-mid)', fontStyle:'italic' },
}
