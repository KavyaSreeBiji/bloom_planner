import { Calendar, Sparkles, ListTodo, Clock } from 'lucide-react'
import { auth, signOut } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { id: 'weekly',  label: 'Weekly',  icon: Calendar },
  { id: 'habits',  label: 'Habits',  icon: Sparkles },
  { id: 'todo',    label: 'To-Do',   icon: ListTodo },
  { id: 'history', label: 'History', icon: Clock },
]

export default function Navbar({ active, setActive }) {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'you'

  return (
    <>
      {/* Top bar */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.logo}>✦</span>
          <span style={styles.brandName}>Bloom Planner</span>
        </div>
        <div style={styles.userArea}>
          <span style={styles.greeting}>Hi, {firstName} ✿</span>
          <button
            className="btn-ghost"
            onClick={() => signOut(auth)}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >Sign out</button>
        </div>
      </header>

      {/* Tab bar */}
      <nav style={styles.nav}>
        <div style={styles.tabs}>
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(active === tab.id ? styles.tabActive : {}),
                }}
                onClick={() => setActive(tab.id)}
              >
                <Icon size={14} style={{
                  color: active === tab.id ? 'var(--terracotta)' : 'var(--brown-soft)',
                  transition: 'color 0.2s'
                }} />
                <span style={styles.tabLabel}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px',
    background: 'rgba(250,247,242,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1.5px solid var(--border-soft)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: { fontSize: 16, color: 'var(--terracotta)' },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontSize: 20, fontWeight: 700,
    color: 'var(--terracotta)',
    letterSpacing: '-0.01em',
  },
  userArea: { display: 'flex', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 13, color: 'var(--brown-soft)', fontStyle: 'italic' },
  nav: {
    background: 'var(--cream)',
    borderBottom: '1.5px solid var(--border-soft)',
    padding: '0 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    maxWidth: 800, margin: '0 auto',
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '11px 18px',
    background: 'transparent', border: 'none',
    borderBottom: '2.5px solid transparent',
    color: 'var(--brown-soft)',
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 400,
    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  tabActive: {
    color: 'var(--terracotta)', fontWeight: 500,
    borderBottomColor: 'var(--terracotta)',
  },
  tabEmoji: { fontSize: 15 },
  tabLabel: {},
}
