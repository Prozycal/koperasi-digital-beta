import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import notFoundImage from "./assets/not-found.gif";
import { toast } from "react-toastify";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [cart, setCart] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: "",
    date: "",
    phone: "",
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const increment = () => {
    setPopupQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    setPopupQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setPopupQuantity(value);
    }
  };

  const handleAddToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      setCart([...cart, { product, quantity }]);
    }
    setPopupVisible(false);
  };

  const handleShowPopup = (product) => {
    setPopupProduct(product);
    setPopupQuantity(1);
    setPopupVisible(true);
  };

  const handleCheckout = async () => {
    if (!checkoutInfo.name || !checkoutInfo.phone || !checkoutInfo.date) {
      toast.warn("Isi semuanya terlebih dahulu.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    try {
      for (const item of cart) {
        await axios.post("http://localhost:5000/api/orders", {
          product_id: item.product.id,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
          customer: checkoutInfo.name,
          phone: checkoutInfo.phone,
        });
      }

      toast.success("Checkout berhasil! Pesanan akan segera diproses.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setCart([]);
      setCheckoutInfo({ name: "", phone: "", date: "" });
    } catch (error) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      toast.error("Pesanan gagal", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleProducts(12);
    const filtered =
      category === "Semua"
        ? products
        : products.filter((product) => product.category === category);
    setFilteredProducts(filtered);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedProducts = [...filteredProducts];
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
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prevVisible) => prevVisible + 12);
  };

  const removeFromCart = (index) => {
    // Filter cart untuk menghapus item berdasarkan indeks
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart); // Perbarui state cart
  };

  return (
    <section
      className="py-20 bg-snavy bg-gradient-to-b from-snavy to-navyDark"
      id="catalog"
    >
      <div className="container mx-auto px-4">
        <div className="text-left mb-10 text-white">
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Katalog <span className="text-creamyLight">Produk</span>
          </h2>
          <p className="text-lg font-light">
            Carilah produk yang anda inginkan disini. Bijaklah dalam memilih!
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center bg-navyDarkest p-4 rounded-lg shadow-md gap-4">
          <div className="flex flex-wrap gap-2 md:w-auto">
            {[
              "Semua",
              ...new Set(products.map((product) => product.category)),
            ].map((category) => (
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

          <div className="w-full md:w-1/2 relative">
            <h1 className="text-white mb-2 font-semibold">Search</h1>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari produk..."
              className="w-full px-4 py-2 rounded bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch
              className="absolute right-4 transform -translate-y-7 text-gray-500"
              size={20}
            />
          </div>

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

        <div className="mt-5 bg-navyDarkest p-4 rounded-lg shadow-md">
          <h3 className="text-white font-bold text-lg mb-4">
            Keranjang Belanja
          </h3>
          {cart.length > 0 ? (
            <div>
              {/* Daftar Item dalam Keranjang */}
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4 text-white"
                >
                  <span>
                    {item.product.name} (x{item.quantity})
                  </span>
                  <div className="flex items-center space-x-2">
                    <span>
                      Rp{" "}
                      {(item.product.price * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                    {/* Tombol Delete */}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                      onClick={() => removeFromCart(index)} // Panggil fungsi hapus
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}

              {/* Total Harga */}
              <div className="flex justify-between items-center mt-4 text-white font-bold">
                <span>Total:</span>
                <span>
                  Rp{" "}
                  {cart
                    .reduce(
                      (acc, item) => acc + item.product.price * item.quantity,
                      0
                    )
                    .toLocaleString("id-ID")}
                </span>
              </div>

              {/* Form Checkout */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Nama"
                  value={checkoutInfo.name}
                  onChange={(e) =>
                    setCheckoutInfo({ ...checkoutInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="No. WhatsApp"
                  value={checkoutInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 13);
                    setCheckoutInfo({ ...checkoutInfo, phone: value });
                  }}
                  className="w-full px-4 py-2 rounded mb-2"
                  maxLength={13}
                />
                <input
                  type="date"
                  value={checkoutInfo.date}
                  onChange={(e) =>
                    setCheckoutInfo({ ...checkoutInfo, date: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded mb-4"
                />
                <p className="text-white font-bold mb-2">Metode Pembayaran</p>
                <label className="flex items-center text-white font-normal mb-4">
                  <input type="checkbox" className="mr-2" checked disabled />
                  Pembayaran Cash On Delivery
                </label>
                <button
                  className="bg-creamyLight text-snavy px-4 py-2 rounded w-full hover:bg-creamy transition"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sbeige">Keranjang Anda kosong.</p>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <div
                key={product.id}
                className="bg-navyDarkest rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    product.image_url
                      ? `http://localhost:5000${product.image_url}`
                      : notFoundImage
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-white">{product.name}</h4>
                  <p className="text-sm text-sbeige overflow-hidden max-h-10">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold text-creamy mt-2">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    className="bg-creamyLight text-snavy px-4 py-2 rounded mt-4 w-full hover:bg-creamy transition font-semibold"
                    onClick={() => handleShowPopup(product)}
                  >
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

        {popupVisible && popupProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" // z-50 untuk overlay
          >
            <div
              className="bg-white rounded-lg shadow-lg w-96 p-6 relative z-50" // z-50 untuk konten popup
            >
              <h4 className="text-xl font-bold mb-4">{popupProduct.name}</h4>
              <img
                src={`http://localhost:5000${popupProduct.image_url}`}
                alt={popupProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="overflow-auto max-h-10 pt-3">
                {popupProduct.description}
              </p>
              <p className="text-lg font-semibold my-4">
                Rp {popupProduct.price.toLocaleString("id-ID")}
              </p>
              <div className="flex items-center mb-4">
                <label className="mr-2">Jumlah</label>
                <button
                  onClick={decrement}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300 focus:outline-none"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={popupQuantity}
                  onChange={handleChange}
                  className="w-16 px-2 py-1 border text-center focus:outline-none"
                />
                <button
                  onClick={increment}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300 focus:outline-none"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setPopupVisible(false)}
                >
                  Batal
                </button>
                <button
                  className="bg-creamyLight text-snavy px-4 py-2 rounded"
                  onClick={() => handleAddToCart(popupProduct, popupQuantity)}
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
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
