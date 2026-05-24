// src/hooks/useFirestore.js
import { useState, useEffect, useCallback } from 'react'
import {
  db,
  doc, setDoc, getDoc, collection,
  query, orderBy, getDocs, deleteDoc, updateDoc
} from '../firebase'

// ── Weekly Planner ──────────────────────────────────────────────
// Path: users/{uid}/weeklyPlans/{weekKey}
// weekKey = "2024-W22" (ISO week)
export function useWeeklyPlan(uid, weekKey) {
  const [plan, setPlan]     = useState(null)
  const [loading, setLoading] = useState(true)

  const ref = uid && weekKey ? doc(db, 'users', uid, 'weeklyPlans', weekKey) : null

  useEffect(() => {
    if (!ref) return
    setLoading(true)
    getDoc(ref).then(snap => {
      setPlan(snap.exists() ? snap.data() : defaultWeeklyPlan())
      setLoading(false)
    })
  }, [uid, weekKey])

  const save = useCallback(async (data) => {
    if (!ref) return
    await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true })
    setPlan(p => ({ ...p, ...data }))
  }, [ref])

  return { plan, loading, save }
}

function defaultWeeklyPlan() {
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  const tasks = {}
  days.forEach(d => { tasks[d] = ['','','','','',''] })
  return {
    topPriorities: ['','',''],
    goals: '',
    dontForget: '',
    notesIdeas: '',
    tasks,
    updatedAt: Date.now()
  }
}

// ── Habit Tracker ────────────────────────────────────────────────
// Path: users/{uid}/habitWeeks/{weekKey}
export function useHabitTracker(uid, weekKey) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  const ref = uid && weekKey ? doc(db, 'users', uid, 'habitWeeks', weekKey) : null

  useEffect(() => {
    if (!ref) return
    setLoading(true)
    getDoc(ref).then(snap => {
      setData(snap.exists() ? snap.data() : defaultHabitWeek())
      setLoading(false)
    })
  }, [uid, weekKey])

  const save = useCallback(async (updates) => {
    if (!ref) return
    await setDoc(ref, { ...updates, updatedAt: Date.now() }, { merge: true })
    setData(p => ({ ...p, ...updates }))
  }, [ref])

  return { data, loading, save }
}

const DEFAULT_HABITS = [
  { id: 'h1', label: 'Drink Water' },
  { id: 'h2', label: 'Morning Exercise' },
  { id: 'h3', label: 'Meditate' },
  { id: 'h4', label: 'Read' },
  { id: 'h5', label: 'Eat Healthy' },
  { id: 'h6', label: 'No Sugar / Junk Food' },
  { id: 'h7', label: 'Sleep Early' },
  { id: 'h8', label: 'Plan My Day' },
  { id: 'h9', label: 'Learn Something New' },
  { id: 'h10', label: 'Gratitude Journal' },
]

function defaultHabitWeek() {
  const days = ['mon','tue','wed','thu','fri','sat','sun']
  const checks = {}
  DEFAULT_HABITS.forEach(h => {
    checks[h.id] = {}
    days.forEach(d => { checks[h.id][d] = false })
  })
  return {
    habits: DEFAULT_HABITS,
    checks,
    notes: '',
    achieved: ['','','','',''],
    reflection: { well: '', improve: '', focus: '' },
    updatedAt: Date.now()
  }
}

export { DEFAULT_HABITS }

// ── Daily To-Do List ─────────────────────────────────────────────
// Path: users/{uid}/todos/{dateKey}  dateKey = "2024-05-22"
export function useTodoList(uid, dateKey) {
  const [todos, setTodos]   = useState([])
  const [loading, setLoading] = useState(true)

  const ref = uid && dateKey ? doc(db, 'users', uid, 'todos', dateKey) : null

  useEffect(() => {
    if (!ref) return
    setLoading(true)
    getDoc(ref).then(snap => {
      setTodos(snap.exists() ? snap.data().items ?? [] : [])
      setLoading(false)
    })
  }, [uid, dateKey])

  const saveAll = useCallback(async (items) => {
    if (!ref) return
    await setDoc(ref, { items, updatedAt: Date.now() })
    setTodos(items)
  }, [ref])

  const addTodo = useCallback(async (text) => {
    if (!text.trim()) return
    const newItem = { id: Date.now().toString(), text, done: false, createdAt: Date.now() }
    const updated = [...todos, newItem]
    await saveAll(updated)
  }, [todos, saveAll])

  const toggleTodo = useCallback(async (id) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    await saveAll(updated)
  }, [todos, saveAll])

  const deleteTodo = useCallback(async (id) => {
    const updated = todos.filter(t => t.id !== id)
    await saveAll(updated)
  }, [todos, saveAll])

  const editTodo = useCallback(async (id, text) => {
    const updated = todos.map(t => t.id === id ? { ...t, text } : t)
    await saveAll(updated)
  }, [todos, saveAll])

  return { todos, loading, addTodo, toggleTodo, deleteTodo, editTodo }
}

// ── History helpers ───────────────────────────────────────────────
export async function getTodoHistory(uid) {
  const col = collection(db, 'users', uid, 'todos')
  const q = query(col, orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ dateKey: d.id, ...d.data() }))
}

export async function getWeeklyHistory(uid) {
  const col = collection(db, 'users', uid, 'weeklyPlans')
  const q = query(col, orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ weekKey: d.id, ...d.data() }))
}
