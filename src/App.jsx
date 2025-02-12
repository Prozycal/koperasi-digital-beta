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
              <ContactPage />
              <Footer />
            </div>
          }
        />
        {/* Rute untuk Login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Rute untuk Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
