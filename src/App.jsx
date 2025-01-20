import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutPage from './components/AboutPage';
import CatalogPage from './components/CatalogPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <Hero />
      <AboutPage />
      <CatalogPage />
      <ContactPage />
      <Footer />
    </div>
  );
}

export default App;
