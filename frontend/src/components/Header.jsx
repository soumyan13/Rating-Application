import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useStore";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg px-8 py-4 flex justify-between items-center fixed top-0 w-full z-10 text-white">
      <Link
        to="/"
        className="text-3xl font-extrabold hover:text-yellow-300 transition-all"
      >
        Rating Application
      </Link>

      <nav className="flex items-center gap-8">
        {user ? (
          <>
            <span className="text-lg font-semibold text-yellow-300">
              {user.name} ({user.role})
            </span>

            {user.role === "ADMIN" && (
              <Link
                to="/dashboard"
                className="text-lg font-semibold hover:text-yellow-300 transition-all"
              >
                Dashboard
              </Link>
            )}

            {user.role === "STORE-OWNER" && (
              <Link
                to="/my-store"
                className="text-lg font-semibold hover:text-yellow-300 transition-all"
              >
                My Store
              </Link>
            )}

            <div
              onClick={handleLogout}
              className="bg-red-500 px-6 py-2 rounded-full cursor-pointer hover:bg-red-700 transition-all"
            >
              Logout
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg font-semibold hover:text-yellow-300 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-lg font-semibold hover:text-yellow-300 transition-all"
            >
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
