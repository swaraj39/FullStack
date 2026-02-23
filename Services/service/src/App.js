import './App.css';
import BookPage from "./Pages/BookPage";
import BorrowForm from './Pages/BorrowForm';
import MyBorrowedBooks from './Pages/MyBorrowedBooks';
import Login from "./Pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
    const isTokenValid = () => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    const isLoggedIn = isTokenValid();
  return (
    <BrowserRouter>
        <Routes>

            <Route
                path="/login"
                element={<Login />} />

            <Route
                path="/book"
                element={isLoggedIn ? <BookPage /> : <Login />}/>

            <Route path="/" element={isLoggedIn ? <BookPage/> :  <Login />} />

            <Route
                path="/borrow"
                element={isLoggedIn ? <BorrowForm /> : <Login />}
            />

            <Route
                path="/my-borrowed"
                element={isLoggedIn ? <MyBorrowedBooks /> : <Login />}
            />

        </Routes>
    </BrowserRouter>
  );
}

export default App;
