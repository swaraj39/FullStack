import axios from "axios";

export const apiAuth = axios.create({
    baseURL: "http://localhost:8080/auth",
    headers: {
        "Content-Type": "application/json",
    },
});
// BOOK SERVICE
export const apiBooks = axios.create({
    baseURL: "http://localhost:8080/BOOK-SERVICE/"
});

// BORROW SERVICE
export const apiUsers = axios.create({
    baseURL: "http://localhost:8080/BORROW-SERVICE/"
});

// 🔥 Interceptor for Books
apiBooks.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// 🔥 Interceptor for Users
apiUsers.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});