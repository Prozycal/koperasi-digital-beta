/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { FaCheckCircle, FaWallet, FaRocket, FaStar, FaUserAlt, FaGamepad, FaGem, FaMoneyCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import koperasiImage from './assets/koperasi.png';

function AboutPage() {
  const features = [
    {
      icon: <FaCheckCircle className="text-creamyLight text-3xl" />,
      title: "Platform Modern",
      description: "Platform yang mudah digunakan dan responsif untuk semua perangkat.",
    },
    {
      icon: <FaWallet className="text-creamyLight text-3xl" />,
      title: "Transaksi Aman",
      description: "Pembayaran aman dengan berbagai metode pembayaran terpercaya.",
    },
    {
      icon: <FaRocket className="text-creamyLight text-3xl" />,
      title: "Pengiriman Cepat",
      description: "Proses pengiriman cepat dan efisien sesuai jadwal Anda.",
    },
  ];

  const plannedFeatures = [
    {
      icon: <FaStar className="text-creamyLight text-3xl" />,
      title: "Program Loyalitas",
      description: "Sistem poin loyalitas untuk memberikan keuntungan lebih kepada anggota.",
    },
    {
      icon: <FaUserAlt className="text-creamyLight text-3xl" />,
      title: "Sistem Account",
      description: "Sistem login dan akun anggota untuk memudahkan transaksi.",
    },
    {
      icon: <FaMoneyCheck className="text-creamyLight text-3xl" />,
      title: "Metode Pembayaran Digital",
      description: "Penambahan metode pembayaran via E-Wallet digital payment.",
    },
    {
      icon: <FaGem className="text-creamyLight text-3xl" />,
      title: "Konest Premium",
      description: "Program premium subscription dengan fitur yang menarik.",
    },
    {
      icon: <FaGamepad className="text-creamyLight text-3xl" />,
      title: "Minigames",
      description: "Minigames sederhana untuk user.",
    },
  ];

  return (
    <section
      className="py-20 bg-navyDark text-white overflow-hidden"
      id="about"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Heading Section with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-white">
            Tentang <span className="text-creamyLight">Koperasi Digital</span>
          </h2>
          <p className="text-lg font-light text-gray-300">
            Konest adalah koperasi modern yang menyediakan berbagai layanan digital untuk kebutuhan Anda. Mudah, cepat, dan terpercaya.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Section with Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-white">
              Apa Itu Koperasi Digital?
            </h3>
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
          </motion.div>

          {/* Right Section (Image) with Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="lg:w-1/2 flex justify-center items-center"
          >
            <img
              src={koperasiImage}
              alt="Koperasi Digital"
              className="w-full max-w-lg rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>

        {/* Syarat dan Ketentuan with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-20 bg-snavy text-white rounded-lg shadow-lg p-10"
        >
          <h3 className="text-4xl font-bold text-left mb-8 text-transparent bg-clip-text bg-creamyLight">
            Syarat dan Ketentuan
          </h3>
          <ul className="space-y-6 text-lg leading-relaxed">
            <li className="flex items-start">
              <FaWallet className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pembayaran:</strong> Transaksi harus dilakukan sesuai metode pembayaran yang tersedia.
              </span>
            </li>
            <li className="flex items-start">
              <FaRocket className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pengiriman:</strong> Produk yang Anda pesan akan bisa diambil sesuai tanggal pengambilan yang Anda berikan.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-creamyLight text-xl mr-4" />
              <span>
                <strong>Pengembalian:</strong> Pengembalian barang hanya berlaku untuk produk yang cacat (khusus kategori seragam & kebutuhan belajar).
              </span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 mt-20">
        <h2 className="text-4xl font-extrabold mb-5 text-left text-transparent bg-clip-text bg-creamyLight">
          Keunggulan Kami
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2, ease: "easeOut" },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-snavy rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Waves Transition at the Bottom */}
      <div className="bottom-0 w-full overflow-hidden leading-none -mb-24">
        <svg
          className="relative block w-full"
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