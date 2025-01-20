import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function ContactPage() {
  return (
    <section className="py-20 bg-gradient-to-b from-snavy to-navyDark" id="contact">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-5xl font-extrabold leading-tight mb-4 text-white text-center">Hubungi <span className="text-creamyLight">Kami</span></h2>
        <p className="text-lg text-center text-gray-300 mb-12">Kami di sini untuk membantu Anda! Silakan hubungi kami melalui formulir di bawah atau gunakan informasi kontak kami.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Informasi Kontak */}
          <div className="bg-navyDarkest p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-6">Informasi Kontak</h3>

            <div className="flex items-center gap-4 mb-4">
              <FiMail className="text-creamyLight text-xl" />
              <p className="text-gray-300">info@company.com</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <FiPhone className="text-creamyLight text-xl" />
              <p className="text-gray-300">+62 812 3456 7890</p>
            </div>
            <div className="flex items-center gap-4">
              <FiMapPin className="text-creamyLight text-xl" />
              <p className="text-gray-300">Jl. Contoh No.123, Jakarta, Indonesia</p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg text-white mb-2">Jam Operasional</h4>
              <p className="text-gray-300">Senin - Jumat: 09:00 - 17:00</p>
              <p className="text-gray-300">Sabtu - Minggu: Libur</p>
            </div>
          </div>

          {/* Formulir Kontak */}
          <form className="bg-navyDarkest p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-6">Kirim Pesan</h3>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2">Nama</label>
              <input
                type="text"
                id="name"
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-300 mb-2">Pesan</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Tulis pesan Anda di sini..."
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-creamyLight hover:bg-creamy text-snavy font-semibold py-3 rounded-md transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
