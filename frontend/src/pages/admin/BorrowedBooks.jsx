import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Send } from 'lucide-react';
import api from '../../utils/api';

const BorrowedBooks = () => {
    const [borrows, setBorrows] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBorrows = async () => {
        try {
            const { data } = await api.get('/borrows');
            setBorrows(data);
        } catch (error) {
            console.error('Failed to load borrows');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrows();
    }, []);

    const handleReturn = async (id) => {
        try {
            if (window.confirm('Mark this book as returned and un-assign it?')) {
                await api.put(`/borrows/${id}/return`);
                alert('Book successfully marked as returned.');
                fetchBorrows();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to process return');
        }
    };

    const handleSendReminder = async (studentEmail) => {
        alert(`Mock Notification: Overdue reminder email sent to ${studentEmail}`);
    };

    const handleSimulateOverdue = async (id) => {
        try {
            if (window.confirm('Simulate overdue status for testing purposes?')) {
                await api.put(`/borrows/${id}/simulate-overdue`);
                alert('Success: Book marked as 5 days overdue.');
                fetchBorrows();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to simulate overdue');
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Borrow Tracker</h2>
                <p style={{ color: 'var(--text-muted)' }}>Monitor currently borrowed books and track overdues</p>
            </div>

            <div className="table-container glass-panel">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Book Title</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading tracking data...</td></tr> : borrows.map(borrow => {
                            const isOverdue = new Date(borrow.dueDate) < new Date() && borrow.status !== 'Returned';
                            const isReturned = borrow.status === 'Returned';

                            return (
                                <tr key={borrow._id}>
                                    <td style={{ fontWeight: '500' }}>{borrow.student?.name}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{borrow.student?.email}</td>
                                    <td>{borrow.book?.title}</td>
                                    <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                                    <td style={{ color: isOverdue ? 'var(--danger)' : 'inherit', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                                        {new Date(borrow.dueDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge ${isReturned ? 'badge-success' :
                                            isOverdue ? 'badge-danger' : 'badge-primary'
                                            }`}>
                                            {isOverdue ? 'Overdue' : borrow.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {!isReturned && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                                                    onClick={() => handleReturn(borrow._id)}
                                                >
                                                    <CheckCircle size={14} /> Mark Returned
                                                </button>
                                            )}

                                            {!isReturned && !isOverdue && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem', borderColor: 'var(--warning)', color: 'var(--warning)' }}
                                                    onClick={() => handleSimulateOverdue(borrow._id)}
                                                    title="Testing: Make Overdue"
                                                >
                                                    <AlertTriangle size={14} /> Simulate Overdue
                                                </button>
                                            )}

                                            {isOverdue && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', gap: '0.3rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                    title="Send Email Reminder"
                                                    onClick={() => handleSendReminder(borrow.student?.email)}
                                                >
                                                    <Send size={14} /> Ping
                                                </button>
                                            )}

                                            {isReturned && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completed</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {!loading && borrows.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No borrow records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default BorrowedBooks;
