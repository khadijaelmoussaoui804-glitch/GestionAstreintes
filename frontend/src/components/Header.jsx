import { useState } from 'react';
import { useAuth } from '../api/authContext';
import { useNotificationStore } from '../store/NotificationStore';
import OcpLogo from './OcpLogo';
import '../styles/header.css';

export default function Header() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead } = useNotificationStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <OcpLogo className="header-brand-logo" />
        </div>
        <div className="header-user flex items-center gap-4">
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
                        onClick={() => markRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          {notif.avatar ? (
                            <img src={notif.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {notif.initials || '🔔'}
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-800">{notif.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 leading-snug">{notif.message}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                              {new Date(notif.timestamp).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="user-greeting">
            Bienvenue, {user?.name}!
          </span>
          {user?.profile_picture && (
            <img src={user.profile_picture} alt={user.name} className="user-avatar-header" />
          )}
        </div>
      </div>
    </header>
  );
}
