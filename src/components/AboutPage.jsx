/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { FaCheckCircle, FaUsers, FaWallet, FaRocket } from 'react-icons/fa';
import koperasiImage from './assets/koperasi.png';

function AboutPage() {
  return (
    <section className="py-20 bg-navyDark text-white"
    id='about'>
      <div className="container mx-auto px-6">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Tentang <span className="text-creamyLight">Koperasi Digital</span>
          </h2>
          <p className="text-lg font-light">
            Koperasi modern yang menyediakan berbagai layanan digital untuk kebutuhan Anda. Mudah, cepat, dan terpercaya.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold mb-6">Apa Itu Koperasi Digital?</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              Koperasi Digital adalah solusi inovatif untuk memenuhi kebutuhan anggota secara efisien dan transparan. 
              Dengan memanfaatkan teknologi terkini, kami menyediakan platform untuk membeli produk, layanan, dan informasi koperasi secara online. 
            </p>
            <p className="mt-4 text-lg text-gray-200 leading-relaxed">
              Misi kami adalah mendukung kebutuhan pendidikan, mulai dari alat tulis hingga seragam, melalui cara yang lebih praktis dan aman.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <FaCheckCircle className="text-creamyLight text-xl mr-4" />
                <span className="text-lg text-gray-200">
                  Platform modern dan responsif.
                </span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-creamyLight text-xl mr-4" />
                <span className="text-lg text-gray-200">
                  Berbagai produk berkualitas untuk kebutuhan sekolah.
                </span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-creamyLight text-xl mr-4" />
                <span className="text-lg text-gray-200">
                  Layanan pelanggan yang profesional dan cepat tanggap.
                </span>
              </div>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="lg:w-1/2 flex justify-center items-center">
            <img
              src={koperasiImage} // Ganti dengan gambar sesuai tema
              alt="Koperasi Digital"
              className="w-full max-w-lg rounded-lg shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Syarat dan Ketentuan */}
        <div className="mt-20 bg-snavy text-white rounded-lg shadow-lg p-10">
          <h3 className="text-4xl font-bold text-left mb-8">
            Syarat dan Ketentuan
          </h3>
          <ul className="space-y-6 text-lg leading-relaxed">
            <li className="flex items-start">
              <FaUsers className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Keanggotaan:</strong> Anggota harus merupakan bagian dari lembaga yang bekerja sama dengan koperasi.
              </span>
            </li>
            <li className="flex items-start">
              <FaWallet className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pembayaran:</strong> Transaksi harus dilakukan sesuai metode pembayaran yang tersedia.
              </span>
            </li>
            <li className="flex items-start">
              <FaRocket className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pengiriman:</strong> Produk akan dikirim sesuai alamat yang terdaftar pada akun Anda.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pengembalian:</strong> Pengembalian barang hanya berlaku untuk produk yang cacat atau salah kirim.
              </span>
            </li>
          </ul>
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
            fill="#3E5879" /* bg-navyDark */
            fillOpacity="1"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default AboutPage;
