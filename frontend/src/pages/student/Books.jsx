import React, { useState, useEffect } from 'react';
import { BookMarked, IndianRupee, Calendar, Search } from 'lucide-react';
import api from '../../utils/api';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await api.get('/books');
                setBooks(data);
            } catch (error) {
                setErrorMsg('Failed to load books catalog');
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleBorrow = async (bookId) => {
        try {
            setErrorMsg('');
            await api.post('/borrows', { bookId });
            // Refresh books to update stock
            const { data } = await api.get('/books');
            setBooks(data);
            alert('Book borrowed successfully! It will appear in your dashboard.');
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Failed to borrow book');
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Library Catalog</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Browse and borrow available books</p>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--danger)' }}>
                    {errorMsg}
                </div>
            )}

            {/* Search and Filter */}
            <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem', margin: 0 }}
                    />
                </div>
                <button className="btn btn-primary">Filter</button>
            </div>

            {/* Books Table */}
            <div className="table-container glass-panel">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading catalog...</td></tr>
                        ) : filteredBooks.map((book) => (
                            <tr key={book._id}>
                                <td style={{ fontWeight: '500' }}>{book.title}</td>
                                <td>{book.author}</td>
                                <td><span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.05)' }}>{book.category}</span></td>
                                <td>
                                    {book.stock > 0 ? (
                                        <span className="badge badge-success">{book.stock} Available</span>
                                    ) : (
                                        <span className="badge badge-danger">Out of Stock</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                        disabled={book.stock <= 0}
                                        onClick={() => handleBorrow(book._id)}
                                    >
                                        Borrow
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && filteredBooks.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    No books found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Books;
