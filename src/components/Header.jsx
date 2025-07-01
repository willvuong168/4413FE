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
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold hover:opacity-75">
          EV Store
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Catalog
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isActive ? "underline text-lg" : "hover:underline text-lg"
            }
          >
            Compare ({compareItems.length})
          </NavLink>

          <NavLink to="/loan" className="hover:underline text-lg">
            Loan
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
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "underline text-lg" : "hover:underline text-lg"
                }
              >
                Admin
              </NavLink>
              <button onClick={logout} className="ml-4 text-lg hover:underline">
                Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/register"
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
