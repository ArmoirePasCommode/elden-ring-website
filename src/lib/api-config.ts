/**
 * API Base URL configuration
 * 
 * In development (vite), this falls back to a relative path '/api' which is proxied.
 * In production, if VITE_API_URL is set, it uses that (pointing to AWS backend).
 * Otherwise it falls back to '/api' (useful if served from same origin).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
