import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', author: '', category: '', stock: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/books');
            setBooks(data);
        } catch (error) {
            console.error('Failed to load books catalog');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ title: '', author: '', category: '', stock: '' });
        setIsModalOpen(true);
    };

    const saveBook = async () => {
        try {
            if (editingId) {
                await api.put(`/books/${editingId}`, formData);
                alert('Book successfully updated!');
            } else {
                await api.post('/books', formData);
                alert('Book successfully added to catalog!');
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save book');
        }
    };

    const deleteBook = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await api.delete(`/books/${id}`);
                alert('Book successfully deleted.');
                fetchBooks();
            } catch (error) {
                alert('Failed to delete book');
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div className="flex-between">
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Manage Books Library</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Add, update, or remove books from the system</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={18} /> Add New Book
                </button>
            </div>

            <div className="table-container glass-panel">
                <table>
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr> : books.map(book => (
                            <tr key={book._id}>
                                <td style={{ fontWeight: '500' }}>{book.title}</td>
                                <td>{book.author}</td>
                                <td><span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.05)' }}>{book.category}</span></td>
                                <td>
                                    <span className={`badge ${book.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {book.stock > 0 ? `${book.stock} left` : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem', border: 'none', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}
                                            onClick={() => {
                                                setEditingId(book._id);
                                                setFormData({ title: book.title, author: book.author, category: book.category, stock: book.stock });
                                                setIsModalOpen(true);
                                            }}
                                            title="Edit Book"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.4rem', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}
                                            onClick={() => deleteBook(book._id)}
                                            title="Delete Book"
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
                        <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
                        <div className="input-group">
                            <label>Title</label>
                            <input type="text" placeholder="Book Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Author</label>
                            <input type="text" placeholder="Book Author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                        </div>
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Category</label>
                                <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Stock</label>
                                <input type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                        <div className="flex-between" style={{ marginTop: '2rem' }}>
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveBook}>Save Book</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageBooks;
