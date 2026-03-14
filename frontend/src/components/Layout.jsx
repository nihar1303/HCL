import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

const Layout = ({ allowedRole }) => {
    const { user, logout } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'administrator' ? '/admin' : '/student'} replace />;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navbar */}
            <nav
                style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--glass-border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}
            >
                <div className="container flex-between" style={{ height: '70px' }}>

                    <div className="flex-center" style={{ gap: '0.8rem' }}>
                        <div className="flex-center" style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
                        }}>
                            <BookOpen size={20} color="white" />
                        </div>
                        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>LMS Portal</h1>
                    </div>

                    <div className="flex-center" style={{ gap: '1.5rem' }}>
                        <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <UserIcon size={18} />
                            <span style={{ fontSize: '0.9rem' }}>
                                {user.email} <strong style={{ color: 'var(--text-color)' }}>({user.role})</strong>
                            </span>
                        </div>

                        <button
                            onClick={logout}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                </div>
            </nav>

            {/* Main Content Area */}
            <main className="container" style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                padding: '1.5rem', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '0.85rem',
                borderTop: '1px solid var(--border)',
                marginTop: 'auto'
            }}>
                Library Management System &copy; {new Date().getFullYear()}
            </footer>

        </div>
    );
};

export default Layout;
