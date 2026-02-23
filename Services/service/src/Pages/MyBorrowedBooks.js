import { useEffect, useState } from "react";
import {apiBooks, apiUsers} from "../api";
import { Link } from "react-router-dom";

function MyBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = () => {
    setLoading(true);
    apiBooks
        .get("/getbor")
        .then(res => {
          setBorrowedBooks(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load borrowed books");
          setLoading(false);
        });
  };

  const handleDelete = (borrowId) => {  // Changed parameter name for clarity
    if (window.confirm("Are you sure you want to return this book?")) {
      setDeleteLoading(borrowId);

      apiUsers
          .delete(`/borrows/${borrowId}`)
          .then((res) => {
            console.log("Deleting...", res.data);
            setBorrowedBooks(res.data);
            setDeleteLoading(null);
            alert("Deleted with borrowID " + borrowId);
          })
          .catch(() => {
            alert("Failed to return the book. Please try again.");
            setDeleteLoading(null);
          });
    }
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: "Overdue", color: "#dc3545" };
    if (daysLeft <= 3) return { text: "Due Soon", color: "#fd7e14" };
    return { text: "Active", color: "#28a745" };
  };

  if (loading) {
    return (
        <div style={styles.centerContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading borrowed books...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div style={styles.centerContainer}>
          <p style={{ color: "#dc3545" }}>{error}</p>
          <button onClick={fetchBorrowedBooks} style={styles.retryButton}>
            Try Again
          </button>
        </div>
    );
  }

  if (borrowedBooks.length === 0) {
    return (
        <div style={styles.centerContainer}>
          <p style={styles.emptyText}>No books have been borrowed yet.</p>
          <Link to="/" style={styles.browseButton}>Browse Books</Link>
        </div>
    );
  }

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Borrowed Books</h1>
          <p style={styles.subtitle}>{borrowedBooks.length} active borrowings</p>
        </div>

        <div style={styles.grid}>
          {borrowedBooks.map((book) => {
            const dueStatus = getDueDateStatus(book.returnDate);
            const bookId = book.bookId ;
            const id = book.id;
            const isDeleting = deleteLoading === bookId;

            return (
                <div key={id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.bookId}>#{bookId}</span>
                    <div style={styles.headerActions}>
                  <span style={{...styles.status, backgroundColor: dueStatus.color}}>
                    {dueStatus.text}
                  </span>
                      <button
                          onClick={() => handleDelete(id)}
                          disabled={isDeleting}
                          style={styles.deleteButton}
                          title="Return Book"
                      >
                        {isDeleting ? (
                            <span style={styles.deleteSpinner}></span>
                        ) : (
                            "×"
                        )}
                      </button>
                    </div>
                  </div>

                  <div style={styles.memberInfo}>
                    <span style={styles.memberLabel}>Member</span>
                    <span style={styles.memberId}>{book.memberId}</span>
                  </div>

                  <div style={styles.dateInfo}>
                    <div style={styles.dateRow}>
                      <span style={styles.dateLabel}>Borrowed</span>
                      <span style={styles.dateValue}>
                    {new Date(book.borrowDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                    </div>

                    <div style={styles.dateRow}>
                      <span style={styles.dateLabel}>Due Date</span>
                      <span style={{...styles.dateValue, color: dueStatus.color, fontWeight: 500}}>
                    {new Date(book.returnDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <Link to={`/books/${bookId}`} style={styles.viewButton}>
                      View Book Details →
                    </Link>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
  );
}

export default MyBorrowedBooks;

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh"
  },
  header: {
    marginBottom: "2rem",
    padding: "0 0.5rem"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 0.5rem 0",
    letterSpacing: "-0.02em"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6c757d",
    margin: 0
  },
  centerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease",
    border: "1px solid #e9ecef",
    position: "relative"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem"
  },
  bookId: {
    fontSize: "0.9rem",
    color: "#6c757d",
    fontWeight: "500"
  },
  status: {
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.02em"
  },
  deleteButton: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    fontSize: "1.5rem",
    lineHeight: "1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(220, 53, 69, 0.2)"
  },
  memberInfo: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.25rem"
  },
  memberLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#6c757d",
    marginBottom: "0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.02em"
  },
  memberId: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1a1a1a"
  },
  dateInfo: {
    marginBottom: "1.5rem"
  },
  dateRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #e9ecef"
  },
  dateLabel: {
    fontSize: "0.9rem",
    color: "#6c757d"
  },
  dateValue: {
    fontSize: "0.95rem",
    color: "#1a1a1a"
  },
  cardFooter: {
    marginTop: "auto"
  },
  viewButton: {
    display: "inline-block",
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f8f9fa",
    color: "#1a1a1a",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid #e9ecef",
    transition: "all 0.2s ease",
    cursor: "pointer",
    boxSizing: "border-box"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e9ecef",
    borderTop: "3px solid #1a1a1a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem"
  },
  deleteSpinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    color: "#6c757d",
    fontSize: "1rem"
  },
  emptyText: {
    fontSize: "1.2rem",
    color: "#6c757d",
    marginBottom: "1.5rem"
  },
  browseButton: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1a1a1a",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease"
  },
  retryButton: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer"
  }
};

// Add this to your global CSS or style tag
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    border-color: #1a1a1a;
  }
  
  .view-button:hover {
    background-color: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  }
  
  .delete-button:hover {
    background-color: #c82333;
    transform: scale(1.1);
  }
  
  .delete-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .browse-button:hover,
  .retry-button:hover {
    background-color: #333;
  }
`;