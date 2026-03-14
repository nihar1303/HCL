import React, { useState, useEffect } from 'react';
import { Users, Library, BookOpen, AlertCircle, UserCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        books: 0,
        students: 0,
        borrows: 0,
        overdues: 0
    });
    const [pendingStudents, setPendingStudents] = useState([]);

    const fetchStatsAndUsers = async () => {
        try {
            const [booksRes, borrowsRes, usersRes] = await Promise.all([
                api.get('/books'),
                api.get('/borrows'),
                api.get('/users')
            ]);

            const activeBorrows = borrowsRes.data.filter(b => b.status !== 'Returned');
            const overdueBorrows = borrowsRes.data.filter(b => b.status === 'Overdue' || (new Date(b.dueDate) < new Date() && b.status !== 'Returned'));

            const uniqueStudents = new Set(borrowsRes.data.map(b => b.student?._id)).size;

            setStats({
                books: booksRes.data.length,
                students: uniqueStudents,
                borrows: activeBorrows.length,
                overdues: overdueBorrows.length
            });

            const pending = usersRes.data.filter(u => u.status === 'Pending');
            setPendingStudents(pending);
        } catch (error) {
            console.error('Failed to load dashboard data');
        }
    };

    useEffect(() => {
        fetchStatsAndUsers();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/users/${id}`, { status: newStatus });
            alert(`Successfully approved student`);
            fetchStatsAndUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to completely remove this student account request?')) {
            try {
                await api.delete(`/users/${id}`);
                alert('Student request successfully removed.');
                fetchStatsAndUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

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

            {/* Pending Approvals Section (Facebook-style) */}
            {pendingStudents.length > 0 && (
                <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={20} className="text-primary" />
                        Student Account Requests
                        <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>
                            {pendingStudents.length}
                        </span>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {pendingStudents.map(student => (
                            <div key={student._id} style={{ 
                                padding: '1rem', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        width: '50px', 
                                        height: '50px', 
                                        borderRadius: '50%', 
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{student.name}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{student.email}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ flex: 1, padding: '0.5rem' }}
                                        onClick={() => handleStatusChange(student._id, 'Active')}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        className="btn btn-secondary" 
                                        style={{ flex: 1, padding: '0.5rem' }}
                                        onClick={() => handleDelete(student._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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

                    <Link to="/admin/students" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                        <div style={{ background: 'var(--glass-bg)', padding: '0.8rem', borderRadius: '10px' }}><Users size={24} color="var(--primary)" /></div>
                        <div>
                            <h4 style={{ marginBottom: '0.2rem' }}>Manage Students</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Approve, suspend, or remove users</p>
                        </div>
                    </Link>

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

export default AdminDashboard;;
