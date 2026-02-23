import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiBooks } from "../api";
import "../CSS/Login.css"; // Move styles to separate CSS file

function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  // Get logged in user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setLoggedUser(payload.sub);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await apiBooks.get("getBooks");
        setBooks(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate]);

  // Get stock status with color coding
  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: "Out of Stock", color: "#dc3545", class: "out-of-stock" };
    if (stock < 5) return { text: "Low Stock", color: "#fd7e14", class: "low-stock" };
    return { text: "In Stock", color: "#28a745", class: "in-stock" };
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend?.toLowerCase()) {
      case "up": return "↑";
      case "down": return "↓";
      default: return "→";
    }
  };

  // Loading state
  if (loading) {
    return (
        <div className="books-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="books-container">
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="books-container">
        {/* Header Section */}
        <header className="books-header">
          <div className="header-content">
            <h1 className="page-title">
              Welcome back{loggedUser ? `, ${loggedUser}` : ""}!
            </h1>
            <p className="book-count">{books.length} books available</p>
          </div>

          <div className="header-actions">
            <Link to="/borrow" className="btn btn-primary">
              Borrow Book
            </Link>
            <Link to="/my-borrowed" className="btn btn-secondary">
              My Borrowed Books
            </Link>
          </div>
        </header>

        {/* Books Grid */}
        {books.length === 0 ? (
            <div className="empty-state">
              <p>No books found in the library.</p>
            </div>
        ) : (
            <div className="books-grid">
              {books.map((book) => {
                const stockStatus = getStockStatus(book.stock);
                const trendIcon = getTrendIcon(book.trend);

                return (
                    <article key={book.id} className="book-card">
                      <div className="card-header">
                        <span className="book-id">#{book.id}</span>
                        <span className={`stock-badge ${stockStatus.class}`}>
                    {stockStatus.text}
                  </span>
                      </div>

                      <h2 className="book-title">{book.name}</h2>

                      <div className="book-meta">
                        <span className="writer-label">By</span>
                        <span className="writer-name">{book.writer}</span>
                      </div>

                      <div className="book-stats">
                        <div className="stat">
                          <span className="stat-label">Stock</span>
                          <span className="stat-value">
                      {book.stock > 0 ? book.stock : "0"}
                    </span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Trend</span>
                          <span className="stat-value">
                      {trendIcon} {book.trend || "stable"}
                    </span>
                        </div>
                      </div>

                      <Link to={`/books/${book.id}`} className="book-link">
                        View Details →
                      </Link>
                    </article>
                );
              })}
            </div>
        )}
      </div>
  );
}

export default Books;