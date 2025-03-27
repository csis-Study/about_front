// src/utils/auth.js
import jwtDecode from 'jwt-decode';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}
