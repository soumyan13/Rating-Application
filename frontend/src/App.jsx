import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import { useUserStore } from "./store/useStore";
import "./App.css";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";

function App() {
  const { user, role } = useUserStore();

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {role === "ADMIN" && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
        {role === "USER" && <Route path="/user" element={<UserDashboard />} />}
        {role === "STORE_OWNER" && (
          <Route path="/store_owner" element={<StoreOwnerDashboard />} />
        )}

        <Route
          path="*"
          element={<Navigate to={user ? `/${role}` : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
