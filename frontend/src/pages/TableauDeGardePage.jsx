import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../api/authContext'
import '../styles/tableauGarde.css'

// ── Données OCP statiques (source: tableau de garde Benguerir Oct 2025) ────────
const OCP_GARDE_DATA = [
  { activite: 'Social',                                       sigle: 'MIG/H/A/B',    nom: 'LACHGAR',        adresse: 'Hay Ennasser N°164',              tel: '06 72 16 02 29', categorie: 'Ressources Humaines' },
  { activite: 'Electricité (Réseau) au CI',                   sigle: 'MIG/M/ER',     nom: 'BERRAIS',        adresse: 'Hay Ennasser N°118',              tel: '06 66 20 01 52', categorie: 'Electricité' },
  { activite: 'Electricité (Réseau) au CI',                   sigle: 'MIG/M/ER',     nom: 'CHAMI',          adresse: 'S. 2 N°66',                       tel: '06 67 01 12 65', categorie: 'Electricité' },
  { activite: 'Electricité (Mᵗ Câbles)',                      sigle: 'MIG/B/M/E',    nom: 'TIANE',          adresse: 'Hay Ennasser N°394',              tel: '06 62 31 19 38', categorie: 'Electricité' },
  { activite: 'Electricité (Mᵗ Câbles)',                      sigle: 'MIG/B/M/E',    nom: 'LACHTANE',       adresse: 'Hay Ennasser N°121',              tel: '06 66 21 83 51', categorie: 'Electricité' },
  { activite: 'Electricité Réparation',                       sigle: 'MIG/M/EB',     nom: 'ELHACHIMI',      adresse: 'Hay Riyad 4 N°290',               tel: '06 62 32 45 52', categorie: 'Electricité' },
  { activite: 'Electronique IF',                              sigle: 'MIG/B/M/I',    nom: 'EL KASMI',       adresse: 'Hay Riyad 3 N°194',               tel: '06 62 41 59 26', categorie: 'Electronique' },
  { activite: 'Electronique Chantier',                        sigle: 'MIG/B/M/I',    nom: 'ELHAN',          adresse: 'Lot Jnane El Khayr N°372',        tel: '06 66 99 73 85', categorie: 'Electronique' },
  { activite: 'Maintenance Electronique & Télécommunication', sigle: 'MIG/M/ET',     nom: 'BENEMOR',        adresse: 'Hay Ennasser N°287',              tel: '06 61 11 62 54', categorie: 'Electronique' },
  { activite: 'Magasin — Distribution',                       sigle: 'MIG/M/AB',     nom: 'BOUARIS',        adresse: 'Hay Ennasser N°235',              tel: '06 62 54 50 84', categorie: 'Magasin' },
  { activite: 'Magasin — Réception',                          sigle: 'MIG/M/AB',     nom: 'AZZAM',          adresse: 'Hay El Warda N°27',               tel: '06 62 39 25 10', categorie: 'Magasin' },
  { activite: 'Magasin — Approvisionnement',                  sigle: 'MIG/M/AB',     nom: 'EL KHADDACHY',   adresse: 'HAY Riyad 4 N°170',               tel: '06 59 90 25 17', categorie: 'Magasin' },
  { activite: 'G.C. & E.P. (Plomberie)',                      sigle: 'MIG/M/P',      nom: 'FARKACH',        adresse: 'Hay Ennasser N°182',              tel: '06 62 79 06 84', categorie: 'Infrastructure' },
  { activite: 'Electricité (Cité)',                           sigle: 'MIG/M/ER',     nom: 'ILILOU',         adresse: 'Hay Ennasser N°400',              tel: '06 66 20 04 79', categorie: 'Electricité' },
  { activite: 'Electricité (Cité)',                           sigle: 'MIG/M/ER',     nom: 'EL HANTOUTI',    adresse: 'S. 5 N°68',                       tel: '06 62 15 66 17', categorie: 'Electricité' },
  { activite: 'Climatisation Bâtiment',                       sigle: 'MIG/M/ER-B',   nom: 'LABHAIRI',       adresse: 'Lot Ennasser N°151',              tel: '06 66 03 48 72', categorie: 'Infrastructure' },
  { activite: 'Réseau Eau Potable',                           sigle: 'MIG/M/E-RE',   nom: 'RADI',           adresse: 'Hay Riyad 4 N°209',               tel: '06 66 22 02 69', categorie: 'Infrastructure' },
  { activite: 'Réseau Eau Industrielle',                      sigle: 'MIG/M/E-RE',   nom: 'BENBASSOU',      adresse: 'Hay El Farah N°68',               tel: '06 72 14 62 84', categorie: 'Infrastructure' },
  { activite: 'STEP',                                         sigle: 'MIG/M/ER-E',   nom: 'ETTAHIRI',       adresse: 'S. 14 N°101',                     tel: '06 82 26 75 47', categorie: 'Infrastructure' },
  { activite: 'HSE — Production Support',                     sigle: 'MIG/B/H',      nom: 'EL KOUTARI',     adresse: 'Hay Riad 2 N°313',                tel: '06 62 79 08 76', categorie: 'HSE' },
  { activite: 'HSE — Production Extraction',                  sigle: 'MIG/B/H',      nom: 'RHRISSA',        adresse: 'Lot. Jnane Elkheir N°2013',       tel: '06 62 79 28 41', categorie: 'HSE' },
  { activite: 'HSE — Production Maintenance',                 sigle: 'MIG/B/H',      nom: 'HAIRECH',        adresse: 'Hay Ennasser N°280',              tel: '06 62 36 45',    categorie: 'HSE' },
  { activite: 'HSE — Moyens Généraux',                        sigle: 'MIG/M/H',      nom: 'ELGARDHA',       adresse: 'S. 15 N°439',                     tel: '06 66 20 44 36', categorie: 'HSE' },
  { activite: 'Atelier S/Ensembles',                          sigle: 'MIG/M/R',      nom: 'AZERGUI',        adresse: 'Hay Ennasser N°297',              tel: '06 66 09 96 51', categorie: 'Atelier' },
  { activite: 'Atelier Camions et Chargeuses',                sigle: 'MIG/B/M/C',    nom: 'ACHLOUL',        adresse: 'S. 6 N°B13',                      tel: '06 66 13 10 36', categorie: 'Atelier' },
  { activite: 'Atelier Bulls & Sondeuses',                    sigle: 'MIG/B/M/C',    nom: 'BOUSSEMAH',      adresse: 'S. 15 N°545',                     tel: '06 66 99 56 93', categorie: 'Atelier' },
  { activite: 'Atelier Electrique Engins',                    sigle: 'MIG/B/M/C',    nom: 'CAMMACH',        adresse: 'Hay Ennasser N°133',              tel: '06 62 13 77 28', categorie: 'Atelier' },
  { activite: 'Station Services',                             sigle: 'MIG/B/M/C',    nom: 'BOUSSKINE',      adresse: 'Hay Ennasser N°329',              tel: '06 66 90 63 72', categorie: 'Atelier' },
  { activite: 'Maintenance Froid et Climatisation Engins',    sigle: 'MIG/B/M/CE',   nom: 'HOUSNI',         adresse: 'Hay Ennasser N°370',              tel: '06 66 99 78 56', categorie: 'Atelier' },
  { activite: 'Secteur Electrique IF Epierrage',              sigle: 'MIG/B/M/E',    nom: 'WISTOULI',       adresse: 'Hay Ennasser N°408',              tel: '06 73 35 12 09', categorie: 'Extraction' },
  { activite: 'S. Electrique IF Criblage & Chargement',       sigle: 'MIG/B/M/E',    nom: 'ELAALLAOUI',     adresse: 'Hay Ennasser N°92',               tel: '06 67 23 10 04', categorie: 'Extraction' },
  { activite: 'Electrique Dragline',                          sigle: 'MIG/B/M/ED',   nom: 'EL BIAD',        adresse: 'Hay RIAD 2 N°274',                tel: '06 62 22 50 21', categorie: 'Extraction' },
  { activite: 'Extract — Chantier Trav. Préparatoires',       sigle: 'MIG/B/E',      nom: 'KANSOUSI',       adresse: 'S. 5 N°39',                       tel: '06 61 06 55 01', categorie: 'Extraction' },
  { activite: 'Extract — Chantier Défruitage/Aménagement',    sigle: 'MIG/B/E',      nom: 'LAFHAL',         adresse: 'Hay Ennasser N°174',              tel: '06 62 13 78 43', categorie: 'Extraction' },
  { activite: 'Extract IF — Epierrage',                       sigle: 'MIG/B/E/F',    nom: 'EL MOUNTASSIR',  adresse: 'Hay Ennasser N°131',              tel: '06 62 34 44 04', categorie: 'Extraction' },
  { activite: 'Extract IF — Criblage et Chargement',          sigle: 'MIG/B/E/F',    nom: 'EZZAHRAOUI',     adresse: 'Hay Ennasser N°255',              tel: '06 73 34 22 61', categorie: 'Extraction' },
  { activite: 'Chargement Trains — Flux Gantour & Cabine',    sigle: 'MIG/B/E',      nom: 'ECHAMEKH',       adresse: 'Riyad 4, Lot. Mesk Ellil N°H4',  tel: '06 62 02 46 97', categorie: 'Extraction' },
  { activite: 'IF Mécanique — Chargement et Criblage',        sigle: 'MIG/B/E/F/I',  nom: 'EL FAQUIRI',     adresse: 'Lot. El Qods N°45',               tel: '06 62 22 36 93', categorie: 'Mécanique' },
  { activite: 'IF Mécanique — Epierrage',                     sigle: 'MIG/B/E/F/I',  nom: 'OUASLAMI',       adresse: 'S. 13',                           tel: '06 62 10 09 36', categorie: 'Mécanique' },
  { activite: 'Vulcanisation Installations Fixes',            sigle: 'MIG/B/E/F/I',  nom: 'EL GHOUL',       adresse: 'Hay Riyad 2 N°288',               tel: '06 66 22 01 81', categorie: 'Mécanique' },
  { activite: 'Atelier Répar. Garage',                        sigle: 'MIG/M/M/L',    nom: 'MEHRACHE',       adresse: 'Jnane El Khair N°324',            tel: '06 62 26 42 70', categorie: 'Mécanique' },
  { activite: 'Contrôle Matériel',                            sigle: 'MIG/M/AC',     nom: 'HABLY',          adresse: 'Hay Ennasser N°104',              tel: '06 62 13 77 94', categorie: 'Mécanique' },
  { activite: 'Mécanique Dragline',                           sigle: 'MIG/B/M/D',    nom: 'LAMSAHEL',       adresse: 'Secteur 13 N°339',                tel: '06 66 84 36 75', categorie: 'Mécanique' },
  { activite: 'Section Géologie',                             sigle: 'MIG/B/P/G',    nom: 'BOUZALMANE',     adresse: 'Hay El Farah Gr.5 N°305',         tel: '06 62 22 81 63', categorie: 'Géologie' },
  { activite: 'FIM — Growth Program Gantour',                 sigle: 'FIM/TG',       nom: 'BOUGRINE',       adresse: 'S. 15 N°443',                     tel: '06 67 19 69 89', categorie: 'FIM' },
  { activite: 'FIM — Growth Program Gantour',                 sigle: 'FIM/TG',       nom: 'DRIOUICH',       adresse: 'HAY Riyad 4 N°480',               tel: '06 62 01 77 83', categorie: 'FIM' },
  { activite: 'Sûreté des Installations BG',                  sigle: 'MIG/S/B',      nom: 'CHAHBOUNIA',     adresse: 'Hay Riyad N°440',                 tel: '06 42 48 06 08', categorie: 'Sûreté' },
  { activite: 'Bureau d\'études',                             sigle: 'MIG/M/T-BE',   nom: 'CHANI',          adresse: 'Hay Ennasser N°392',              tel: '06 66 83 38 72', categorie: 'Bureau' },
]

