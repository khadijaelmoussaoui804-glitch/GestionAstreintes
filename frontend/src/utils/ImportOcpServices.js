/**
 * OCP — Import automatique des services (Benguerir, Oct 2025)
 * ============================================================
 * Fichier : importOcpServices.js
 * Emplacement suggéré : frontend/src/utils/importOcpServices.js
 *
 * Usage dans AdminPage ou n'importe quel composant admin :
 *
 *   import { importOcpServices } from '../utils/importOcpServices'
 *
 *   const result = await importOcpServices(token, existingServiceNames)
 *   console.log(result) // { imported: 48, skipped: 2, errors: [] }
 */

/** Liste complète des 50 services OCP extraits du tableau de garde Oct 2025 */
export const OCP_SERVICES = [
  // ── Activités électriques & réseau ──────────────────────────────────────────
  {
    name: 'Social',
    description: 'Service social — MIG/H/A/B — LACHGAR — Hay Ennasser N°164 — 06 72 16 02 29',
  },
  {
    name: 'Electricité (Réseau) au CI — BERRAIS',
    description: 'Electricité réseau CI — MIG/M/ER — BERRAIS — Hay Ennasser N°118 — 06 66 20 01 52',
  },
  {
    name: 'Electricité (Réseau) au CI — CHAMI',
    description: 'Electricité réseau CI — MIG/M/ER — CHAMI — S. 2 N°66 — 06 67 01 12 65',
  },
  {
    name: 'Electricité (Mᵗ Câbles) — TIANE',
    description: 'Electricité monteur câbles — MIG/B/M/E — TIANE — Hay Ennasser N°394 — 06 62 31 19 38',
  },
  {
    name: 'Electricité (Mᵗ Câbles) — LACHTANE',
    description: 'Electricité monteur câbles — MIG/B/M/E — LACHTANE — Hay Ennasser N°121 — 06 66 21 83 51',
  },
  {
    name: 'Electricité Réparation',
    description: 'Electricité réparation — MIG/M/EB — ELHACHIMI — Hay Riyad 4 N°290 — 06 62 32 45 52',
  },
  {
    name: 'Electronique IF',
    description: 'Electronique IF — MIG/B/M/I — EL KASMI — Hay Riyad 3 N°194 — 06 62 41 59 26',
  },
  {
    name: 'Electronique Chantier',
    description: 'Electronique chantier — MIG/B/M/I — ELHAN — Lot Jnane El Khayr N°372 — 06 66 99 73 85',
  },
  {
    name: 'Maintenance Electronique & Télécommunication',
    description: 'Maintenance électronique & télécommunication — MIG/M/ET — BENEMOR — Hay Ennasser N°287 — 06 61 11 62 54',
  },

  // ── Magasins ─────────────────────────────────────────────────────────────────
  {
    name: 'Magasin — Distribution',
    description: 'Magasin distribution — MIG/M/AB — BOUARIS — Hay Ennasser N°235 — 06 62 54 50 84',
  },
  {
    name: 'Magasin — Réception',
    description: 'Magasin réception — MIG/M/AB — AZZAM — Hay El Warda N°27 — 06 62 39 25 10',
  },
  {
    name: 'Magasin — Approvisionnement',
    description: 'Magasin approvisionnement — MIG/M/AB — EL KHADDACHY — HAY Riyad 4 N°170 — 06 59 90 25 17',
  },

  // ── Utilities ─────────────────────────────────────────────────────────────────
  {
    name: 'G.C. & E.P. (Plomberie)',
    description: 'Génie civil et équipements de plomberie — MIG/M/P — FARKACH — Hay Ennasser N°182 — 06 62 79 06 84',
  },
  {
    name: 'Electricité (Cité) — ILILOU',
    description: 'Electricité cité — MIG/M/ER — ILILOU — Hay Ennasser N°400 — 06 66 20 04 79',
  },
  {
    name: 'Electricité (Cité) — EL HANTOUTI',
    description: 'Electricité cité — MIG/M/ER — EL HANTOUTI — S. 5 N°68 — 06 62 15 66 17',
  },
  {
    name: 'Climatisation Bâtiment',
    description: 'Climatisation bâtiment — MIG/M/ER-B — LABHAIRI — Lot Ennasser N°151 — 06 66 03 48 72',
  },
  {
    name: 'Réseau Eau Potable',
    description: 'Réseau eau potable — MIG/M/E-RE — RADI — Hay Riyad 4 N°209 — 06 66 22 02 69',
  },
  {
    name: 'Réseau Eau Industrielle',
    description: 'Réseau eau industrielle — MIG/M/E-RE — BENBASSOU — Hay El Farah N°68 — 06 72 14 62 84',
  },
  {
    name: 'STEP',
    description: "Station d'épuration — MIG/M/ER-E — ETTAHIRI — S. 14 N°101 — 06 82 26 75 47",
  },

  // ── HSE ───────────────────────────────────────────────────────────────────────
  {
    name: 'HSE — Production Support',
    description: 'HSE production support — MIG/B/H — EL KOUTARI — Hay Riad 2 N°313 — 06 62 79 08 76',
  },
  {
    name: 'HSE — Production Extraction',
    description: 'HSE production extraction — MIG/B/H — RHRISSA — Lotissement Jnane Elkheir N°2013 — 06 62 79 28 41',
  },
  {
    name: 'HSE — Production Maintenance',
    description: 'HSE production maintenance — MIG/B/H — HAIRECH — Hay Ennasser N°280 — 06 62 36 45',
  },
  {
    name: 'HSE — Moyens Généraux',
    description: 'HSE moyens généraux — MIG/M/H — ELGARDHA — S. 15 N°439 — 06 66 20 44 36',
  },

  // ── Ateliers ──────────────────────────────────────────────────────────────────
  {
    name: 'Atelier S/Ensembles',
    description: 'Atelier sous-ensembles — MIG/M/R — AZERGUI — Hay Ennasser N°297 — 06 66 09 96 51',
  },
  {
    name: 'Atelier Camions et Chargeuses',
    description: 'Atelier camions et chargeuses — MIG/B/M/C — ACHLOUL — S. 6 N°B13 — 06 66 13 10 36',
  },
  {
    name: 'Atelier Bulls & Sondeuses',
    description: 'Atelier bulls et sondeuses — MIG/B/M/C — BOUSSEMAH — S. 15 N°545 — 06 66 99 56 93',
  },
  {
    name: 'Atelier Electrique Engins',
    description: 'Atelier électrique engins — MIG/B/M/C — CAMMACH — Hay Ennasser N°133 — 06 62 13 77 28',
  },
  {
    name: 'Station Services',
    description: 'Station services — MIG/B/M/C — BOUSSKINE — Hay Ennasser N°329 — 06 66 90 63 72',
  },
  {
    name: 'Maintenance Froid et Climatisation des Engins',
    description: 'Maintenance froid climatisation engins — MIG/B/M/CE — HOUSNI — Hay Ennasser N°370 — 06 66 99 78 56',
  },

  // ── Secteurs Electriques IF ────────────────────────────────────────────────
  {
    name: 'Secteur Electrique IF Epierrage',
    description: 'Secteur électrique IF épierrage — MIG/B/M/E — WISTOULI — Hay Ennasser N°408 — 06 73 35 12 09',
  },
  {
    name: 'S. Electrique IF Criblage & Chargement Trains',
    description: 'Secteur électrique IF criblage & chargement trains — MIG/B/M/E — ELAALLAOUI — Hay Ennasser N°92 — 06 67 23 10 04',
  },
  {
    name: 'Electrique Dragline',
    description: 'Electrique dragline — MIG/B/M/ED — EL BIAD — Hay RIAD 2 N°274 — 06 62 22 50 21',
  },

  // ── Extract ───────────────────────────────────────────────────────────────────
  {
    name: "Extract — Chantier Trav. Préparatoires",
    description: "Extraction chantier travaux préparatoires — MIG/B/E — KANSOUSI — S. 5 N°39 — 06 61 06 55 01",
  },
  {
    name: "Extract — Chantier Défruitage/Aménagement",
    description: "Extraction chantier défruitage et aménagement — MIG/B/E — LAFHAL — Hay Ennasser N°174 — 06 62 13 78 43",
  },
  {
    name: 'Extract IF — Epierrage',
    description: 'Extraction IF épierrage — MIG/B/E/F — EL MOUNTASSIR — Hay Ennasser N°131 — 06 62 34 44 04',
  },
  {
    name: 'Extract IF — Criblage et Chargement',
    description: 'Extraction IF criblage et chargement — MIG/B/E/F — EZZAHRAOUI — Hay Ennasser N°255 — 06 73 34 22 61',
  },

  // ── Chargement Trains ──────────────────────────────────────────────────────
  {
    name: 'Chargement Trains — Flux Gantour & Cabine de Pilotage',
    description: "Chargement trains communication avec flux Gantour et cabine de pilotage — MIG/B/E — ECHAMEKH — Riyad 4, Lot. Mesk Ellil N°H4 — 06 62 02 46 97",
  },

  // ── IF Mécanique ──────────────────────────────────────────────────────────
  {
    name: 'IF Mécanique — Chargement et Criblage',
    description: 'IF mécanique chargement et criblage — MIG/B/E/F/I — EL FAQUIRI — Lotissement El Qods N°45 — 06 62 22 36 93',
  },
  {
    name: 'IF Mécanique — Epierrage',
    description: 'IF mécanique épierrage — MIG/B/E/F/I — OUASLAMI — S. 13 — 06 62 10 09 36',
  },
  {
    name: 'Vulcanisation Installations Fixes',
    description: 'Vulcanisation installations fixes — MIG/B/E/F/I — EL GHOUL — Hay Riyad 2 N°288 — 06 66 22 01 81',
  },
  {
    name: 'Atelier Répar. Garage',
    description: 'Atelier réparation garage — MIG/M/M/L — MEHRACHE — Jnane El Khair N°324 — 06 62 26 42 70',
  },
  {
    name: 'Contrôle Matériel',
    description: 'Contrôle matériel — MIG/M/AC — HABLY — Hay Ennasser N°104 — 06 62 13 77 94',
  },
  {
    name: 'Mécanique Dragline',
    description: 'Mécanique dragline — MIG/B/M/D — LAMSAHEL — Secteur 13 N°339 — 06 66 84 36 75',
  },
  {
    name: 'Section Géologie',
    description: 'Section géologie — MIG/B/P/G — BOUZALMANE — Hay El Farah Groupe 5 N°305 — 06 62 22 81 63',
  },

  // ── FIM ───────────────────────────────────────────────────────────────────
  {
    name: 'FIM — Growth Program Gantour (Bougrine)',
    description: 'FIM growth program Gantour — FIM/TG — BOUGRINE — S. 15 N°443 — 06 67 19 69 89',
  },
  {
    name: 'FIM — Growth Program Gantour (Driouich)',
    description: 'FIM growth program Gantour — FIM/TG — DRIOUICH — HAY Riyad 4 N°480 — 06 62 01 77 83',
  },

  // ── Sûreté & Bureau ───────────────────────────────────────────────────────
  {
    name: "Sûreté des Installations BG",
    description: "Sûreté des installations Benguerir — MIG/S/B — CHAHBOUNIA — Hay Riyad N°440 — 06 42 48 06 08",
  },
  {
    name: "Bureau d'études",
    description: "Bureau d'études — MIG/M/T-BE — CHANI — Hay Ennasser N°392 — 06 66 83 38 72",
  },
]

/**
 * Importe les services OCP via l'API REST.
 *
 * @param {string} token          - JWT token (localStorage.getItem('auth_token'))
 * @param {string[]} existingNames - Noms déjà en base pour éviter les doublons
 * @param {string} [baseUrl='/api'] - URL de base de l'API
 * @returns {Promise<{ imported: number, skipped: number, errors: string[] }>}
 */
export async function importOcpServices(token, existingNames = [], baseUrl = '/api') {
  const results = { imported: 0, skipped: 0, errors: [] }

  const existingSet = new Set(existingNames.map((n) => n.toLowerCase().trim()))

  for (const service of OCP_SERVICES) {
    if (existingSet.has(service.name.toLowerCase().trim())) {
      results.skipped++
      continue
    }

    try {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        results.errors.push(`${service.name}: ${err.message || res.statusText}`)
      } else {
        results.imported++
      }
    } catch (err) {
      results.errors.push(`${service.name}: ${err.message}`)
    }
  }

  return results
}