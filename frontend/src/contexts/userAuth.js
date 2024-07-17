import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import userService from "@/services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userService.fetchUser(token)
                .then(data => setUser(data.user))
                .catch(() => {
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const data = await userService.login({ username, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            router.push('/dashboard');
        } catch (err) {
            console.error('Login Failed:', err);
        }
    };

    const logout = async () => {
        try {
            await userService.logout();
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout Failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
