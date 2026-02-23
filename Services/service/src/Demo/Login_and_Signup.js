import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    // Login states
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup states
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Common states
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!loginUsername.trim() || !loginPassword.trim()) {
            setError("Please enter both username and password");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            navigate("/book");

        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async () => {
        // Validation
        if (!signupName.trim() || !signupEmail.trim() || !signupUsername.trim() || !signupPassword.trim()) {
            setError("Please fill in all fields");
            return;
        }

        if (signupPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (signupPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!signupEmail.includes('@') || !signupEmail.includes('.')) {
            setError("Please enter a valid email");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    username: signupUsername,
                    password: signupPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Auto login after signup
            localStorage.setItem("token", data.token);
            navigate("/book");

        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isLogin) {
                handleLogin();
            } else {
                handleSignup();
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '20px'
        },
        card: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px'
        },
        title: {
            margin: '0 0 8px 0',
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: '600'
        },
        subtitle: {
            margin: '0',
            color: '#666',
            fontSize: '14px'
        },
        toggleTabs: {
            display: 'flex',
            marginBottom: '30px',
            borderBottom: '2px solid #e4e6eb',
            gap: '20px'
        },
        tab: {
            flex: 1,
            textAlign: 'center',
            padding: '10px 0',
            cursor: 'pointer',
            color: '#666',
            fontSize: '16px',
            fontWeight: '500',
            borderBottom: '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s'
        },
        activeTab: {
            color: '#4CAF50',
            borderBottom: '2px solid #4CAF50'
        },
        error: {
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2'
        },
        inputGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            marginBottom: '6px',
            color: '#555',
            fontSize: '14px',
            fontWeight: '500'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: `1px solid ${error ? '#c62828' : '#ddd'}`,
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
        },
        inputFocus: {
            borderColor: '#4CAF50',
            boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.1)'
        },
        button: {
            width: '100%',
            padding: '14px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isLoading ? 'default' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'background-color 0.2s',
            marginTop: '10px'
        },
        footer: {
            marginTop: '25px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666'
        },
        link: {
            color: '#4CAF50',
            textDecoration: 'none',
            fontWeight: '500',
            cursor: 'pointer',
            marginLeft: '5px'
        },
        passwordHint: {
            fontSize: '12px',
            color: '#888',
            marginTop: '4px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome</h2>
                    <p style={styles.subtitle}>
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <div style={styles.toggleTabs}>
                    <div
                        style={{
                            ...styles.tab,
                            ...(isLogin ? styles.activeTab : {})
                        }}
                        onClick={() => toggleMode()}
                    >
                        Login
                    </div>
                    <div
                        style={{
                            ...styles.tab,
                            ...(!isLogin ? styles.activeTab : {})
                        }}
                        onClick={() => toggleMode()}
                    >
                        Sign Up
                    </div>
                </div>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {isLogin ? (
                    // Login Form
                    <div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={loginUsername}
                                onChange={(e) => {
                                    setLoginUsername(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your username"
                                disabled={isLoading}
                                autoFocus
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={loginPassword}
                                onChange={(e) => {
                                    setLoginPassword(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your password"
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <button
                            style={styles.button}
                            onClick={handleLogin}
                            disabled={isLoading}
                            onMouseEnter={(e) => {
                                if (!isLoading) e.target.style.backgroundColor = '#45a049';
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) e.target.style.backgroundColor = '#4CAF50';
                            }}
                        >
                            {isLoading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </div>
                ) : (
                    // Signup Form
                    <div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={signupName}
                                onChange={(e) => {
                                    setSignupName(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your full name"
                                disabled={isLoading}
                                autoFocus
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                style={styles.input}
                                type="email"
                                value={signupEmail}
                                onChange={(e) => {
                                    setSignupEmail(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={signupUsername}
                                onChange={(e) => {
                                    setSignupUsername(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Choose a username"
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={signupPassword}
                                onChange={(e) => {
                                    setSignupPassword(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Create a password"
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                            <div style={styles.passwordHint}>
                                Must be at least 6 characters
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError('');
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        </div>

                        <button
                            style={styles.button}
                            onClick={handleSignup}
                            disabled={isLoading}
                            onMouseEnter={(e) => {
                                if (!isLoading) e.target.style.backgroundColor = '#45a049';
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) e.target.style.backgroundColor = '#4CAF50';
                            }}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                )}

                <div style={styles.footer}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span
                        style={styles.link}
                        onClick={toggleMode}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Auth;