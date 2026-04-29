import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../api/authContext'
import { useScheduleStore } from '../store/scheduleStore'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/dashboard.css'

// ── Mini Calendar ──────────────────────────────────────────────────────────────
function MiniCalendar({ schedules }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin',
                      'Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Monday=0

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d)

  const COLORS = ['#3aa85a','#f59e0b','#6366f1','#ef4444','#0ea5e9','#ec4899']

  const getEventsForDay = (day) => {
    if (!day || !schedules?.length) return []
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return schedules.filter(s => {
      const sd = s.start_date?.slice(0,10) || s.date?.slice(0,10) || ''
      const ed = s.end_date?.slice(0,10) || sd
      return sd <= dateStr && dateStr <= ed
    })
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const today = new Date()
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="db-calendar">
      <div className="db-cal-header">
        <button className="db-cal-nav" onClick={prevMonth}>‹</button>
        <span className="db-cal-title">{monthNames[month]} {year}</span>
        <button className="db-cal-nav" onClick={nextMonth}>›</button>
      </div>
      <div className="db-cal-grid">
        {dayNames.map(d => (
          <div key={d} className="db-cal-dayname">{d}</div>
        ))}
        {cells.map((day, i) => {
          const events = getEventsForDay(day)
          return (
            <div key={i} className={`db-cal-cell ${day ? '' : 'empty'} ${isToday(day) ? 'today' : ''}`}>
              {day && <span className="db-cal-day">{day}</span>}
              {events.slice(0,2).map((ev, ei) => (
                <div
                  key={ei}
                  className="db-cal-event"
                  style={{ background: COLORS[ei % COLORS.length] }}
                  title={ev.title || ev.service?.name || 'Astreinte'}
                >
                  {(ev.title || ev.service?.name || 'Astreinte').slice(0,14)}
                </div>
              ))}
              {events.length > 2 && (
                <div className="db-cal-more">+{events.length - 2}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const { schedules, isLoading, fetchWeeklySchedule } = useScheduleStore()

  const [showServicesModal, setShowServicesModal] = useState(false)
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState('')

  useEffect(() => { fetchWeeklySchedule(user?.service_id) }, [user?.service_id])

  const fetchServices = async () => {
    setIsLoadingServices(true)
    setServicesError('')
    try {
      const res = await fetch('/api/services', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch (err) { setServicesError(err.message) }
    finally { setIsLoadingServices(false) }
  }

  // Current & upcoming schedules derived from store
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const currentSchedules = (schedules || []).filter(s => {
    const sd = s.start_date?.slice(0,10) || s.date?.slice(0,10) || ''
    const ed = s.end_date?.slice(0,10)   || sd
    return sd <= todayStr && todayStr <= ed
  })

  const upcomingSchedules = (schedules || []).filter(s => {
    const sd = s.start_date?.slice(0,10) || s.date?.slice(0,10) || ''
    return sd > todayStr
  }).slice(0, 5)

  const roleLabel = {
    user: 'Utilisateur', staff: 'Utilisateur',
    collaborator: 'Collaborateur', secretary: 'Secrétaire',
    admin: 'Administrateur', manager: 'Manager', team_lead: 'Team Lead'
  }[user?.role] || user?.role

  const COLORS = ['#3aa85a','#f59e0b','#6366f1','#ef4444','#0ea5e9']

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="db-page">
      {/* ── Header bar ── */}
      <div className="db-topbar">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Tableau de bord</p>
        </div>
      </div>

      {/* ── Main content: left panel + calendar ── */}
      <div className="db-layout">

        {/* LEFT PANEL */}
        <div className="db-left">

          {/* Stats strip */}
          <div className="db-stats">
            <div className="db-stat-card">
              <div className="db-stat-icon">👤</div>
              <div>
                <div className="db-stat-label">Rôle</div>
                <div className="db-stat-value">{roleLabel}</div>
              </div>
            </div>
            <div className="db-stat-card clickable" onClick={() => { setShowServicesModal(true); fetchServices() }}>
              <div className="db-stat-icon">🏢</div>
              <div>
                <div className="db-stat-label">Service</div>
                <div className="db-stat-value">{user?.service?.name || 'N/A'}</div>
              </div>
            </div>
            <Link to="/schedules" className="db-stat-card clickable" style={{ textDecoration: 'none' }}>
              <div className="db-stat-icon">📅</div>
              <div>
                <div className="db-stat-label">Cette semaine</div>
                <div className="db-stat-value">{schedules?.length || 0}</div>
              </div>
            </Link>
          </div>

          {/* Astreinte Actuelle */}
          <div className="db-panel">
            <h2 className="db-panel-title">Astreinte Actuelle</h2>
            {currentSchedules.length === 0 ? (
              <div className="db-empty">
                <span>🟢</span>
                <p>Aucune astreinte en cours</p>
              </div>
            ) : (
              currentSchedules.map((s, i) => (
                <div key={s.id || i} className="db-astreinte-card">
                  <div className="db-astr-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                    {s.user?.profile_picture
                      ? <img src={s.user.profile_picture} alt={s.user?.name} />
                      : <span>{(s.user?.name || s.title || 'A').charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <div className="db-astr-info">
                    <div className="db-astr-name">{s.user?.name || s.title || 'Astreinte'}</div>
                    <div className="db-astr-sub">
                      {s.service?.name || s.type || ''}{s.team ? ` · ${s.team}` : ''}
                    </div>
                    <span className="db-astr-badge">● EN LIGNE</span>
                  </div>
                  <button className="db-astr-call">📞</button>
                </div>
              ))
            )}
            {currentSchedules.length > 0 && (
              <div className="db-astr-valid">
                Valide jusqu'à {currentSchedules[0]?.end_time?.slice(0,5) || '20h00'}
              </div>
            )}
          </div>

          {/* Prochaines Astreintes */}
          <div className="db-panel">
            <h2 className="db-panel-title">Prochaines Astreintes</h2>
            {upcomingSchedules.length === 0 ? (
              <div className="db-empty"><p>Aucune astreinte planifiée</p></div>
            ) : (
              upcomingSchedules.map((s, i) => (
                <div key={s.id || i} className="db-upcoming-card">
                  <div className="db-astr-avatar sm" style={{ background: COLORS[i % COLORS.length] }}>
                    {s.user?.profile_picture
                      ? <img src={s.user.profile_picture} alt={s.user?.name} />
                      : <span>{(s.user?.name || s.title || 'A').charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <div className="db-astr-info">
                    <div className="db-astr-name">{s.user?.name || s.title || 'Astreinte'}</div>
                    <div className="db-astr-sub">
                      {s.service?.name || ''}{s.team ? ` · ${s.team}` : ''}
                    </div>
                    <span className="db-astr-badge upcoming">● {s.start_date?.slice(0,10) || 'À venir'}</span>
                  </div>
                  <span className="db-upcoming-arrow">›</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Calendar */}
        <div className="db-right">
          <div className="db-panel full">
            <MiniCalendar schedules={schedules} />
          </div>
        </div>
      </div>

      {/* Services Modal */}
      {showServicesModal && (
        <div className="db-modal-overlay" onClick={() => setShowServicesModal(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-header">
              <h2>Tous les services</h2>
              <button onClick={() => setShowServicesModal(false)}>✕</button>
            </div>
            {isLoadingServices ? (
              <div className="db-modal-loading"><div className="spinner" /></div>
            ) : servicesError ? (
              <div className="alert alert-error">{servicesError}</div>
            ) : services.length === 0 ? (
              <p className="db-empty"><span>Aucun service trouvé.</span></p>
            ) : (
              <ul className="db-services-list">
                {services.map(svc => (
                  <li key={svc.id} className="db-service-item">
                    <span className="db-service-name">{svc.name}</span>
                    {svc.description && <span className="db-service-desc">{svc.description}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}