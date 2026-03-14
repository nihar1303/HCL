import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { BookOpen, KeyRound, Mail, UserCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const result = await login(role, email, password);
        if (!result.success) {
            setErrorMsg(result.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '1.5rem' }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="flex-center" style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.1)',
                        margin: '0 auto 1rem', border: '1px solid var(--primary)'
                    }}>
                        <BookOpen size={32} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to the library</p>
                </div>

                {errorMsg && (
                    <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger)', fontSize: '0.9rem' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Login As</label>
                        <div style={{ position: 'relative' }}>
                            <UserCircle size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            >
                                <option value="student">Student</option>
                                <option value="administrator">Administrator</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ fontWeight: '500' }}>Register here</Link>
                </div>

            </div>
        </div>
    );
};

export default Login;
