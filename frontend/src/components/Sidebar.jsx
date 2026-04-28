import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/authContext';
import '../styles/sidebar.css';

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

    const payload = {
      profile_picture: profileForm.profile_picture.trim(),
    };

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
    { label: 'Tableau de Bord', path: '/dashboard', icon: '📊', roles: ['admin', 'manager', 'team_lead', 'staff', 'user'] },
    { label: 'Emplois du Temps', path: '/schedules', icon: '📅', roles: ['admin', 'manager', 'team_lead', 'staff', 'user'] },
    { label: 'Agents', path: '/agents', icon: '👥', roles: ['admin', 'manager'] },
    { label: 'Indisponibilités', path: '/unavailability', icon: '❌', roles: ['staff', 'user'] },
    { label: 'Administration', path: '/admin', icon: '⚙️', roles: ['admin'] },
  ].filter((item) => item.roles.includes(user?.role));

  const avatarSrc = profileForm.profile_picture || user?.profile_picture;

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <h1 className="sidebar-brand-title">Gestion Des Astreintes</h1>
          </div>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
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

          <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}