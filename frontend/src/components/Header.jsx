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
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 w-full z-10">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Rating Application
      </Link>

      <nav className=" flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-800 font-medium">
              {user.name} ({user.role})
            </span>

            {user.role === "ADMIN" && (
              <Link to="/dashboard" className="text-blue-500 hover:underline">
                Dashboard
              </Link>
            )}

            {user.role === "STORE-OWNER" && (
              <Link to="/my-store" className="text-blue-500 hover:underline">
                My Store
              </Link>
            )}

            <div onClick={handleLogout} className="bg-red-500 text-white">
              Logout
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
