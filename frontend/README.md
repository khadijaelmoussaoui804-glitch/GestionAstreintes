# Gestion des Astreintes - Frontend

Frontend React application for managing on-call schedules using React, Vite, and Tailwind CSS.

## Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── SchedulesPage.jsx
│   ├── AgentsPage.jsx
│   ├── UnavailabilityPage.jsx
│   └── AdminPage.jsx
├── store/              # Zustand stores
│   ├── authStore.js
│   ├── scheduleStore.js
│   ├── agentStore.js
│   └── serviceStore.js
├── api/                # API service files
└── utils/              # Utility functions
```

## Pages

### Login (Public)
- User registration and login
- Service selection during registration
- Token-based authentication

### Dashboard (Protected)
- Overview of user profile
- Current week's on-call schedule
- Quick statistics

### Schedules (Protected)
- View weekly or daily on-call schedules
- Secretary features:
  - Generate automatic rotation
  - Approve schedules
  - Assign agents to schedules

### Unavailability (Protected)
- Declare unavailability for specific dates
- Provide reason for absence
- System notifies secretaries

### Agents (Secretary/Admin Only)
- List all agents in service
- Add new agents
- Manage agent rotation order

### Admin (Admin Only)
- Create and manage services
- Edit and delete services
- System-wide configuration

## Features

### Authentication
- Email/password login and registration
- Token-based API authentication (Sanctum)
- Role-based access control

### Schedule Management
- View schedules by service or globally
- Automatic rotation generation
- Manual agent assignment
- Schedule approval workflow

### User Roles
- **Collaborator**: View schedules, declare unavailability
- **Secretary**: Manage agents, validate schedules
- **Admin**: Manage services and system settings

## State Management

Uses Zustand for lightweight state management:
- Auth store: User authentication and profile
- Schedule store: Schedule data and operations
- Agent store: Agent management
- Service store: Service management

## Build

```bash
npm run build
```

## Production

The built application can be deployed to any static hosting:

```bash
npm run preview
```