const CATEGORY_COLORS = {
  'Electricité':       { bg: '#fff7ed', border: '#fb923c', badge: '#ea580c', dot: '#f97316' },
  'Electronique':      { bg: '#eff6ff', border: '#60a5fa', badge: '#2563eb', dot: '#3b82f6' },
  'Magasin':           { bg: '#fdf4ff', border: '#c084fc', badge: '#9333ea', dot: '#a855f7' },
  'Infrastructure':    { bg: '#f0fdf4', border: '#4ade80', badge: '#16a34a', dot: '#22c55e' },
  'HSE':               { bg: '#fff1f2', border: '#fb7185', badge: '#e11d48', dot: '#f43f5e' },
  'Atelier':           { bg: '#fefce8', border: '#facc15', badge: '#ca8a04', dot: '#eab308' },
  'Extraction':        { bg: '#f0fdf4', border: '#2e8b47', badge: '#1a6b2f', dot: '#2e8b47' },
  'Mécanique':         { bg: '#f8fafc', border: '#94a3b8', badge: '#475569', dot: '#64748b' },
  'Géologie':          { bg: '#fdf2f8', border: '#e879f9', badge: '#a21caf', dot: '#d946ef' },
  'FIM':               { bg: '#ecfdf5', border: '#34d399', badge: '#059669', dot: '#10b981' },
  'Sûreté':            { bg: '#fef3c7', border: '#fbbf24', badge: '#b45309', dot: '#f59e0b' },
  'Bureau':            { bg: '#f0f9ff', border: '#38bdf8', badge: '#0284c7', dot: '#0ea5e9' },
  'Ressources Humaines': { bg: '#fdf4ff', border: '#e879f9', badge: '#7e22ce', dot: '#a855f7' },
}

