import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, SwitchCamera, Search, Plus, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', status: 'Active' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/users');
            setStudents(data);
        } catch (error) {
            console.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/users/${id}`, { status: newStatus });
            alert(`Successfully updated student status to ${newStatus}`);
            fetchStudents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to completely remove this student account?')) {
            try {
                await api.delete(`/users/${id}`);
                alert('Student successfully removed.');
                fetchStudents();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/users', { ...formData, role: 'student' });
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', status: 'Active' });
            alert('Student added successfully!');
            fetchStudents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add student');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="flex-between">
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Manage Students</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Review registrations, approve accounts, and manage access</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Student
                </button>
            </div>

            {/* Search and Filter */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem', margin: 0 }}
                    />
                </div>
            </div>

            {/* Pending Approvals Section (Facebook-style) */}
            {!loading && filteredStudents.filter(s => s.status === 'Pending').length > 0 && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={20} className="text-primary" />
                        Student Account Requests
                        <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>
                            {filteredStudents.filter(s => s.status === 'Pending').length}
                        </span>
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {filteredStudents.filter(s => s.status === 'Pending').map(student => (
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

            <div className="table-container glass-panel">
                <h3 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>All Students</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr> : filteredStudents.map(student => (
                            <tr key={student._id}>
                                <td style={{ fontWeight: '500' }}>{student.name}</td>
                                <td>{student.email}</td>
                                <td>
                                    <span className={`badge ${student.status === 'Active' ? 'badge-success' :
                                        student.status === 'Suspended' ? 'badge-danger' : 'badge-secondary'
                                        }`}>
                                        {student.status || 'Active'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {student.status === 'Pending' && (
                                            <button
                                                className="btn btn-secondary"
                                                title="Approve Registration"
                                                onClick={() => handleStatusChange(student._id, 'Active')}
                                                style={{ padding: '0.4rem', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
                                            >
                                                <UserCheck size={16} /> Approve
                                            </button>
                                        )}

                                        {student.status === 'Active' && (
                                            <button
                                                className="btn btn-secondary"
                                                title="Suspend Account"
                                                onClick={() => handleStatusChange(student._id, 'Suspended')}
                                                style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                                            >
                                                <UserX size={16} /> Suspend
                                            </button>
                                        )}

                                        {student.status === 'Suspended' && (
                                            <button
                                                className="btn btn-secondary"
                                                title="Reactivate Account"
                                                onClick={() => handleStatusChange(student._id, 'Active')}
                                                style={{ padding: '0.4rem', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}
                                            >
                                                <SwitchCamera size={16} /> Reactivate
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-secondary"
                                            title="Delete Account"
                                            onClick={() => handleDelete(student._id)}
                                            style={{ padding: '0.4rem', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No registered students found matching search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#0f172a' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New Student Account</h3>
                        <form onSubmit={handleAddStudent}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" required placeholder="john@student.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Temporary Password</label>
                                <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Initial Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="Active">Active (Auto-Approved)</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                            <div className="flex-between" style={{ marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageStudents;
