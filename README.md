# Gestion des Astreintes - Application

Une application complète et moderne de gestion des horaires d'astreinte avec dashboard interactif, planification des équipes et suivi en temps réel.

## 📋 Aperçu

Cette application permet:
- 📅 **Création et gestion des emplois du temps** d'astreinte
- 👥 **Attribution des collaborateurs** aux astreintes
- ⏰ **Suivi des disponibilités** des équipes
- 🔄 **Gestion des changements d'astreintes** (handovers/escalations)
- 🚨 **Gestion des alertes** et incidents
- 📊 **Historique et rapports** des astreintes
- 🔐 **Contrôle d'accès basé sur les rôles**

## 🏗️ Architecture

### Stack Technologique

- **Backend**: Laravel 11 avec API RESTful & Sanctum
- **Frontend**: React 19 + Vite
- **Base de données**: MySQL 8.0+
- **Authentification**: JWT Tokens via Sanctum
- **Styling**: CSS3 moderne (responsive design)

Le projet est complètement découplé (backend + frontend) avec une API RESTful sécurisée.

## 🚀 Installation Rapide

### Prérequis
- PHP 8.2+
- Node.js 16+ & npm  
- MySQL 8.0+
- Composer

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Éditer .env avec vos paramètres de BD
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

👉 **Pour le guide complet**, voir [SETUP.md](./SETUP.md)

## 🔐 Rôles et Permissions

| Rôle | Permissions |
|------|------------|
| **Admin** | Accès complet, gestion utilisateurs et système |
| **Manager** | Créer/modifier emplois du temps, assigner astreintes |
| **Team Lead** | Voir emplois du temps de l'équipe, gérer les assignations |
| **Staff** | Voir son emploi du temps personnel et ses astreintes |

## 📚 Endpoints API

Voir [API.md](./API.md) pour la documentation complète.

### Exemples

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Créer un emploi du temps
curl -X POST http://localhost:8000/api/schedules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Avril 2026","start_date":"2026-04-01","end_date":"2026-04-30"}'
```

## 📱 Features Principales

### Dashboard
- Vue d'ensemble des emplois du temps actifs
- Liste des prochaines astreintes
- Statistiques rapides

### Gestion des Emplois du Temps
- Créer et archiver les emplois du temps
- Publier les emplois du temps (changement de statut)
- Voir les détails avec toutes les astreintes
- Éditer après création

### Gestion des Astreintes
- Attribuer les astreintes aux collaborateurs
- Voir les demandes de changement d'astreinte
- Gérer les types d'astreinte (jour, nuit, week-end, on-call)
- Suivi des statuts (programmées, actives, complétées, annulées)

### Système de Changement d'Astreinte
- Demander un changement d'astreinte
- Accepter ou rejeter un changement
- Transférer l'assignation automatiquement

## 🗂️ Structure du Projet

```
gestion-astreintes/
├── backend/
│   ├── app/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── OnCallSchedule.php
│   │   │   ├── OnCallShift.php
│   │   │   ├── Availability.php
│   │   │   ├── Handover.php
│   │   │   └── Alert.php
│   │   └── Http/Controllers/Api/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ScheduleCard.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SchedulesPage.jsx
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── authContext.jsx
│   │   ├── styles/
│   │   └── App.jsx
│   └── vite.config.js
│
├── README.md
├── API.md
└── SETUP.md
```

## 🧪 Tests

### Créer un utilisateur admin
```bash
php artisan tinker
User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'is_active' => true
]);
```

### Tester l'API
```bash
# Login et récupérer un token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## 🔧 Commandes Utiles

### Backend
```bash
# Migrations
php artisan migrate              # Appliquer les migrations
php artisan migrate:fresh        # Réinitialiser la BD
php artisan migrate:rollback     # Annuler la dernière migration

# Cache
php artisan cache:clear
php artisan config:cache

# Development
php artisan serve               # Démarrer le serveur
php artisan tinker              # Interactive shell
```

### Frontend
```bash
npm run dev              # Serveur de développement
npm run build            # Build production
npm run preview          # Prévisualiser le build
npm run lint             # Linter
```

## 🐛 Dépannage

### Erreur 401 (Non autorisé)
- Vérifier que le token Bearer est envoyé
- Vérifier `SANCTUM_STATEFUL_DOMAINS` dans `.env` backend
- Nettoyer le stockage local du navigateur et se reconnecter

### Erreur de connexion BD
- Vérifier que MySQL s'exécute
- Vérifier les identifiants dans `.env`
- S'assurer que la BD existe: `mysql -u root -e "SHOW DATABASES;"`

### Erreur CORS
- Vérifier que `VITE_API_URL` est correct dans `.env.local` frontend
- Vérifier la configuration CORS dans Laravel

## 📖 Documentation

- [API.md](./API.md) - Documentation complète des endpoints API
- [SETUP.md](./SETUP.md) - Guide d'installation détaillé

---

**Généré par le système de gestion OFPPT © 2026**

## 📚 Documentation

- [Documentation Backend](./backend/README.md)
- [Documentation Frontend](./frontend/README.md)

## 🛠️ Technologies

### Backend
- PHP 8.0+
- Laravel 10
- MySQL 5.7+
- Laravel Sanctum

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand
- React Router

## 📖 Cahier des Charges

### Fonctionnalités Requises

✅ Consultation du planning pour tous
✅ Sélection automatique avec rotation
✅ Gestion par les secrétaires
✅ Déclaration d'indisponibilité
✅ Authentification sécurisée

### Fonctionnalités Optionnelles

⏳ Notifications par mail
⏳ Historique des astreintes
⏳ Application mobile
⏳ Export/Import plannings

## 🐛 Débogage

### Backend
```bash
cd backend
php artisan tinker
```

### Frontend
Utiliser les DevTools React et l'extension Redux DevTools si nécessaire.

## 📞 Support

Pour toute question ou problème, consultez la documentation complète ou les fichiers README spécifiques.

## 📄 Licence

Propriétaire - Tous droits réservés
