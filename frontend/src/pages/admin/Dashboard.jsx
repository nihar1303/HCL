import React, { useState, useEffect } from 'react';
import { Users, Library, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        books: 0,
        students: 0,
        borrows: 0,
        overdues: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [booksRes, borrowsRes] = await Promise.all([
                    api.get('/books'),
                    api.get('/borrows')
                ]);

                const activeBorrows = borrowsRes.data.filter(b => b.status !== 'Returned');
                const overdueBorrows = borrowsRes.data.filter(b => b.status === 'Overdue' || (new Date(b.dueDate) < new Date() && b.status !== 'Returned'));

                // This is a proxy since we don't have a GET /users route for students explicitly
                const uniqueStudents = new Set(borrowsRes.data.map(b => b.student?._id)).size;

                setStats({
                    books: booksRes.data.length,
                    students: uniqueStudents, // Estimate based on borrows
                    borrows: activeBorrows.length,
                    overdues: overdueBorrows.length
                });
            } catch (error) {
                console.error('Failed to load dashboard stats');
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="flex-between">
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
                        Administrator Dashboard
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Overview of library system statistics</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                        <Library size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Total Books Cataloged</p>
                        <h3 style={{ fontSize: '1.8rem' }}>{stats.books}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Active Readers</p>
                        <h3 style={{ fontSize: '1.8rem' }}>{stats.students}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Active Borrows</p>
                        <h3 style={{ fontSize: '1.8rem' }}>{stats.borrows}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Overdue Returns</p>
                        <h3 style={{ fontSize: '1.8rem', color: 'var(--danger)' }}>{stats.overdues}</h3>
                    </div>
                </div>

            </div>

            {/* Quick Actions */}
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                    <Link to="/admin/books" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '0.8rem', borderRadius: '10px' }}><Library size={24} color="var(--primary)" /></div>
                        <div>
                            <h4 style={{ marginBottom: '0.2rem' }}>Manage Books</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add, edit or remove books</p>
                        </div>
                    </Link>

                    <Link to="/admin/courses" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '0.8rem', borderRadius: '10px' }}><BookOpen size={24} color="var(--primary)" /></div>
                        <div>
                            <h4 style={{ marginBottom: '0.2rem' }}>Manage Courses</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add, edit or remove courses</p>
                        </div>
                    </Link>

                    <Link to="/admin/borrows" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '0.8rem', borderRadius: '10px' }}><BookOpen size={24} color="var(--secondary)" /></div>
                        <div>
                            <h4 style={{ marginBottom: '0.2rem' }}>Borrow Tracker</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Track active library borrows</p>
                        </div>
                    </Link>

                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
