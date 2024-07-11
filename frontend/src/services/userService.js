const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const login = async (userData) => {
    const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
    };
    const response = await fetch(`${API_URL}/login`, payload);
    if (!response.ok) { throw new Error('Login failed'); }
    return await response.json();
};

export const logout = async () => {
    const payload = { method: 'POST', credentials: 'include' };
    const response = await fetch(`${API_URL}/logout`, payload);
    if (!response.ok) { throw new Error('Logout failed'); }
    return await response.json();
};

export const register = async (userData) => {
    const payload = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
    };
    const response = await fetch(`${API_URL}/register`, payload);
    if (!response.ok) { throw new Error('Registration failed'); }
    return await response.json();
};

export default {
    login,
    logout,
    register
};