import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('lms_token');
            if (storedToken) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to authenticate token', error);
                    localStorage.removeItem('lms_token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (role, email, password) => {
        try {
            const { data } = await api.post('/auth/login', { role, email, password });

            const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
            setUser(userData);
            localStorage.setItem('lms_token', data.token);

            // Redirect based on role
            if (data.role === 'administrator') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (role, email, password, name) => {
        try {
            const { data } = await api.post('/auth/register', { role, email, password, name });

            const userData = { _id: data._id, name: data.name, email: data.email, role: data.role };
            setUser(userData);
            localStorage.setItem('lms_token', data.token);

            if (data.role === 'administrator') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lms_token');
        navigate('/login');
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '100vh', color: 'var(--primary)' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
