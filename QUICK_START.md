# Quick Start Guide - Gestion des Astreintes

## 🚀 5-Minute Setup

### 1. Database Setup
```bash
mysql -u root -p
CREATE DATABASE gestion_astreintes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```
DB_DATABASE=gestion_astreintes
DB_USERNAME=root
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

Then:
```bash
php artisan migrate
php artisan serve
```

### 3. Frontend  
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 4. Login
- Open http://localhost:5173/login
- Create user via API or register form
- Or use `php artisan tinker` to create admin user

---

## 📋 Key Features

✅ User authentication with JWT tokens
✅ Role-based access (Admin, Manager, Team Lead, Staff)
✅ Schedule management (create, publish, archive)
✅ Shift assignment to team members
✅ Availability tracking
✅ Shift handover system
✅ Alert management
✅ Responsive dashboard UI

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Laravel Serve | http://localhost:8000 |

---

## 📚 Documentation

- Full setup: [SETUP.md](./SETUP.md)
- API docs: [API.md](./API.md)
- How to use: [README.md](./README.md)

---

## 🆘 Common Issues

**401 Unauthorized**
- Clear localStorage (`localStorage.clear()` in browser console)
- Make sure `SANCTUM_STATEFUL_DOMAINS` is set in `.env`

**CORS Error**
- Check `VITE_API_URL` in frontend `.env.local`
- Ensure backend URL is correct

**Database Error**
- Verify MySQL is running
- Check DB credentials in `.env`
- Run `php artisan migrate`

---

## 📝 Create First User

```bash
cd backend
php artisan tinker
```

```php
User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'is_active' => true
]);
```

Then login with these credentials in the UI.

---

## Next Steps

1. ✅ Both servers running
2. ✅ Database created
3. ✅ User created
4. 📅 Create your first schedule
5. 📋 Add shifts to the schedule
6. 👥 Assign team members

**Happy managing! 🎉**
