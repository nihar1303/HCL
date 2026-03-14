import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ courseId: '', name: '', credits: '', seats: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses catalog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ courseId: '', name: '', credits: '', seats: '' });
        setIsModalOpen(true);
    };

    const saveCourse = async () => {
        try {
            if (editingId) {
                await api.put(`/courses/${editingId}`, formData);
                alert('Course successfully updated!');
            } else {
                await api.post('/courses', formData);
                alert('Course successfully added to catalog!');
            }
            setIsModalOpen(false);
            fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save course');
        }
    };

    const deleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                alert('Course successfully deleted.');
                fetchCourses();
            } catch (error) {
                alert('Failed to delete course');
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="flex-between">
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Manage Courses</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Add, Edit, or Remove registration courses</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={18} /> Add New Course
                </button>
            </div>

            <div className="table-container glass-panel">
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Name</th>
                            <th>Credits</th>
                            <th>Available Seats / Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr> : courses.map(course => (
                            <tr key={course._id}>
                                <td style={{ fontWeight: '500' }}>{course.courseId}</td>
                                <td>{course.name}</td>
                                <td><span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.05)' }}>{course.credits}</span></td>
                                <td>
                                    <span className={`badge ${course.availableSeats > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {course.availableSeats > 0 ? `${course.availableSeats} / ${course.seats}` : 'FULL'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem', border: 'none', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}
                                            onClick={() => {
                                                setEditingId(course._id);
                                                setFormData({ courseId: course.courseId, name: course.name, credits: course.credits, seats: course.seats });
                                                setIsModalOpen(true);
                                            }}
                                            title="Edit Course"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                                            onClick={() => deleteCourse(course._id)}
                                            title="Delete Course"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#0f172a' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
                        <div className="input-group">
                            <label>Course ID (e.g. CS101)</label>
                            <input type="text" placeholder="CS101" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Course Name</label>
                            <input type="text" placeholder="Intro to Programming" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Credits</label>
                                <input type="number" placeholder="4" value={formData.credits} onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="input-group">
                                <label>Total Seats</label>
                                <input type="number" placeholder="30" value={formData.seats} onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div className="flex-between" style={{ marginTop: '2rem' }}>
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveCourse}>Save Course</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageCourses;
