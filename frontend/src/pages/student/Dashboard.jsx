import React, { useState, useEffect } from 'react';
import { BookMarked, CreditCard, CalendarClock, BookOpen } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [dueAmount, setDueAmount] = useState(0);

    useEffect(() => {
        const fetchMyBorrows = async () => {
            try {
                const { data } = await api.get('/borrows/my');
                setBorrowedBooks(data.filter(b => b.status !== 'Returned'));

                // Calculate mock due amount (₹50 per overdue item)
                const overdueCount = data.filter(b => b.status === 'Overdue').length;
                setDueAmount(overdueCount * 50);

            } catch (error) {
                console.error('Failed to load user borrows');
            }
        };
        fetchMyBorrows();
    }, []);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header section with Action Links */}
            <div className="flex-between">
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
                        Welcome, <span className="gradient-text">{user?.name || 'Student'}</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Here is your library activity overview</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/student/courses" className="btn btn-secondary">
                        <BookOpen size={18} /> Course Registration
                    </Link>
                    <Link to="/student/books" className="btn btn-primary">
                        <BookMarked size={18} /> Browse Catalog
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                        <BookMarked size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Books Borrowed</p>
                        <h3 style={{ fontSize: '1.8rem' }}>{borrowedBooks.length}</h3>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', border: dueAmount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }}>
                    <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Total Due Amount</p>
                        <h3 style={{ fontSize: '1.8rem', color: dueAmount > 0 ? 'var(--danger)' : 'var(--text-color)' }}>
                            ₹{dueAmount}
                        </h3>
                        {dueAmount > 0 ?
                            <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>Please pay fine at library desk</span> :
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No outstanding dues</span>
                        }
                    </div>
                </div>

            </div>

            {/* Currently Borrowed Books Table */}
            <div>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarClock size={20} color="var(--secondary)" /> My Active Books
                </h3>
                <div className="table-container glass-panel">
                    <table>
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Return Deadline</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map((record) => {
                                const isOverdue = new Date(record.dueDate) < new Date() && record.status !== 'Returned';
                                const status = isOverdue ? 'Overdue' : record.status;
                                return (
                                    <tr key={record._id}>
                                        <td style={{ fontWeight: '500' }}>{record.book?.title}</td>
                                        <td>{record.book?.author}</td>
                                        <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-success'}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {borrowedBooks.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        You have no active borrowed books.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;
