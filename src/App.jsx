import { Routes, Route } from "react-router-dom";

// Page-level views
import Homepage from "./views/Homepage";
import CatalogView from "./views/Catalog/CatalogView";
import ShoppingCartView from "./views/ShoppingCart/ShoppingCartView";
import CheckoutView from "./views/Checkout/CheckoutView";
import ConfirmationView from "./views/Checkout/ConfirmationView";
import RegistrationView from "./views/Registration/RegistrationView";
import AdminView from "./views/Admin/AdminView";
import NotFoundView from "./views/NotFoundView";
import VehicleDetailView from "./views/Catalog/VehicleDetailView";
import Header from "./components/Header";
import LoanView from "./views/Loan/LoanView";
import CompareView from "./views/Compare/CompareView";
import Chatbot from "./components/Chatbot";

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
        <Route path="/login" element={<RegistrationView />} />
        <Route path="/compare" element={<CompareView />} />
        {/* Cart & checkout */}
        <Route path="/cart" element={<ShoppingCartView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/confirmation" element={<ConfirmationView />} />

        {/* Admin analytics */}
        <Route path="/admin" element={<AdminView />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFoundView />} />

        <Route path="/catalog/:vid" element={<VehicleDetailView />} />
        <Route path="/loan" element={<LoanView />} />
      </Routes>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}
