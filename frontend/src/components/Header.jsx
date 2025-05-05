import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useStore";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg px-6 py-4 fixed top-0 w-full z-50 text-white">
      <div className="flex items-center justify-between px-6 mx-auto">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold hover:text-yellow-300 transition-all"
        >
          RatingApp
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
          {user ? (
            <>
              <span className="text-yellow-300 font-semibold">
                {user.name} ({user.role})
              </span>

              {user.role === "ADMIN" && (
                <Link
                  to="/dashboard"
                  className="hover:text-yellow-300 transition"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "STORE_OWNER" && (
                <Link
                  to="/my-store"
                  className="hover:text-yellow-300 transition"
                >
                  My Store
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 transition px-4 py-2 rounded-full font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition text-xl font-bold">
                Login
              </Link>
              <Link to="/signup" className="hover:text-yellow-300 transition text-xl font-bold">
                Signup
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-blue-700 rounded-lg px-4 py-3 space-y-2 text-base font-medium shadow-lg">
          {user ? (
            <>
              <div className="text-yellow-300">
                {user.name} ({user.role})
              </div>

              {user.role === "ADMIN" && (
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="block hover:text-yellow-300"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "STORE_OWNER" && (
                <Link
                  to="/my-store"
                  onClick={toggleMenu}
                  className="block hover:text-yellow-300"
                >
                  My Store
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left bg-red-500 hover:bg-red-700 px-3 py-2 rounded-full text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block hover:text-yellow-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="block hover:text-yellow-300"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
