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
              <p className="text-gray-300">konest@gmail.com</p>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <FiPhone className="text-creamyLight text-xl" />
              <p className="text-gray-300">+62 856-4756-8494</p>
            </div>
            <div className="flex items-center gap-4">
              <FiMapPin className="text-creamyLight text-xl" />
              <p className="text-gray-300">Jl. STM Pembangunan, Mrican, Caturtunggal, Depok, Sleman 55281</p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg text-white mb-2">Jam Operasional Koperasi Siswa</h4>
              <p className="text-gray-300">Senin - Jumat: 10:00 - 14:00</p>
              <p className="text-gray-300">Sabtu - Minggu: Libur</p>
            </div>
          </div>

          {/* Formulir Kontak */}
          <form action="https://formsubmit.co/przycal@gmail.com" className="bg-navyDarkest p-8 rounded-lg shadow-lg" method="POST">
            <h3 className="text-2xl font-semibold text-white mb-6">Kirim Pesan</h3>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2">Nama</label>
              <input
                type="text"
                id="name"
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md" required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md" required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-300 mb-2">Pesan</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Tulis pesan Anda di sini..."
                className="w-full px-4 py-3 border border-gray-600 bg-navyDark focus:outline-none focus:ring-2 focus:ring-creamyLight text-gray-300 rounded-md" required
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
      {/* Waves Transition */}
      <div className="bottom-0 w-full overflow-hidden leading-none -mt-2 -mb-24">
        <svg
          className="relative block w-full "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#1d2040"
            fillOpacity="1"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default ContactPage;
