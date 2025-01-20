import React from "react";
import hero from "./assets/koperasi-hero.png";

function Hero() {
  return (
    <section
      className="relative bg-snavy bg-cover bg-center h-screen flex items-center"
      id="home">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navyDark via-transparent to-navyDark opacity-80"></div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Image Section */}
        <div className="pt-14 lg:hidden">
            <div className="relative w-full h-[150px] sm:h-[200px] lg:h-[300px] pb-8">
              <img
                src={hero}
                alt="Koperasi Digital Illustration"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <div className="text-white text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Selamat Datang di <span className="text-creamyLight">Koperasi Digital</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300">
              Platform koperasi digital untuk sekolah, menyediakan berbagai kebutuhan dengan mudah dan cepat.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <a
                href="#about"
                className="bg-creamyLight hover:bg-creamy text-snavy font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
              >
                Pelajari Lebih Lanjut
              </a>
              <a
                href="#catalog"
                className="bg-white hover:bg-gray-100 text-snavy font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
              >
                Produk Yang Kami Jual
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block pt-14">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <img
                src={hero}
                alt="Koperasi Digital Illustration"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waves Transition */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#213555" /* bg-navyDark */
            fillOpacity="1"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
