/**
 * Centralized API configuration for Ashiana Restaurant & Bakery
 * Supports:
 * 1. Local development (http://localhost:3000/api)
 * 2. Vercel deployment with /api rewrites or direct Render URL
 * 3. Runtime override via localStorage.setItem('ASHIANA_API_URL', 'https://your-backend.onrender.com/api')
 */

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // 1. Runtime override via localStorage
    const saved = localStorage.getItem('ASHIANA_API_URL');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }

    // 2. Global window configuration if injected
    const windowEnv = (window as any).__ENV__?.API_URL || (window as any).ASHIANA_API_URL;
    if (windowEnv && windowEnv.trim()) {
      return windowEnv.trim().replace(/\/+$/, '');
    }

    // 3. Localhost development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }

    // 4. Production on Vercel: default directly to your live Render backend
    return 'https://aashiyana-restaurent.onrender.com/api';
  }

  return 'http://localhost:3000/api';
}

export const API_URL = getApiBaseUrl();
