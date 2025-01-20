import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // Ikon pencarian
import notFoundImage from './assets/not-found.gif'; // Gambar untuk "produk tidak ditemukan"

// Makanan
import sosmi from './assets/sosmi.jpg';
import nasi from './assets/nasi.jpg';
import basreng from './assets/basreng.jpeg';
import dimsum from './assets/dimsum.jpg';
import kripca from './assets/kripca.jpeg';
import mochi from './assets/mochi.jpg';
import krusus from './assets/kripik-usus.jpeg';
import piscok from './assets/piscok.jpg';
import popmie from './assets/popmie.jpeg';
import risol from './assets/risol.jpg';
import aoka from './assets/aoka.jpg';

// Minuman
import aqua from './assets/mineral.jpg';
import frestea from './assets/frestea.jpg';
import cola from './assets/cola.jpeg';
import sprite from './assets/sprite.jpg';
import fanta from './assets/fanta.jpg';
import leminerale from './assets/leminerale.jpg';

// Seragam
import topi from './assets/topi.jpeg';
import dasi from './assets/dasi.jpeg';
import sabuk from './assets/sabuk.jpg';
import badge from './assets/badge.jpg';

// Kebutuhan Sekolah
import pensil from './assets/pensil.jpg';
import bolpen from './assets/bolpen.jpg';
import bukuTulis from './assets/buku-tulis.jpg';
import folio from './assets/folio.jpeg';
import buffalo from './assets/buffalo.jpg';
import asturo from './assets/asturo.jpg';
import penggaris from './assets/penggaris.jpg';
import rautan from './assets/rautan.jpg';
import penghapus from './assets/penghapus.jpg';

