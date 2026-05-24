// src/App.jsx
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage       from './components/Auth/AuthPage'
import Navbar         from './components/Layout/Navbar'
import WeeklyPlanner  from './components/WeeklyPlanner/WeeklyPlanner'
import HabitTracker   from './components/HabitTracker/HabitTracker'
import TodoList       from './components/TodoList/TodoList'
import History        from './components/History/History'
import { Flower2 }    from 'lucide-react'

function AppShell() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('weekly')
  const [loadingQuote] = useState(() => {
    const quotes = [
      "Bloom where you are planted",
      "Grow at your own pace",
      "Make today beautiful",
      "Rooting for you always",
      "Focus on the good",
      "One step at a time"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  })

  // Still loading auth state
  if (user === undefined) {
    return (
      <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, padding:24 }}>
        <Flower2 size={36} style={{ color:'var(--blush-mid)', animation:'spin 1.2s linear infinite', display:'inline-block' }} />
        <p style={{ fontFamily:'var(--font-script)', fontSize:26, color:'var(--terracotta)', textAlign:'center', maxWidth:320, lineHeight:1.4, margin:0 }}>
          "{loadingQuote}"
        </p>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column' }}>
      <Navbar active={activeTab} setActive={setActiveTab} />
      <main style={{ flex:1, overflowY:'auto' }}>
        {activeTab === 'weekly'  && <WeeklyPlanner />}
        {activeTab === 'habits'  && <HabitTracker />}
        {activeTab === 'todo'    && <TodoList />}
        {activeTab === 'history' && <History />}
      </main>
      <footer style={footerStyle}>
        <span>✿ Bloom Planner — made with love 🌸</span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

const footerStyle = {
  textAlign:'center',
  padding:'12px 16px',
  fontSize:11,
  color:'var(--brown-soft)',
  borderTop:'1.5px solid var(--border-soft)',
  background:'var(--cream)',
  fontStyle:'italic',
  letterSpacing:'0.04em',
}
