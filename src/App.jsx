import { Routes, Route } from "react-router-dom";

// Page-level views
import Homepage from "./views/Homepage";
import CatalogView from "./views/Catalog/CatalogView";
import ShoppingCartView from "./views/ShoppingCart/ShoppingCartView";
import CheckoutView from "./views/Checkout/CheckoutView";
import RegistrationView from "./views/Registration/RegistrationView";
import AdminView from "./views/Admin/AdminView";
import NotFoundView from "./views/NotFoundView";
import VehicleDetailView from "./views/Catalog/VehicleDetailView";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      {/* Navigation Bar */}
      <Header />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/register" element={<RegistrationView />} />

        {/* Cart & checkout */}
        <Route path="/cart" element={<ShoppingCartView />} />
        <Route path="/checkout" element={<CheckoutView />} />

        {/* Admin analytics */}
        <Route path="/admin" element={<AdminView />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFoundView />} />

        <Route path="/catalog/:vid" element={<VehicleDetailView />} />
      </Routes>
    </>
  );
}
