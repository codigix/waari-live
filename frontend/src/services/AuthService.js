import axios from 'axios';
import swal from 'sweetalert';

// Environment Variables
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY || '';
const API_BASE = import.meta.env.VITE_API_BASE;

/* =========================
   Firebase Auth Functions
   ========================= */

// Firebase Sign Up
export function signUp(email, password) {
  const data = { email, password, returnSecureToken: true };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    data
  );
}

// Firebase Login
export function firebaseLogin(email, password) {
  const data = { email, password, returnSecureToken: true };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    data
  );
}

/* =========================
   Local Backend Login
   ========================= */
export function localLogin(email, password) {
  return axios.post(`${API_BASE}/user-login`, { email, password });
}

/* =========================
   Error Formatter
   ========================= */
export function formatError(error) {
  const errorMsg = error?.response?.data?.error?.message || '';
  switch (errorMsg) {
    case 'EMAIL_EXISTS':
      swal('Oops', 'Email already exists', 'error');
      break;
    case 'EMAIL_NOT_FOUND':
      swal('Oops', 'Email not found', 'error', { button: 'Try Again!' });
      break;
    case 'INVALID_PASSWORD':
      swal('Oops', 'Invalid Password', 'error', { button: 'Try Again!' });
      break;
    case 'USER_DISABLED':
      swal('Oops', 'User account is disabled', 'error');
      break;
    default:
      swal('Error', 'Something went wrong', 'error');
  }
}

/* =========================
   Token Management
   ========================= */
export function saveToken(tokenDetails) {
  tokenDetails.expireDate = new Date(
    new Date().getTime() + tokenDetails.expiresIn * 1000
  );
  localStorage.setItem('token', JSON.stringify(tokenDetails));
}

export function logout(navigate) {
  localStorage.clear();
  navigate('/login');
}

export function runLogoutTimer(timer, navigate) {
  setTimeout(() => logout(navigate), timer);
}

export function checkAutoLogin(navigate) {
  const tokenString = localStorage.getItem('token');
  if (!tokenString) {
    navigate('/login');
    return;
  }

  if (location.pathname.includes('/login')) {
    navigate('/dashboard');
  }
}
