// src/components/Header.jsx
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { CompareContext } from "../context/CompareContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { compareItems } = useContext(CompareContext);

  return (
    <header className="bg-gray-800 text-black">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold hover:opacity-75">
          EECS 4413 Group A
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Catalog
          </NavLink>
          <NavLink to="/loan" className="hover:underline text-lg">
            Loan
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Compare ({compareItems.length})
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Cart ({cartItems.length})
          </NavLink>

          {user ? (
            <>
              {/* Only show Admin if the logged-in user's username is "admin1" */}
              {user === "admin1" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "underline text-lg" : "hover:underline text-lg"
                  }
                >
                  Admin
                </NavLink>
              )}
              <span className="text-lg text-gray-300">Welcome, {user}</span>
              <button onClick={logout} className="ml-4 text-lg hover:underline">
                Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "underline text-lg" : "hover:underline text-lg"
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
