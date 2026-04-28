import { Link } from 'react-router-dom';
import '../styles/scheduleCard.css';

export default function ScheduleCard({ schedule, onRefresh }) {
  const startDate = new Date(schedule.start_date).toLocaleDateString('fr-FR');
  const endDate = new Date(schedule.end_date).toLocaleDateString('fr-FR');

  return (
    <div className="schedule-card">
      <div className="schedule-card-header">
        <h3>{schedule.name}</h3>
        <span className={`status status-${schedule.status}`}>
          {schedule.status}
        </span>
      </div>

      <div className="schedule-card-body">
        {schedule.description && (
          <p className="schedule-description">{schedule.description}</p>
        )}

        <div className="schedule-dates">
          <div className="date-item">
            <span className="date-label">Début:</span>
            <span className="date-value">{startDate}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Fin:</span>
            <span className="date-value">{endDate}</span>
          </div>
        </div>

        <div className="schedule-stats">
          <div className="stat">
            <span className="stat-value">{schedule.shifts?.length || 0}</span>
            <span className="stat-name">Astreintes</span>
          </div>
        </div>
      </div>

      <div className="schedule-card-footer">
        <Link
          to={`/schedules/${schedule.id}`}
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-1 px-3 rounded-md transition"
        >
          Voir Détails
        </Link>
      </div>
    </div>
  );
}