function CatalogPage() {
  const categories = [
    {
      name: "Makanan",
      products: [
        { name: "Sosis Lilit Mie", description: "lorem ipsum", price: 3000, image: sosmi },
        { name: "Nasi Ayam Geprek", description: "lorem ipsum", price: 3000, image: nasi },
        { name: "Basreng", description: "lorem ipsum", price: 2000, image: basreng },
        { name: "Dimsum", description: "lorem ipsum", price: 3500, image: dimsum },
        { name: "Keripik Kaca", description: "lorem ipsum", price: 2000, image: kripca },
        { name: "Mochi", description: "lorem ipsum", price: 3000, image: mochi },
        { name: "Keripik Usus", description: "lorem ipsum", price: 2000, image: krusus },
        { name: "Pisang Coklat", description: "lorem ipsum", price: 2500, image: piscok },
        { name: "Popmie", description: "lorem ipsum", price: 5000, image: popmie },
        { name: "Risol Mayo", description: "lorem ipsum", price: 3000, image: risol },
        { name: "Aoka", description: "lorem ipsum", price: 3500, image: aoka },
      ],
    },
    {
      name: "Minuman",
      products: [
        { name: "Aqua", description: "Mineral water", price: 5000, image: aqua },
        { name: "Frestea", description: "Tea drink", price: 7000, image: frestea },
        { name: "Coca-Cola", description: "Soft drink", price: 8000, image: cola },
        { name: "Sprite", description: "Lemon-lime drink", price: 8000, image: sprite },
        { name: "Fanta", description: "Fruit-flavored drink", price: 8000, image: fanta },
        { name: "Le Minerale", description: "Mineral water", price: 6000, image: leminerale },
      ],
    },
    {
      name: "Seragam",
      products: [
        { name: "Topi", description: "Topi sekolah", price: 20000, image: topi },
        { name: "Dasi", description: "Dasi sekolah", price: 15000, image: dasi },
        { name: "Ikat Pinggang", description: "Ikat pinggang sekolah", price: 25000, image: sabuk },
        { name: "Badge", description: "Badge sekolah", price: 10000, image: badge },
      ],
    },
    {
      name: "Kebutuhan Belajar",
      products: [
        { name: "Pensil", description: "Pensil 2B", price: 1000, image: pensil },
        { name: "Bolpen", description: "Bolpen hitam", price: 2000, image: bolpen },
        { name: "Buku Tulis", description: "Buku tulis 100 halaman", price: 5000, image: bukuTulis },
        { name: "Kertas Folio", description: "Folio A4", price: 3000, image: folio },
        { name: "Kertas Buffalo", description: "Lem Aibon", price: 2000, image: buffalo },
        { name: "Kertas Asturo", description: "Lem Kertas", price: 2000, image: asturo },
        { name: "Penggaris", description: "Penggaris 30 cm", price: 1000, image: penggaris },
        { name: "Rautan Pensil", description: "Rautan pensil", price: 500, image: rautan },
        { name: "Penghapus", description: "Penghapus tipis", price: 500, image: penghapus },
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(
    shuffleArray(categories.flatMap((category) => category.products))
  );
  const [visibleProducts, setVisibleProducts] = useState(12);
  const originalProducts = categories.flatMap((category) => category.products);

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleProducts(12);
    filterProducts(category, searchQuery);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedProducts = [...filteredProducts];
    switch (option) {
      case "PriceLowHigh":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "PriceHighLow":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "NameAZ":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

        break;
      case "NameZA":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Default":
        sortedProducts = shuffleArray(originalProducts);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
  };

  const filterProducts = (category, query) => {
    const allProducts = shuffleArray(categories.flatMap((cat) => cat.products));
    let filtered = allProducts;

    if (category !== "Semua") {
      filtered = categories.find((cat) => cat.name === category)?.products || [];
    }

    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prevVisible) => prevVisible + 12);
  };

  return (
    <section
      className="py-20 bg-snavy bg-gradient-to-b from-snavy to-navyDark"
      id="catalog"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-left mb-10 text-white">
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Katalog <span className="text-creamyLight">Produk</span>
          </h2>
          <p className="text-lg font-light">
            Koperasi modern yang menyediakan berbagai layanan digital untuk kebutuhan Anda. Mudah, cepat, dan terpercaya.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-navyDarkest p-4 rounded-lg shadow-md gap-4">

          {/* Kategori Filter */}
          <div className="flex flex-wrap gap-2 md:w-auto">
            {["Semua", ...categories.map((cat) => cat.name)].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedCategory === category
                    ? "bg-creamyLight text-snavy"
                    : "bg-white text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Search Bar */}
          <div className="w-full md:w-1/2 relative">
          <h1 className="text-white mb-2 font-semibold">Search</h1>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari produk..."
              className="w-full px-4 py-2 rounded bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute right-4 transform -translate-y-7 text-gray-500" size={20} />
          </div>

          {/* Sort Options */}
          <div className="w-full md:w-auto">
          <h1 className="text-white mb-2 font-semibold">Sort By</h1>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-white rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Default">Default</option>
              <option value="PriceLowHigh">Harga Termurah</option>
              <option value="PriceHighLow">Harga Termahal</option>
              <option value="NameAZ">Huruf A-Z</option>
              <option value="NameZA">Huruf Z-A</option>
            </select>
          </div>
        </div>

        {/* Produk Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <div
                key={index}
                className="bg-navyDarkest rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-white">{product.name}</h4>
                  <p className="text-sm text-sbeige">{product.description}</p>
                  <p className="text-lg font-semibold text-creamy mt-2">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <button className="bg-creamyLight text-snavy px-4 py-2 rounded mt-4 w-full hover:bg-creamy transition">
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center mt-12">
            <img
              src={notFoundImage}
              alt="Produk tidak ditemukan"
              className="w-64 h-64 object-contain"
            />
            <h3 className="text-xl font-bold text-white mt-4">
              Oops! Produk tidak ditemukan
            </h3>
          </div>
        )}

        {/* Tombol Tampilkan Lebih Banyak */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreProducts}
              className="px-6 py-2 bg-creamyLight text-snavy font-semibold rounded shadow-md hover:bg-creamy transition"
            >
              Tampilkan Lebih Banyak
            </button>
          </div>
        )}
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

export default CatalogPage;