const ALL_CATEGORIES = [...new Set(OCP_GARDE_DATA.map(r => r.categorie))]

// ── Composant carte agent ──────────────────────────────────────────────────────
function AgentCard({ row, index, onCall }) {
  const colors = CATEGORY_COLORS[row.categorie] || CATEGORY_COLORS['Bureau']
  const initials = row.nom.split(' ').map(w => w[0]).join('').slice(0, 2)

  return (
    <div
      className="tg-card"
      style={{
        '--card-border': colors.border,
        '--card-bg': colors.bg,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {/* Badge catégorie */}
      <div className="tg-card-badge" style={{ background: colors.badge }}>
        {row.categorie}
      </div>

      {/* Avatar + statut */}
      <div className="tg-card-top">
        <div className="tg-avatar" style={{ background: colors.badge }}>
          {onCall?.profile_picture
            ? <img src={onCall.profile_picture} alt={onCall.name} />
            : <span>{initials}</span>
          }
        </div>
        <div className="tg-status-dot" style={{ background: colors.dot }} title="En astreinte" />
      </div>

      {/* Nom agent */}
      <div className="tg-card-name">
        {onCall?.name || row.nom}
      </div>
      <div className="tg-card-sigle">{row.sigle}</div>

      {/* Activité */}
      <div className="tg-card-activite">{row.activite}</div>

      {/* Adresse */}
      <div className="tg-card-meta">
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        {row.adresse}
      </div>

      {/* Téléphone */}
      <a href={`tel:${row.tel.replace(/\s/g, '')}`} className="tg-card-tel">
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/>
        </svg>
        {row.tel}
      </a>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function TableauDeGardePage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [users, setUsers] = useState([])
  const [assignments, setAssignments] = useState({}) // { activite: user }
  const [editMode, setEditMode] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [editUser, setEditUser] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const isAdmin = user?.role === 'admin' || user?.role === 'manager'
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  // Fetch users for assignment
  useEffect(() => {
    if (!isAdmin) return
    const token = localStorage.getItem('auth_token')
    fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data.filter(u => u.is_active) : []))
      .catch(() => {})
  }, [isAdmin])

  // Filter data
  const filtered = OCP_GARDE_DATA.filter(row => {
    const matchCat = activeCategory === 'Tous' || row.categorie === activeCategory
    const matchSearch = !search || [row.activite, row.nom, row.sigle, row.adresse]
      .some(v => v.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  // Save assignment
  const handleSaveAssign = () => {
    if (!editRow) return
    setSaving(true)
    setTimeout(() => {
      const found = users.find(u => String(u.id) === String(editUser))
      setAssignments(prev => ({
        ...prev,
        [editRow.activite + editRow.nom]: found || null,
      }))
      setSaving(false)
      setEditRow(null)
      setEditUser('')
      setSaveMsg('✅ Agent assigné avec succès')
      setTimeout(() => setSaveMsg(''), 3000)
    }, 600)
  }

  // Counts per category
  const catCounts = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = OCP_GARDE_DATA.filter(r => r.categorie === cat).length
    return acc
  }, {})

  return (
    <div className="tg-page">
      {/* ── Header ── */}
      <div className="tg-header">
        <div className="tg-header-left">
          <div className="tg-header-icon">🛡️</div>
          <div>
            <h1 className="tg-title">Tableau de Garde</h1>
            <p className="tg-subtitle">
              OCP — Site Benguerir &nbsp;·&nbsp;
              <span className="tg-date">{today}</span>
            </p>
          </div>
        </div>
        <div className="tg-header-right">
          <div className="tg-count-pill">
            <span className="tg-count-num">{filtered.length}</span>
            <span className="tg-count-label">agents en garde</span>
          </div>
          {isAdmin && (
            <button
              className={`tg-edit-btn ${editMode ? 'active' : ''}`}
              onClick={() => { setEditMode(e => !e); setEditRow(null) }}
            >
              {editMode ? '✓ Terminer' : '✎ Modifier'}
            </button>
          )}
          <div className="tg-view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grille">⊞</button>
            <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')} title="Tableau">≡</button>
          </div>
        </div>
      </div>

      {/* ── Infos permanence fixe ── */}
      <div className="tg-permanence-bar">
        <div className="tg-perm-item">
          <span className="tg-perm-label">HC de garde Cité OCP</span>
          <span className="tg-perm-value">ABOU ABDALLAH Mohammed — Lot. Ennasr N°373C</span>
          <span className="tg-perm-tel">06 61 38 28 89</span>
        </div>
        <div className="tg-perm-divider" />
        <div className="tg-perm-item">
          <span className="tg-perm-label">Médecin CMS</span>
          <span className="tg-perm-value">EL MEHDI Souad</span>
          <span className="tg-perm-tel">06 61 49 85 68</span>
        </div>
        <div className="tg-perm-divider" />
        <div className="tg-perm-item">
          <span className="tg-perm-label">HC Permanence Chantier</span>
          <span className="tg-perm-value">Benabdejlil Lamfadel — Hay Riad 4 N°183</span>
          <span className="tg-perm-tel">06 62 48 70 48</span>
        </div>
        <div className="tg-perm-divider" />
        <div className="tg-perm-item">
          <span className="tg-perm-label">🖥 Service Desk</span>
          <span className="tg-perm-value">Intranet · IP 7070</span>
          <span className="tg-perm-tel">06 00 00 66 80</span>
        </div>
      </div>

      {/* ── Save message ── */}
      {saveMsg && <div className="tg-save-msg">{saveMsg}</div>}

      {/* ── Search + Filters ── */}
      <div className="tg-toolbar">
        <div className="tg-search-wrap">
          <svg className="tg-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            className="tg-search"
            type="text"
            placeholder="Rechercher service, agent, sigle…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="tg-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="tg-cats">
          <button
            className={`tg-cat-btn ${activeCategory === 'Tous' ? 'active' : ''}`}
            onClick={() => setActiveCategory('Tous')}
          >
            Tous <span className="tg-cat-count">{OCP_GARDE_DATA.length}</span>
          </button>
          {ALL_CATEGORIES.map(cat => {
            const colors = CATEGORY_COLORS[cat] || {}
            return (
              <button
                key={cat}
                className={`tg-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={activeCategory === cat ? { background: colors.badge, color: '#fff', borderColor: colors.badge } : { borderColor: colors.border }}
              >
                <span className="tg-cat-dot" style={{ background: colors.dot }} />
                {cat}
                <span className="tg-cat-count">{catCounts[cat]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <div className="tg-empty">
          <div className="tg-empty-icon">🔍</div>
          <p>Aucun résultat pour « {search} »</p>
          <button onClick={() => { setSearch(''); setActiveCategory('Tous') }}>Réinitialiser</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="tg-grid">
          {filtered.map((row, i) => (
            <div key={`${row.activite}-${row.nom}`} className="tg-card-wrap">
              <AgentCard
                row={row}
                index={i}
                onCall={assignments[row.activite + row.nom]}
              />
              {editMode && isAdmin && (
                <button
                  className="tg-assign-btn"
                  onClick={() => { setEditRow(row); setEditUser(assignments[row.activite + row.nom]?.id || '') }}
                >
                  ✎ Assigner agent
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── TABLE MODE ── */
        <div className="tg-table-wrap">
          <table className="tg-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Activité</th>
                <th>Sigle</th>
                <th>Agent de Garde</th>
                <th>Adresse</th>
                <th>Téléphone</th>
                {editMode && isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const colors = CATEGORY_COLORS[row.categorie] || {}
                const onCall = assignments[row.activite + row.nom]
                return (
                  <tr key={`${row.activite}-${row.nom}`} style={{ animationDelay: `${i * 0.02}s` }}>
                    <td>
                      <span className="tg-table-badge" style={{ background: colors.badge + '18', color: colors.badge, border: `1px solid ${colors.border}` }}>
                        <span className="tg-cat-dot" style={{ background: colors.dot }} />
                        {row.categorie}
                      </span>
                    </td>
                    <td className="tg-table-activite">{row.activite}</td>
                    <td><code className="tg-table-sigle">{row.sigle}</code></td>
                    <td>
                      <div className="tg-table-agent">
                        <div className="tg-table-avatar" style={{ background: colors.badge }}>
                          {(onCall?.name || row.nom).split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <span>{onCall?.name || row.nom}</span>
                        <span className="tg-online-dot" />
                      </div>
                    </td>
                    <td className="tg-table-addr">{row.adresse}</td>
                    <td>
                      <a href={`tel:${row.tel.replace(/\s/g, '')}`} className="tg-table-tel">{row.tel}</a>
                    </td>
                    {editMode && isAdmin && (
                      <td>
                        <button
                          className="tg-assign-btn-sm"
                          onClick={() => { setEditRow(row); setEditUser(assignments[row.activite + row.nom]?.id || '') }}
                        >
                          ✎
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal assignation ── */}
      {editRow && (
        <div className="tg-modal-overlay" onClick={() => setEditRow(null)}>
          <div className="tg-modal" onClick={e => e.stopPropagation()}>
            <div className="tg-modal-header">
              <div>
                <h3>Assigner agent de garde</h3>
                <p>{editRow.activite}</p>
              </div>
              <button className="tg-modal-close" onClick={() => setEditRow(null)}>✕</button>
            </div>

            <div className="tg-modal-body">
              <label>Agent actuel</label>
              <div className="tg-modal-current">
                {assignments[editRow.activite + editRow.nom]?.name || editRow.nom}
                <span className="tg-online-dot" />
              </div>

              <label>Nouveau agent</label>
              <select
                value={editUser}
                onChange={e => setEditUser(e.target.value)}
                className="tg-modal-select"
              >
                <option value="">— Garder agent actuel ({editRow.nom}) —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="tg-modal-footer">
              <button className="tg-modal-cancel" onClick={() => setEditRow(null)}>Annuler</button>
              <button className="tg-modal-save" onClick={handleSaveAssign} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}