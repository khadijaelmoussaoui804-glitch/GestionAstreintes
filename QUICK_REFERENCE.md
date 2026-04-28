# Quick Reference Guide

## 🚀 Start Development in 5 Minutes

### Terminal 1 - Backend
```bash
cd c:\Users\pc\GestionAstreinte\backend
php artisan serve
```
✅ Backend runs on `http://localhost:8000`

### Terminal 2 - Frontend
```bash
cd c:\Users\pc\GestionAstreinte\frontend
npm run dev
```
✅ Frontend runs on `http://localhost:3000`

### Login Credentials
```
Email: admin@gestion-astreintes.local
Password: password
```

---

## 📂 Project Structure at a Glance

```
backend/
├── app/Models/              # Database models
├── app/Http/Controllers/    # API endpoints
├── database/migrations/     # Database schema
└── routes/api.php          # API routes

frontend/
├── src/pages/              # Page components
├── src/components/         # Reusable components
├── src/store/              # State management
└── src/App.jsx             # Main app
```

---

## 🔗 Important Files

### Backend
- **database/migrations/** - Define table structure
- **app/Models/** - Database models
- **routes/api.php** - All API endpoints
- **database/seeders/DatabaseSeeder.php** - Initial data

### Frontend
- **src/App.jsx** - Main routing
- **src/store/** - State management
- **src/pages/** - Page components
- **tailwind.config.js** - Styling configuration

---

## 🛠️ Common Commands

### Backend (Laravel)
```bash
cd backend

# Generate migration
php artisan make:migration create_table_name

# Create model
php artisan make:model ModelName

# Create controller
php artisan make:controller Api/ControllerName

# Run database migrations
php artisan migrate

# Reset database with seeds
php artisan migrate:fresh --seed

# Run the server
php artisan serve

# Access Laravel Tinker
php artisan tinker
```

### Frontend (React/Vite)
```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔌 API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register
Body: { name, email, password, password_confirmation, service_id }

# Login
POST /api/auth/login
Body: { email, password }

# Get token from response and use:
Authorization: Bearer {token}
```

### Main Endpoints
```
GET    /api/services           # List all services
POST   /api/services           # Create service
PUT    /api/services/{id}      # Update service
DELETE /api/services/{id}      # Delete service

GET    /api/agents             # List agents
POST   /api/agents             # Create agent
PUT    /api/agents/{id}        # Update agent
DELETE /api/agents/{id}        # Delete agent

GET    /api/schedules/weekly   # Get weekly schedule
POST   /api/schedules/generate-rotation  # Auto-generate

POST   /api/agents/{id}/unavailability   # Declare unavailable
```

---

## 🎯 Common Tasks

### Add New API Endpoint

1. **Create Method in Controller**
```php
// app/Http/Controllers/Api/ExampleController.php
public function newMethod(Request $request) {
    // Your logic here
    return response()->json($data);
}
```

2. **Add Route**
```php
// routes/api.php
Route::post('/example', [ExampleController::class, 'newMethod']);
```

3. **Call from Frontend**
```javascript
// src/store/exampleStore.js
const response = await fetch('/api/example', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Add New React Page

1. **Create Component**
```jsx
// src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page Content</div>
}
```

2. **Add Route**
```jsx
// src/App.jsx
<Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```

3. **Add Navigation Link**
```jsx
// src/components/Navbar.jsx
<Link to="/new-page">New Page</Link>
```

---

## 🐛 Debugging Tips

### Backend
```bash
# Check Laravel logs
tail storage/logs/laravel.log

# Use Tinker to test
php artisan tinker
> User::all();
> User::find(1)->agent;
```

### Frontend
```javascript
// Use browser DevTools
console.log('Debug:', data);

// Check network tab for API calls
// Check Application tab for localStorage (token)
```

---

## 📊 Database Schema Quick Reference

```sql
-- Main tables
users                   -- User accounts with roles
services                -- Services/departments
agents                  -- Agents linked to users
schedules               -- On-call schedules
unavailabilities        -- Days when agents are unavailable

-- Key relationships
User → Service (foreign key: service_id)
Agent → User (many-to-one)
Agent → Service (many-to-one)
Schedule → Agent (many-to-one)
Unavailability → Agent (many-to-one)
```

---

## 🎨 Styling (Tailwind CSS)

### Common Classes
```jsx
// Flexbox
<div className="flex justify-center items-center">

// Spacing
<div className="p-4 m-2">  {/* padding & margin */}

// Colors
<button className="bg-blue-600 text-white">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Borders & Shadows
<div className="border rounded-lg shadow-lg">
```

---

## ✅ Testing Checklist

- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can view dashboard
- [ ] Can see schedules
- [ ] Can declare unavailability
- [ ] Secretaries can manage agents
- [ ] Admins can manage services
- [ ] Logout works
- [ ] Unauthorized users see error
- [ ] Mobile layout is responsive

---

## 🚀 Deployment Checklist

- [ ] Update .env for production
- [ ] Run `php artisan config:cache`
- [ ] Run `npm run build` for frontend
- [ ] Set up HTTPS/SSL
- [ ] Configure mail server
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Load test the application

---

## 📞 Useful Links

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind Docs: https://tailwindcss.com
- Zustand Docs: https://github.com/pmndrs/zustand
- Sanctum Docs: https://laravel.com/docs/sanctum

---

## 🎓 Learning Resources

1. Laravel API Development patterns
2. React hooks and functional components
3. State management with Zustand
4. RESTful API best practices
5. Database design and relationships
6. Authentication workflows

---

**Last Updated**: April 14, 2026
