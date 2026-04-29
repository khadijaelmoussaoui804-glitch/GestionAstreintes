import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../api/authContext'
import { useScheduleStore } from '../store/scheduleStore'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/dashboard.css'

const EVENT_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9', '#ec4899', '#8b5cf6', '#14b8a6',
]

function MonthCalendar({ schedules }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('Mois')
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7

  const cells = []
  const prevLast = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: prevLast - i, current: false })
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push({ day: d, current: true })
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7)
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false })

  const getEventsForDay = (day, isCurrent) => {
    if (!isCurrent || !schedules?.length) return []
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return schedules.filter(s => {
      const sd = s.start_date?.slice(0, 10) || s.date?.slice(0, 10) || ''
      const ed = s.end_date?.slice(0, 10) || sd
      return sd <= dateStr && dateStr <= ed
    })
  }

  const today = new Date()
  const isToday = (d, isCurrent) =>
    isCurrent && d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="db-calendar">
      <div className="db-cal-topbar">
        <div className="db-cal-topbar-left">
          <button className="db-cal-nav" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
          <span className="db-cal-month-title">{monthNames[month]} {year}</span>
          <button className="db-cal-nav" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
          <select className="db-cal-team-select">
            <option>Équipe, Usersous, Skilen</option>
            <option>Équipe A</option>
            <option>Équipe B</option>
          </select>
        </div>
        <div className="db-cal-view-tabs">
          {['Mois','Semaine','Jour','Liste'].map(v => (
            <button key={v} className={`db-cal-view-btn ${viewMode === v ? 'active' : ''}`} onClick={() => setViewMode(v)}>{v}</button>
          ))}
        </div>
      </div>

      <div className="db-cal-grid">
        {dayNames.map(d => <div key={d} className="db-cal-dayname">{d}</div>)}
        {cells.map((cell, i) => {
          const events = getEventsForDay(cell.day, cell.current)
          return (
            <div key={i} className={`db-cal-cell ${!cell.current ? 'other-month' : ''} ${isToday(cell.day, cell.current) ? 'today' : ''}`}>
              <span className="db-cal-day">{cell.day}</span>
              {events.slice(0, 3).map((ev, ei) => (
                <div key={ei} className="db-cal-event"
                  style={{ background: EVENT_COLORS[ei % EVENT_COLORS.length] }}
                  title={ev.title || ev.service?.name || 'Astreinte'}>
                  {(ev.title || (ev.service?.name ? `Astreinte - ${ev.service.name}` : 'Astreinte')).slice(0, 20)}
                  {ev.user?.name && <span className="db-cal-event-detail">User: {ev.user.name}</span>}
                </div>
              ))}
              {events.length > 3 && <div className="db-cal-more">+{events.length - 3} autres</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { schedules, isLoading, fetchWeeklySchedule } = useScheduleStore()
  const [showServicesModal, setShowServicesModal] = useState(false)
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState('')

  useEffect(() => { fetchWeeklySchedule(user?.service_id) }, [user?.service_id])

  const fetchServices = async () => {
    setIsLoadingServices(true); setServicesError('')
    try {
      const res = await fetch('/api/services', { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setServices(Array.isArray(data) ? data : data.data || [])
    } catch (err) { setServicesError(err.message) }
    finally { setIsLoadingServices(false) }
  }

  const todayStr = new Date().toISOString().slice(0, 10)
  const currentSchedules = (schedules || []).filter(s => {
    const sd = s.start_date?.slice(0,10) || s.date?.slice(0,10) || ''
    const ed = s.end_date?.slice(0,10) || sd
    return sd <= todayStr && todayStr <= ed
  })
  const upcomingSchedules = (schedules || []).filter(s => {
    const sd = s.start_date?.slice(0,10) || s.date?.slice(0,10) || ''
    return sd > todayStr
  }).slice(0, 5)

  const roleLabel = { user:'Utilisateur', staff:'Utilisateur', collaborator:'Collaborateur', secretary:'Secrétaire', admin:'Administrateur', manager:'Manager', team_lead:'Team Lead' }[user?.role] || user?.role

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="db-page">
      <div className="db-topbar">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Tableau de bord</p>
        </div>
        <button className="db-filter-btn">⚙ FILTRER</button>
      </div>

      <div className="db-layout">
        <div className="db-left">
          <div className="db-panel">
            <h2 className="db-panel-title">Astreinte Actuelle</h2>
            {currentSchedules.length === 0 ? (
              <div className="db-empty"><span>🟢</span><p>Aucune astreinte en cours</p></div>
            ) : currentSchedules.map((s, i) => (
              <div key={s.id || i} className="db-astreinte-card">
                <div className="db-astr-avatar" style={{ background: EVENT_COLORS[i % EVENT_COLORS.length] }}>
                  {s.user?.profile_picture ? <img src={s.user.profile_picture} alt={s.user?.name} /> : <span>{(s.user?.name || 'A').charAt(0).toUpperCase()}</span>}
                </div>
                <div className="db-astr-info">
                  <div className="db-astr-name">{s.user?.name || s.title || 'Astreinte'}</div>
                  <div className="db-astr-sub">({s.service?.name || 'Réseau, Équipe A'})</div>
                  <span className="db-astr-badge">● EN LIGNE</span>
                </div>
                <button className="db-astr-call">📞</button>
              </div>
            ))}
            {currentSchedules.length > 0 && (
              <div className="db-astr-valid">Valide jusqu'à {currentSchedules[0]?.end_time?.slice(0,5) || '20h00'}</div>
            )}
          </div>

          <div className="db-panel">
            <h2 className="db-panel-title">Prochaines Astreintes</h2>
            {upcomingSchedules.length === 0 ? (
              <div className="db-empty"><p>Aucune astreinte planifiée</p></div>
            ) : upcomingSchedules.map((s, i) => (
              <div key={s.id || i} className="db-upcoming-card">
                <div className="db-astr-avatar sm" style={{ background: EVENT_COLORS[i % EVENT_COLORS.length] }}>
                  {s.user?.profile_picture ? <img src={s.user.profile_picture} alt={s.user?.name} /> : <span>{(s.user?.name || 'A').charAt(0).toUpperCase()}</span>}
                </div>
                <div className="db-astr-info">
                  <div className="db-astr-name">{s.user?.name || s.title || 'Astreinte'}</div>
                  <div className="db-astr-sub">{s.service?.name || ''}{s.team ? ` · ${s.team}` : ''}</div>
                  <span className="db-astr-badge upcoming">● {s.start_date?.slice(0,10) || 'À venir'}</span>
                </div>
                <span className="db-upcoming-arrow">›</span>
              </div>
            ))}
          </div>

          <div className="db-stats">
            <div className="db-stat-card">
              <div className="db-stat-icon">👤</div>
              <div><div className="db-stat-label">Rôle</div><div className="db-stat-value">{roleLabel}</div></div>
            </div>
            <div className="db-stat-card clickable" onClick={() => { setShowServicesModal(true); fetchServices() }}>
              <div className="db-stat-icon">🏢</div>
              <div><div className="db-stat-label">Service</div><div className="db-stat-value">{user?.service?.name || 'N/A'}</div></div>
            </div>
            <Link to="/schedules" className="db-stat-card clickable" style={{ textDecoration: 'none' }}>
              <div className="db-stat-icon">📅</div>
              <div><div className="db-stat-label">Cette semaine</div><div className="db-stat-value">{schedules?.length || 0}</div></div>
            </Link>
          </div>
        </div>

        <div className="db-right">
          <div className="db-panel full">
            <MonthCalendar schedules={schedules} />
          </div>
        </div>
      </div>

      {showServicesModal && (
        <div className="db-modal-overlay" onClick={() => setShowServicesModal(false)}>
          <div className="db-modal" onClick={e => e.stopPropagation()}>
            <div className="db-modal-header">
              <h2>Tous les services</h2>
              <button onClick={() => setShowServicesModal(false)}>✕</button>
            </div>
            {isLoadingServices ? <div className="db-modal-loading"><div className="spinner" /></div>
              : servicesError ? <div className="alert alert-error">{servicesError}</div>
              : services.length === 0 ? <p className="db-empty"><span>Aucun service trouvé.</span></p>
              : <ul className="db-services-list">
                  {services.map(svc => (
                    <li key={svc.id} className="db-service-item">
                      <span className="db-service-name">{svc.name}</span>
                      {svc.description && <span className="db-service-desc">{svc.description}</span>}
                    </li>
                  ))}
                </ul>
            }
          </div>
        </div>
      )}
    </div>
  )
}