import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div style={styles.layout}>
            <Sidebar />
            <main style={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;

const styles = {
    layout: {
        display: "flex",
        minHeight: "100vh",
    },
    content: {
        flex: 1,
        padding: "2rem",
        backgroundColor: "#f5f6fa",
        overflowY: "auto",
    },
};