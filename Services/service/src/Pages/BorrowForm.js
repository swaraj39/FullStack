import {useEffect, useState} from "react";
import {apiBooks, apiUsers} from "../api";
import toast from "react-hot-toast";

function BorrowForm() {
  const [formData, setFormData] = useState({
    memberId: "",
    bookId: ""
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    setLoading(true);

    apiBooks.get("/getBooks/inStock")
        .then((res) => {
          setBooks(res.data);
          console.log(res.data);
        })
        .catch(() => {
          setError("Failed to load books");
        })
        .finally(() => {
          setLoading(false);
        });

  }, []);   // <-- IMPORTANT empty dependency array

  const handleSubmit = e => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    apiUsers
        .post("borrows/new-borrow", {
          memberId: Number(formData.memberId),
          bookId: Number(formData.bookId)
        })
        .then(() => {
          toast.success("Book borrowed successfully!");
          setMessage("Book borrowed successfully!");
          setFormData({ memberId: "", bookId: "" });
          setTimeout(() => setMessage(null), 3000);
        })
        .catch(() => {
          setError("Failed to borrow book. Please try again.");
          setTimeout(() => setError(null), 3000);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Borrow a Book</h2>
          <p style={styles.subtitle}>Enter member and book details below</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Member ID</label>
            <input
                type="number"
                name="memberId"
                placeholder="e.g., 12345"
                value={formData.memberId}
                onChange={handleChange}
                required
                style={styles.input}
                min="1"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Book</label>
            <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                required
                style={styles.input}
            >
              <option value="">-- Select a Book --</option>
              {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
              ))}
            </select>
          </div>


          <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
          >
            {loading ? (
                <span style={styles.buttonContent}>
              <span style={styles.spinner}></span>
              Processing...
            </span>
            ) : (
                "Borrow Book"
            )}
          </button>
        </form>




      </div>
  );
}

export default BorrowForm;

const styles = {
  container: {
    maxWidth: "480px",
    margin: "2rem auto",
    padding: "2rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e9ecef"
  },
  header: {
    marginBottom: "2rem",
    textAlign: "center"
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 0.5rem 0",
    letterSpacing: "-0.02em"
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#6c757d",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#1a1a1a"
  },
  input: {
    padding: "0.875rem 1rem",
    fontSize: "1rem",
    border: "1px solid #dee2e6",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    outline: "none",
    backgroundColor: "#f8f9fa",
    width: "100%",
    boxSizing: "border-box"
  },
  button: {
    padding: "1rem",
    backgroundColor: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed"
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block"
  },
  messageSuccess: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "10px",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid #c3e6cb"
  },
  messageError: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "10px",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid #f5c6cb"
  },
  messageIcon: {
    fontSize: "1.2rem",
    fontWeight: "bold"
  }
};

// Add this to your global CSS or style tag
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .input:focus {
    border-color: #1a1a1a;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
  }

  .button:hover:not(:disabled) {
    background-color: #333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .button:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    .container {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
`;

// Optional: Add input number spinner removal
const removeNumberSpinners = `
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
`;