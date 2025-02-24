import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutPage from "./components/AboutPage";
import CatalogPage from "./components/CatalogPage";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import AdminRoute from "./components/AdminRoute";
import OrderHistoryPage from './pages/OrderHistoryPage';
import TopSpendersPage from './components/TopSpendersPage';


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Rute untuk Website Utama */}
        <Route
          path="/"
          element={
            <div className="bg-gray-50">
      <Navbar />
      <Hero />
      <AboutPage />
      <CatalogPage />
      <TopSpendersPage /> 
      <ContactPage />
      <Footer />
    </div>
          }
        />

        {/* Protected Routes - Hanya bisa diakses setelah login */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Navbar />
              <UserSettingsPage />
            </ProtectedRoute>
          }
        />
        
<Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Navbar />
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Routes yang tidak bisa diakses setelah login */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin-login"
          element={
            <RedirectIfAuthenticated>
              <AdminLoginPage />
            </RedirectIfAuthenticated>
          }
        />

        {/* PERBAIKAN: Menghapus route admin ganda dan menggunakan AdminRoute */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;