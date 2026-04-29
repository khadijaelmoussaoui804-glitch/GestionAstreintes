import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/authContext';
import '../styles/sidebar.css';

const OCP_LOGO = "data:image/png;base64,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";

export default function Sidebar() {
  const { user, logout, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({
    profile_picture: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setProfileForm((current) => ({
      ...current,
      profile_picture: user?.profile_picture || '',
    }));
  }, [user?.profile_picture]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError('');
    setProfileMessage('');
    const payload = { profile_picture: profileForm.profile_picture.trim() };
    if (profileForm.password || profileForm.current_password || profileForm.password_confirmation) {
      payload.current_password = profileForm.current_password;
      payload.password = profileForm.password;
      payload.password_confirmation = profileForm.password_confirmation;
    }
    try {
      await updateProfile(payload);
      setProfileMessage('Profil mis à jour.');
      setProfileForm((current) => ({
        ...current,
        current_password: '',
        password: '',
        password_confirmation: '',
      }));
    } catch (err) {
      const message = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()[0]
        : err.response?.data?.message || err.response?.data?.error || 'Mise à jour impossible.';
      setProfileError(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const resizeImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 256;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('Canvas error')); return; }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject(new Error('Image invalide.'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('Lecture impossible.'));
      reader.readAsDataURL(file);
    });

  const saveProfileImage = async (base64) => {
    setIsSavingProfile(true);
    setProfileError('');
    setProfileMessage('');
    try {
      await updateProfile({ profile_picture: base64 });
      setProfileMessage('Image mise à jour.');
    } catch (err) {
      const message = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()[0]
        : err.response?.data?.message || err.response?.data?.error || 'Mise à jour impossible.';
      setProfileError(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await resizeImage(file);
      setProfileForm((f) => ({ ...f, profile_picture: base64 }));
      await saveProfileImage(base64);
    } catch (err) {
      setProfileError(err.message || 'Image invalide.');
      setProfileMessage('');
    } finally {
      e.target.value = '';
    }
  };

  const menuItems = [
    { label: 'Tableau de Bord', path: '/dashboard', icon: '⊞', roles: ['admin', 'manager', 'team_lead', 'staff', 'user'] },
    { label: 'Emplois du Temps', path: '/schedules', icon: '▦', roles: ['admin', 'manager', 'team_lead', 'staff', 'user'] },
    { label: 'Agents', path: '/agents', icon: '⊛', roles: ['admin', 'manager'] },
    { label: 'Indisponibilités', path: '/unavailability', icon: '⊘', roles: ['staff', 'user'] },
    { label: 'Administration', path: '/admin', icon: '⚙', roles: ['admin'] },
  ].filter((item) => item.roles.includes(user?.role));

  const avatarSrc = profileForm.profile_picture || user?.profile_picture;

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header avec logo OCP */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-logo-wrap">
              <img src={OCP_LOGO} alt="OCP" className="sidebar-brand-logo" />
            </div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-ocp">OCP</span>
              <span className="sidebar-brand-title">Gestion des Astreintes</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {/* Divider */}
        <div className="sidebar-divider" />

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {location.pathname === item.path && <span className="menu-active-bar" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="user-info user-profile-trigger"
            onClick={() => {
              setShowProfileEditor((c) => !c);
              setProfileError('');
              setProfileMessage('');
            }}
          >
            <div className="user-avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt={user?.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
            <span className="user-edit-icon">✎</span>
          </button>

          {showProfileEditor && (
            <form className="profile-editor" onSubmit={handleProfileSubmit}>
              <label className="profile-image-picker" htmlFor="profile-picture-file">
                <span className="profile-image-preview">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={user?.name || 'Profil'} />
                  ) : (
                    <span className="avatar-placeholder">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="profile-image-text">Changer l'image</span>
              </label>
              <input
                id="profile-picture-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="profile-file-input"
              />
              <label className="profile-editor-label" htmlFor="current-password">Mot de passe actuel</label>
              <input
                id="current-password"
                type="password"
                value={profileForm.current_password}
                onChange={(e) => setProfileForm((f) => ({ ...f, current_password: e.target.value }))}
                className="profile-editor-input"
                placeholder="Entrer le mot de passe actuel"
              />
              <label className="profile-editor-label" htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                value={profileForm.password}
                onChange={(e) => setProfileForm((f) => ({ ...f, password: e.target.value }))}
                className="profile-editor-input"
                placeholder="Minimum 8 caractères"
              />
              <label className="profile-editor-label" htmlFor="confirm-password">Confirmation</label>
              <input
                id="confirm-password"
                type="password"
                value={profileForm.password_confirmation}
                onChange={(e) => setProfileForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                className="profile-editor-input"
                placeholder="Confirmer le mot de passe"
              />
              {profileError && <p className="profile-editor-error">{profileError}</p>}
              {profileMessage && <p className="profile-editor-success">{profileMessage}</p>}
              <button type="submit" className="btn-profile-save" disabled={isSavingProfile}>
                {isSavingProfile ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          )}

          <button className="btn-logout" onClick={handleLogout}>
            <span>⏻</span> Déconnexion
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}