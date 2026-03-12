import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const navItems = [
  { to: '/', label: 'Feed' },
  { to: '/profile', label: 'Profile' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/events', label: 'Events' },
  { to: '/research', label: 'Research' },
  { to: '/messages', label: 'Messages' },
  { to: '/notifications', label: 'Notifications' },
]

export default function Layout() {
  const { auth, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          DECP
        </Link>

        <div className="sidebar-user">
          <div className="sidebar-name">{auth?.fullName}</div>
          <div className="sidebar-role">{auth?.role}</div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
          {auth?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <button className="secondary-btn full-width" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}
