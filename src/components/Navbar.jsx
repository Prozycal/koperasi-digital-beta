/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-snavy bg-opacity-80 backdrop-blur-lg shadow-lg rounded-full w-5/6 px-6 py-6 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" className="text-lg font-bold text-creamyLight">
          Koperasi Digital
        </a>
        <div className="hidden lg:flex lg:items-center space-x-6">
        <a href="#home" className="text-creamy relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-width after:duration-300 hover:after:w-full">Home</a>
        <a href="#about" className="text-creamy relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-width after:duration-300 hover:after:w-full">About</a>
        <a href="#catalog" className="text-creamy relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-width after:duration-300 hover:after:w-full">Catalog</a>
        <a href="#contact" className="text-creamy relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-current after:transition-width after:duration-300 hover:after:w-full">Contact</a>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-creamy focus:outline-none">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-5/6 bg-snavy bg-opacity-95 backdrop-blur-xl shadow-lg rounded-lg z-40 mt-10">
          <a href="#hero" className="block px-4 py-2 text-creamy hover:bg-navyDark hover:rounded-lg">Home</a>
          <a href="#photo" className="block px-4 py-2 text-creamy hover:bg-navyDark">Foto</a>
          <a href="#catalog" className="block px-4 py-2 text-creamy hover:bg-navyDark">Katalog</a>
          <a href="#contact" className="block px-4 py-2 text-creamy hover:bg-navyDark hover:rounded-lg">Contact</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

