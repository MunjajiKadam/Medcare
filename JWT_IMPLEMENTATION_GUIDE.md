# JWT (JSON Web Token) Implementation Guide

## Overview
MedCare uses JWT for secure authentication and authorization. This guide documents the complete JWT implementation across the application.

---

## Backend JWT Implementation

### 1. **JWT Generation** (`backend/controllers/authController.js`)

#### Registration
```javascript
const token = jwt.sign(
  { id: userId, email, role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### Login
```javascript
const token = jwt.sign(
  { id: userData.id, email: userData.email, role: userData.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

**Token Payload:**
- `id`: User ID from database
- `email`: User email address
- `role`: User role (patient, doctor, admin)
- `expiresIn`: 7 days (604800 seconds)

### 2. **JWT Verification** (`backend/middleware/authMiddleware.js`)

#### Authentication Middleware
```javascript
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

#### Role-Based Authorization Middleware
```javascript
export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};
```

### 3. **Protected Routes Example**

#### Doctor Routes
```javascript
router.get('/:id', getDoctorById);  // Public
router.put('/admin/:id', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  updateDoctorProfile
);  // Protected - Admin only
```

#### Appointment Routes
```javascript
router.post('/', authMiddleware, createAppointment);  // Protected - Any authenticated user
router.get('/', authMiddleware, getAppointments);     // Protected - Authenticated user
```

---

## Frontend JWT Implementation

### 1. **Token Storage** (`frontend/src/Authcontext/AuthContext.jsx`)

```javascript
const login = async (email, password, userType) => {
  const response = await axios.post("/auth/login", {
    email,
    password,
    role: userType,
  });

  const { token, user: userData } = response.data;

  setUser(userData);
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));

  return userData;
};
```

**Storage Locations:**
- `localStorage.getItem('token')` - JWT token
- `localStorage.getItem('user')` - User data (JSON)

### 2. **Token Inclusion in Requests** (`frontend/src/api/axios.js`)

```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Format:** `Authorization: Bearer <token>`

### 3. **Token Expiration Handling** (`frontend/src/api/axios.js`)

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Auto-Logout on 401 Unauthorized**

---

## Environment Configuration

### Backend `.env` File
```
JWT_SECRET=your_very_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
```

### Security Best Practices
1. ✅ Store JWT_SECRET in environment variables (never hardcode)
2. ✅ Use strong, random JWT_SECRET (minimum 32 characters)
3. ✅ Set appropriate expiration time (7 days for web apps)
4. ✅ Use HTTPS in production to protect tokens in transit
5. ✅ Store tokens in localStorage (accessible by JS) or sessionStorage (cleared on browser close)

---

## User Flow with JWT

### Registration Flow
```
1. User fills registration form
2. POST /api/auth/register with credentials
3. Backend:
   - Hash password with bcrypt
   - Create user record
   - Generate JWT token (7d expiry)
4. Return token + user data
5. Frontend stores token in localStorage
6. Redirect to dashboard
```

### Login Flow
```
1. User enters email/password
2. POST /api/auth/login with credentials
3. Backend:
   - Verify email + role exists
   - Compare password with bcrypt
   - Check user status is 'active'
   - Generate JWT token (7d expiry)
4. Return token + user data
5. Frontend stores token in localStorage
6. All subsequent requests include token in Authorization header
```

### Protected Request Flow
```
1. User performs action (fetch data, create appointment, etc.)
2. Frontend interceptor adds token to Authorization header
3. Backend authMiddleware extracts and verifies token
4. If valid: req.user is populated, request proceeds
5. If invalid/expired: 401 response → logout user
```

---

## Token Claims (JWT Payload)

```javascript
{
  "id": 5,
  "email": "patient@example.com",
  "role": "patient",
  "iat": 1706808000,      // Issued at
  "exp": 1707412800       // Expires at (7 days later)
}
```

---

## Logout Flow

```javascript
const handleLogout = () => {
  logout();  // Call auth context logout
  navigate("/login");
};

// In AuthContext
const logout = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
  setUser(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
```

---

## API Endpoints with JWT

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login user |
| POST | `/api/auth/logout` | ✅ Yes | Logout user |

### Protected Endpoints Example

| Method | Endpoint | Auth Required | Roles |
|--------|----------|---------------|-------|
| GET | `/api/appointments` | ✅ Yes | patient, doctor, admin |
| POST | `/api/appointments` | ✅ Yes | patient, doctor, admin |
| PUT | `/api/doctors/admin/:id` | ✅ Yes | admin only |
| GET | `/api/patients/profile` | ✅ Yes | patient only |

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token, session expired |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Backend error |

---

## Security Checklist

- ✅ JWT tokens are signed with SECRET key
- ✅ Tokens expire after 7 days
- ✅ Tokens included in Authorization header as `Bearer <token>`
- ✅ Invalid tokens trigger automatic logout
- ✅ Role-based access control enforced on backend
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ User status checked before token generation
- ✅ Sensitive data (password) never included in token

---

## Token Refresh (Future Implementation)

For production, consider implementing refresh tokens:

```javascript
// Generate both tokens on login
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

// Refresh endpoint to get new access token using refresh token
POST /api/auth/refresh
- Input: refreshToken
- Output: new accessToken
```

---

## Troubleshooting

### Issue: "No token provided"
- **Cause:** User not logged in or token cleared
- **Solution:** Redirect to login page

### Issue: "Invalid token"
- **Cause:** Token corrupted or JWT_SECRET mismatch
- **Solution:** Check JWT_SECRET in .env matches backend

### Issue: "Access denied: Insufficient permissions"
- **Cause:** User role doesn't match endpoint requirements
- **Solution:** Verify user role and endpoint restrictions

### Issue: Automatic logout happening
- **Cause:** Token expired (7 days) or unauthorized response
- **Solution:** Redirect to login and request fresh token

---

## Configuration Summary

- **JWT Algorithm:** HS256 (HMAC SHA-256)
- **Token Format:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Expiration:** 7 days (604,800 seconds)
- **Storage:** localStorage (frontend)
- **Transport:** Authorization header with Bearer scheme
- **Verification:** Required for all protected endpoints

---

**Last Updated:** February 2, 2026
**Status:** ✅ Production Ready
