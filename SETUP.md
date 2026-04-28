# Guide d'Installation Complet

## ✅ Prérequis

### Backend
- PHP 8.0 ou supérieur
- Composer
- MySQL 5.7 ou supérieur

### Frontend
- Node.js 16+
- npm ou yarn

## 🔧 Installation Étape par Étape

### 1. Préparation de la Base de Données MySQL

```sql
-- Créer la base de données
CREATE DATABASE gestion_astreintes DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur (optionnel)
CREATE USER 'gestion_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON gestion_astreintes.* TO 'gestion_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Installation du Backend

```bash
cd backend

# Installer les dépendances Composer
composer install

# Créer le fichier .env
cp .env.example .env

# Éditer le fichier .env
# Mettre à jour les paramètres de base de données:
# DB_DATABASE=gestion_astreintes
# DB_USERNAME=root (ou gestion_user)
# DB_PASSWORD=votre_mot_de_passe

# Générer la clé d'application
php artisan key:generate

# Exécuter les migrations
php artisan migrate

# (Optionnel) Seeder les données de test
php artisan db:seed

# Démarrer le serveur de développement
php artisan serve
```

Le backend sera accessible à: `http://localhost:8000`

### 3. Installation du Frontend

```bash
cd frontend

# Installer les dépendances npm
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible à: `http://localhost:3000`

## 🔑 Comptes de Test

Après le seed, les comptes suivants sont disponibles:

### Administrateur
- Email: `admin@gestion-astreintes.local`
- Mot de passe: `password`

### Secrétaire
- Email: `secretary@gestion-astreintes.local`
- Mot de passe: `password`

### Collaborateur
- Email: `user@gestion-astreintes.local`
- Mot de passe: `password`

## 🗂️ Structure des Dossiers

```
GestionAstreinte/
├── backend/
│   ├── app/
│   │   ├── Models/          # Modèles Eloquent
│   │   ├── Http/
│   │   │   ├── Controllers/ # Contrôleurs API
│   │   │   └── Middleware/  # Middlewares
│   │   └── Services/        # Services métier
│   ├── database/
│   │   ├── migrations/      # Migrations de base de données
│   │   └── seeders/         # Seeders
│   ├── routes/
│   │   └── api.php          # Routes API
│   ├── config/              # Configuration Laravel
│   ├── .env.example         # Fichier d'environnement exemple
│   └── composer.json        # Dépendances PHP
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── store/           # Stores Zustand
│   │   ├── api/             # Services API
│   │   ├── utils/           # Utilitaires
│   │   ├── App.jsx          # Composant principal
│   │   └── main.jsx         # Point d'entrée
│   ├── index.html           # HTML principal
│   ├── package.json         # Dépendances Node.js
│   ├── vite.config.js       # Configuration Vite
│   ├── tailwind.config.js   # Configuration Tailwind
│   └── postcss.config.js    # Configuration PostCSS
│
└── README.md                # Documentation principale
```

## 🌐 Variables d'Environnement

### Backend (.env)

```env
APP_NAME="Gestion des Astreintes"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestion_astreintes
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=log
MAIL_FROM_ADDRESS="no-reply@gestion-astreintes.local"

VITE_API_URL=http://localhost:8000/api
```

### Frontend (.env)

Créer un fichier `.env` au niveau du frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Commandes Utiles

### Backend

```bash
# Créer un utilisateur administrateur
php artisan tinker
> User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => bcrypt('password'), 'role' => 'admin'])

# Vider la base de données et relancer les migrations
php artisan migrate:fresh --seed

# Créer une migration
php artisan make:migration create_table_name

# Créer un modèle
php artisan make:model ModelName

# Créer un contrôleur
php artisan make:controller Api/ControllerName
```

### Frontend

```bash
# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Linter le code
npm run lint
```

## 🔌 Proxy API

Le Vite est configuré pour proxy les requêtes `/api` vers le backend:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

## 🛡️ Sécurité

- Toutes les routes API (sauf login/register) nécessitent l'authentification
- Les tokens Sanctum expirent après inactivité
- Les mots de passe sont hasés avec bcrypt
- CORS est configuré pour accepter le frontend local

## 🐛 Dépannage

### Backend ne répond pas

```bash
# Vérifier que le serveur tourne
php artisan serve

# Vérifier les logs
tail storage/logs/laravel.log

# Vérifier la configuration de base de données
php artisan config:show database
```

### Frontend ne se connecte pas

1. Vérifier que le backend tourne sur `http://localhost:8000`
2. Vérifier la configuration du proxy dans `vite.config.js`
3. Ouvrir DevTools et vérifier les erreurs réseau

### Erreurs de migration

```bash
# Annuler la dernière migration
php artisan migrate:rollback

# Annuler toutes les migrations
php artisan migrate:reset

# Relancer depuis zéro
php artisan migrate:fresh --seed
```

## 📱 Accès à l'Application

- **Accueil**: `http://localhost:3000`
- **API Base**: `http://localhost:8000/api`
- **Documentation API**: `http://localhost:8000/api/docs` (si activée)

## 🎯 Prochaines Étapes

1. Créer des utilisateurs et services via l'admin
2. Ajouter les agents à chaque service
3. Générer les rotations automatiques
4. Tester les fonctionnalités de chaque rôle

## 📞 Support

En cas de problème:
1. Vérifier les logs (backend: `storage/logs/laravel.log`, frontend: Console)
2. Consulter la documentation spécifique dans `backend/README.md` ou `frontend/README.md`
3. Vérifier que tous les prérequis sont installés
