import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "../api";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await apiAuth.post("/login", {
                username,
                password,
            });

            // Store JWT token
            localStorage.setItem("token", response.data.token);

            // Navigate to books page
            navigate("/book");

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Invalid credentials");
            } else if (err.request) {
                setError("Server not responding. Check backend.");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div style={{ maxWidth: "300px", margin: "50px auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

            {error && (
                <div
                    style={{
                        color: "red",
                        marginBottom: "10px",
                        padding: "8px",
                        backgroundColor: "#ffebee",
                        borderRadius: "4px",
                    }}
                >
                    {error}
                </div>
            )}

            <input
                onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                }}
                onKeyDown={handleKeyPress}
                placeholder="Username"
                value={username}
                disabled={isLoading}
                style={inputStyle}
                autoFocus
            />

            <input
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                }}
                onKeyDown={handleKeyPress}
                placeholder="Password"
                value={password}
                disabled={isLoading}
                style={inputStyle}
            />

            <button
                onClick={handleLogin}
                disabled={isLoading}
                style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: isLoading ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontSize: "16px",
                }}
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
};

export default Login;