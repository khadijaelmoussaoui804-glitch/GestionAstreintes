# API Documentation

## Vue d'Ensemble

L'API de Gestion des Astreintes est une API RESTful construite avec Laravel et sécurisée avec Laravel Sanctum.

### Base URL
```
http://localhost:8000/api
```

### Authentication
Toutes les requêtes (sauf login/register) doivent inclure:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Authentification

### Register
**POST** `/auth/register`

Créer un nouveau compte utilisateur.

```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "secure_password",
  "password_confirmation": "secure_password",
  "service_id": 1
}
```

**Response (201)**
```json
{
  "message": "User registered successfully",
  "user": { /* user object */ },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

### Login
**POST** `/auth/login`

Authentifier un utilisateur.

```json
{
  "email": "jean@example.com",
  "password": "secure_password"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

### Logout
**POST** `/auth/logout`

Déconnecter l'utilisateur actuel.

**Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

### Get Profile
**GET** `/auth/profile`

Récupérer le profil de l'utilisateur connecté.

**Response (200)**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "collaborator",
    "service_id": 1,
    "service": { /* service object */ },
    "agent": { /* agent object */ }
  }
}
```

---

## Services

### List Services
**GET** `/services`

Récupérer tous les services.

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "Service IT",
    "description": "Service Informatique",
    "agents": [ /* agents array */ ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Service
**GET** `/services/{id}`

Récupérer les détails d'un service.

**Response (200)**
```json
{
  "id": 1,
  "name": "Service IT",
  "description": "Service Informatique",
  "agents": [ /* agents with users */ ],
  "schedules": [ /* schedules for service */ ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Create Service
**POST** `/services`

Créer un nouveau service (Admin uniquement).

```json
{
  "name": "Service Support",
  "description": "Service d'assistance technique"
}
```

**Response (201)**
```json
{
  "message": "Service created",
  "service": { /* service object */ }
}
```

### Update Service
**PUT** `/services/{id}`

Mettre à jour un service (Admin uniquement).

```json
{
  "name": "Service Support Client",
  "description": "Service d'assistance client"
}
```

**Response (200)**
```json
{
  "message": "Service updated",
  "service": { /* updated service object */ }
}
```

### Delete Service
**DELETE** `/services/{id}`

Supprimer un service (Admin uniquement).

**Response (200)**
```json
{
  "message": "Service deleted"
}
```

---

## Agents

### List Agents
**GET** `/agents?service_id={id}`

Récupérer les agents d'un service.

**Parameters**
- `service_id` (optional): Filtrer par service

**Response (200)**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "service_id": 1,
    "rotation_order": 1,
    "is_available": true,
    "user": { /* user object */ },
    "service": { /* service object */ },
    "schedules": [ /* schedules array */ ],
    "unavailabilities": [ /* unavailabilities array */ ],
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Agent
**GET** `/agents/{id}`

Récupérer les détails d'un agent.

**Response (200)**
```json
{
  "id": 1,
  "user_id": 2,
  "service_id": 1,
  "rotation_order": 1,
  "is_available": true,
  "user": { /* user object */ },
  "service": { /* service object */ },
  "schedules": [ /* user schedules */ ],
  "unavailabilities": [ /* user unavailabilities */ ]
}
```

### Create Agent
**POST** `/agents`

Ajouter un agent à un service (Secrétaire/Admin).

```json
{
  "user_id": 2,
  "service_id": 1,
  "rotation_order": 1
}
```

**Response (201)**
```json
{
  "message": "Agent created",
  "agent": { /* agent object */ }
}
```

### Update Agent
**PUT** `/agents/{id}`

Mettre à jour un agent (Secrétaire/Admin).

```json
{
  "rotation_order": 2,
  "is_available": false
}
```

**Response (200)**
```json
{
  "message": "Agent updated",
  "agent": { /* updated agent object */ }
}
```

### Delete Agent
**DELETE** `/agents/{id}`

Supprimer un agent (Secrétaire/Admin).

**Response (200)**
```json
{
  "message": "Agent deleted"
}
```

### Declare Unavailability
**POST** `/agents/{id}/unavailability`

Déclarer une indisponibilité pour un agent.

```json
{
  "date": "2024-01-15",
  "reason": "Congé annuel"
}
```

**Response (201)**
```json
{
  "message": "Unavailability recorded",
  "unavailability": {
    "id": 1,
    "agent_id": 1,
    "date": "2024-01-15",
    "reason": "Congé annuel",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## Schedules

### Get Weekly Schedule
**GET** `/schedules/weekly?service_id={id}&week_start={date}`

Récupérer le planning hebdomadaire.

**Parameters**
- `service_id` (optional): Filtrer par service
- `week_start` (optional): Début de la semaine (YYYY-MM-DD)

**Response (200)**
```json
[
  {
    "id": 1,
    "service_id": 1,
    "agent_id": 1,
    "date": "2024-01-08",
    "start_time": "09:00",
    "end_time": "18:00",
    "is_approved": false,
    "agent": { /* agent with user */ },
    "service": { /* service object */ },
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Daily Schedule
**GET** `/schedules/daily?service_id={id}&date={date}`

Récupérer le planning d'un jour.

**Parameters**
- `service_id` (optional): Filtrer par service
- `date` (optional): Date (YYYY-MM-DD)

**Response (200)**
```json
[ /* schedules for specified day */ ]
```

### Assign Agent to Schedule
**POST** `/schedules/{id}/assign`

Assigner un agent à une plage horaire (Secrétaire).

```json
{
  "agent_id": 2
}
```

**Response (200)**
```json
{
  "message": "Agent assigned successfully",
  "schedule": { /* updated schedule */ }
}
```

### Approve Schedule
**POST** `/schedules/{id}/approve`

Approuver un planning (Secrétaire).

**Response (200)**
```json
{
  "message": "Schedule approved",
  "schedule": { /* updated schedule */ }
}
```

### Generate Rotation Schedule
**POST** `/schedules/generate-rotation`

Générer automatiquement les rotations pour une semaine (Secrétaire).

```json
{
  "service_id": 1,
  "week_start": "2024-01-08",
  "week_end": "2024-01-15"
}
```

**Response (200)**
```json
{
  "message": "Schedule generated",
  "schedules": [ /* generated schedules array */ ]
}
```

---

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 422 | Validation échouée |
| 500 | Erreur serveur |

### Exemple de Réponse d'Erreur

```json
{
  "error": "Invalid credentials",
  "message": "The provided credentials are invalid."
}
```

---

## Modèles de Données

### User
```json
{
  "id": 1,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "role": "collaborator",
  "service_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Service
```json
{
  "id": 1,
  "name": "Service IT",
  "description": "Service Informatique",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Agent
```json
{
  "id": 1,
  "user_id": 2,
  "service_id": 1,
  "rotation_order": 1,
  "is_available": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Schedule
```json
{
  "id": 1,
  "service_id": 1,
  "agent_id": 1,
  "date": "2024-01-08",
  "start_time": "09:00",
  "end_time": "18:00",
  "is_approved": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Unavailability
```json
{
  "id": 1,
  "agent_id": 1,
  "date": "2024-01-15",
  "reason": "Congé annuel",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Exemples cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "password"
  }'
```

### Get Services (avec token)
```bash
curl -X GET http://localhost:8000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Generate Rotation
```bash
curl -X POST http://localhost:8000/api/schedules/generate-rotation \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 1,
    "week_start": "2024-01-08",
    "week_end": "2024-01-15"
  }'
```
