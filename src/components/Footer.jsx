/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-navyDarkest py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tentang Kami</h3>
            <p className="text-sm">
              Koperasi Digital adalah platform modern yang menyediakan berbagai kebutuhan sehari-hari dengan mudah dan cepat.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#home" className="hover:text-blue-500 transition-colors">Beranda</a></li>
              <li><a href="#catalog" className="hover:text-blue-500 transition-colors">Katalog</a></li>
              <li><a href="#about" className="hover:text-blue-500 transition-colors">Tentang</a></li>
              <li><a href="#contact" className="hover:text-blue-500 transition-colors">Kontak</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; 2025 Koperasi Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
