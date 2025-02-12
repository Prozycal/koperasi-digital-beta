import React from "react";
import { motion } from "framer-motion";
import hero from "./assets/koperasi-hero.png";

function Hero() {
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between child animations
        delayChildren: 0.5, // Initial delay before children start
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="relative bg-snavy bg-cover bg-center h-screen flex items-center"
      id="home"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* CSS Particles Animation */}
      <div className="absolute inset-0 z-0">
        <div className="particles"></div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navyDark via-transparent to-navyDark opacity-80"></div>
      {/* Content */}
      <motion.div
        className="container mx-auto px-6 relative z-10"
        variants={itemVariants}
      >
        {/* Image Section */}
        <motion.div
          className="pt-14 lg:hidden"
          variants={itemVariants}
        >
          <div className="relative w-full h-[150px] sm:h-[200px] lg:h-[300px] pb-8">
            <img
              src={hero}
              alt="Koperasi Digital Illustration"
              className="w-full h-full object-cover rounded-lg shadow-none"
            />
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          variants={containerVariants}
        >
          {/* Text Section */}
          <motion.div
            className="text-white text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold leading-tight"
              variants={itemVariants}
            >
              Selamat Datang di <span className="text-creamyLight font-typographica font-normal">Konest!</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-gray-300"
              variants={itemVariants}
            >
              <span className="font-typographica">Konest</span> adalah platform koperasi digital untuk sekolah, menyediakan berbagai kebutuhan dengan mudah dan cepat.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
              variants={containerVariants}
            >
              {/* Button 1 with Framer Motion */}
              <motion.a
                href="#about"
                className="bg-creamyLight text-snavy font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: [
                    "0px 5px 15px rgba(248, 250, 195, 0.3)",
                    "0px 10px 20px rgba(248, 250, 195, 0.5)",
                  ],
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  boxShadow: { duration: 0.3, ease: "easeInOut" },
                }}
                variants={itemVariants}
              >
                <motion.span
                  className="relative z-10"
                  initial={{ y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  Pelajari Lebih Lanjut
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-creamyLight/50 rounded-lg"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </motion.a>
              {/* Button 2 with Framer Motion */}
              <motion.a
                href="#catalog"
                className="bg-white text-snavy font-semibold py-3 px-6 rounded-lg shadow-lg cursor-pointer relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: [
                    "0px 5px 15px rgba(255, 255, 255, 0.3)",
                    "0px 10px 20px rgba(255, 255, 255, 0.5)",
                  ],
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  boxShadow: { duration: 0.3, ease: "easeInOut" },
                }}
                variants={itemVariants}
              >
                <motion.span
                  className="relative z-10"
                  initial={{ y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  Produk Yang Kami Jual
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-white/50 rounded-lg"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </motion.a>
            </motion.div>
          </motion.div>
          {/* Image Section */}
          <motion.div
            className="hidden lg:block pt-14"
            variants={itemVariants}
          >
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <img
                src={hero}
                alt="Koperasi Digital Illustration"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Waves Transition */}
      <motion.div
        className="absolute bottom-0 w-full overflow-hidden leading-none"
        variants={itemVariants}
      >
        <svg
          className="relative block w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#213555" /* bg-navyDark */
            fillOpacity="1"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </motion.div>
    </motion.section>
  );
}

export default Hero;