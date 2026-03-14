import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../store/AuthContext';

const CourseRegistration = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { user } = useAuth();

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            setErrorMsg('Failed to load courses');
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return;

        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const { data } = await api.post(`/courses/${selectedCourse}/enroll`);
            setSuccessMsg(data.message);
            setSelectedCourse('');
            fetchCourses(); // refresh available seats
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = async (courseId, courseName) => {
        if (!window.confirm(`Are you sure you want to drop ${courseName}?`)) return;

        setErrorMsg('');
        setSuccessMsg('');

        try {
            const { data } = await api.post(`/courses/${courseId}/drop`);
            setSuccessMsg(data.message);
            fetchCourses();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to drop course');
        }
    };

    // Filter courses the student is already enrolled in
    const myCourses = courses.filter(course => course.enrolledStudents.includes(user?._id));
    const availableCourses = courses.filter(course => !course.enrolledStudents.includes(user?._id));

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Course Registration</h2>
                <p style={{ color: 'var(--text-muted)' }}>Select a course to enroll for the upcoming semester</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>

                {/* Registration Form */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    {errorMsg && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <AlertCircle size={20} /> {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label>Available Courses</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a course...</option>
                                {availableCourses.map(course => (
                                    <option
                                        key={course._id}
                                        value={course._id}
                                        disabled={course.availableSeats <= 0}
                                    >
                                        {course.courseId} - {course.name} ({course.credits} Credits) - {course.availableSeats > 0 ? `${course.availableSeats} seats left` : 'FULL'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                            disabled={isLoading || !selectedCourse}
                        >
                            {isLoading ? 'Processing Registration...' : 'Register for Course'}
                        </button>
                    </form>

                    {successMsg && (
                        <div className="animate-fade-in" style={{
                            marginTop: '1.5rem', padding: '1rem', borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)',
                            color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.8rem'
                        }}>
                            <CheckCircle size={20} />
                            {successMsg}
                        </div>
                    )}
                </div>

                {/* Info Panel */}
                <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(59, 130, 246, 0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <BookOpen size={20} color="var(--primary)" /> Registration Guidelines
                    </h3>
                    <ul style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.2rem' }}>
                        <li>Students can register for a maximum of 5 courses per semester.</li>
                        <li>Registration is confirmed immediately if seats are available.</li>
                        <li>Once registered, course withdrawal must be done through the administrator.</li>
                        <li>Library borrowing limits are increased for core subjects.</li>
                    </ul>
                </div>

                {/* My Courses Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Your Enrolled Courses
                    </h3>

                    {myCourses.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>You are not currently enrolled in any courses.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myCourses.map(course => (
                                <div key={course._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.3rem 0' }}>{course.courseId} - {course.name}</h4>
                                        <span className="badge badge-secondary" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>{course.credits} Credits</span>
                                    </div>
                                    <button
                                        onClick={() => handleDrop(course._id, course.name)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                                    >
                                        Drop Course
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default CourseRegistration;
