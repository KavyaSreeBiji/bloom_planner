import { useState } from 'react'
import { Calendar, Sparkles, ListTodo, Clock, Menu, X } from 'lucide-react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const activeTab = TABS.find(t => t.id === active) || TABS[0]

  return (
    <>
      <header style={styles.header}>
        <div style={styles.leftGroup}>
          <button 
            className="btn-ghost" 
            style={styles.menuButton} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div style={styles.brand}>
            <span style={styles.logo}>✦</span>
            <span style={styles.brandName}>{activeTab.label}</span>
          </div>
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

      {/* Dropdown Menu Overlay */}
      {isMenuOpen && (
        <div style={styles.dropdownOverlay} onClick={() => setIsMenuOpen(false)}>
          <div style={styles.dropdownMenu} onClick={e => e.stopPropagation()}>
            <div style={styles.dropdownHeader}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brown-soft)', fontWeight: 600 }}>Navigation</span>
            </div>
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = active === tab.id
              return (
                <button
                  key={tab.id}
                  style={{
                    ...styles.menuItem,
                    ...(isActive ? styles.menuItemActive : {})
                  }}
                  onClick={() => {
                    setActive(tab.id)
                    setIsMenuOpen(false)
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? 'var(--terracotta)' : 'var(--brown-soft)' }} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
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
  leftGroup: { display: 'flex', alignItems: 'center', gap: 14 },
  menuButton: {
    padding: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--terracotta)',
    marginRight: 4
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
  
  dropdownOverlay: {
    position: 'fixed',
    top: 61, 
    left: 0, right: 0, bottom: 0,
    background: 'rgba(250,247,242,0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 99,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 12,
    left: 24,
    width: 220,
    background: 'var(--cream)',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(120, 100, 90, 0.12)',
    border: '1.5px solid var(--border-soft)',
    padding: '8px 0',
    display: 'flex', flexDirection: 'column'
  },
  dropdownHeader: {
    padding: '12px 20px 8px',
  },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 20px',
    background: 'transparent', border: 'none',
    color: 'var(--brown-soft)',
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s',
    borderLeft: '3px solid transparent',
  },
  menuItemActive: {
    color: 'var(--terracotta)',
    background: 'rgba(209, 138, 124, 0.08)',
    borderLeft: '3px solid var(--terracotta)',
  }
}
