# AI Chat Boot - Authentication API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Sign Up / Sign In with Email (Verify Token)
**Endpoint:** `POST /api/auth/verify`

**Description:**
- Verifies Firebase ID token
- Creates new user if doesn't exist
- Updates existing user and logs them in
- Works for both email/password and Google sign-in

**Request Body:**
```json
{
  "idToken": "firebase-id-token-here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://...",
      "provider": "email" // or "google"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 2. Get Current User
**Endpoint:** `GET /api/auth/me`

**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://...",
      "provider": "email",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

### 3. Sign Out
**Endpoint:** `POST /api/auth/signout`

**Description:** Sign out user (primarily handled on client side)

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

### 4. Health Check
**Endpoint:** `GET /api/health`

**Description:** Check if API is running

**Success Response (200):**
```json
{
  "success": true,
  "message": "AI Chat Boot API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Frontend Integration Guide

### Using Firebase Client SDK (Frontend)

#### 1. Email/Password Sign Up
```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axios from 'axios';

const signUp = async (email, password, displayName) => {
  // 1. Create user in Firebase
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Get ID token
  const idToken = await userCredential.user.getIdToken();

  // 3. Send to backend to create user in MongoDB
  const response = await axios.post('http://localhost:5000/api/auth/verify', {
    idToken
  });

  return response.data;
};
```

#### 2. Email/Password Sign In
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const signIn = async (email, password) => {
  // 1. Sign in with Firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  // 2. Get ID token
  const idToken = await userCredential.user.getIdToken();

  // 3. Send to backend
  const response = await axios.post('http://localhost:5000/api/auth/verify', {
    idToken
  });

  return response.data;
};
```

#### 3. Google Sign In
```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  // 1. Sign in with Google popup
  const userCredential = await signInWithPopup(auth, provider);

  // 2. Get ID token
  const idToken = await userCredential.user.getIdToken();

  // 3. Send to backend
  const response = await axios.post('http://localhost:5000/api/auth/verify', {
    idToken
  });

  return response.data;
};
```

#### 4. Forgot Password
```javascript
import { sendPasswordResetEmail } from 'firebase/auth';

const forgotPassword = async (email) => {
  // Firebase handles password reset email
  await sendPasswordResetEmail(auth, email);

  // No backend call needed - Firebase handles this
};
```

#### 5. Making Authenticated Requests
```javascript
import { auth } from '@/lib/firebase';

const getProfile = async () => {
  // Get current user's token
  const idToken = await auth.currentUser?.getIdToken();

  // Make authenticated request
  const response = await axios.get('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data;
};
```

#### 6. Sign Out
```javascript
import { signOut } from 'firebase/auth';

const handleSignOut = async () => {
  // 1. Get token for backend call (optional)
  const idToken = await auth.currentUser?.getIdToken();

  // 2. Call backend signout (optional)
  await axios.post('http://localhost:5000/api/auth/signout', {}, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });

  // 3. Sign out from Firebase
  await signOut(auth);
};
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication Flow

### Sign Up Flow:
1. User fills registration form on frontend
2. Frontend calls Firebase `createUserWithEmailAndPassword()`
3. Firebase creates user and returns credentials
4. Frontend gets ID token from Firebase user
5. Frontend sends ID token to backend `/api/auth/verify`
6. Backend verifies token with Firebase Admin SDK
7. Backend creates user record in MongoDB
8. Backend returns user data
9. Frontend stores token and user data

### Sign In Flow:
1. User fills login form
2. Frontend calls Firebase `signInWithEmailAndPassword()`
3. Firebase authenticates and returns credentials
4. Frontend gets ID token
5. Frontend sends token to backend `/api/auth/verify`
6. Backend verifies and updates user's lastLoginAt
7. Backend returns user data

### Google Sign In Flow:
1. User clicks "Sign in with Google"
2. Frontend calls Firebase `signInWithPopup(GoogleAuthProvider)`
3. User completes Google OAuth
4. Firebase returns credentials
5. Frontend gets ID token
6. Frontend sends token to backend `/api/auth/verify`
7. Backend verifies, creates/updates user with provider="google"
8. Backend returns user data

---

## Testing with Postman/Thunder Client

### 1. Test Sign Up/Sign In
- You need a valid Firebase ID token from the frontend
- Cannot test directly without Firebase client SDK

### 2. Test with Firebase Emulator (Development)
```bash
firebase emulators:start --only auth
```

---

## Notes

- **Password Reset:** Handled entirely by Firebase on the frontend using `sendPasswordResetEmail()`
- **Token Refresh:** Firebase SDK automatically refreshes tokens
- **Session Management:** Store Firebase user in context/state on frontend
- **Security:** Always use HTTPS in production
- **Token Expiry:** Firebase tokens expire after 1 hour, SDK handles refresh
