import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiTrash2 } from "react-icons/fi";
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
    phone: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const getMinDate = () => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Keep adding days until we find a weekday
    while (!isWeekday(tomorrow)) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    return tomorrow.toISOString().split("T")[0];
  };

  const isWeekday = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  };

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
    if (!localStorage.getItem("userToken")) {
      toast.error("Silakan login terlebih dahulu untuk melakukan pemesanan");
      return;
    }
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
    if (
      !checkoutInfo.phone ||
      !checkoutInfo.pickupDate ||
      !checkoutInfo.pickupTime
    ) {
      toast.warn("Mohon isi semua informasi pengambilan", {
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

    const pickupDateTime = new Date(
      `${checkoutInfo.pickupDate}T${checkoutInfo.pickupTime}`
    );
    const pickupHour = pickupDateTime.getHours();

    if (pickupHour > 14) {
      toast.error("Waktu pengambilan maksimal hingga pukul 14:00", {
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
      const username = localStorage.getItem("username");

      for (const item of cart) {
        await axios.post("http://localhost:5000/api/orders", {
          product_id: item.product.id,
          quantity: item.quantity,
          total_price: item.product.price * item.quantity,
          customer: username, // Use username instead of manual input
          phone: checkoutInfo.phone,
          pickup_date: checkoutInfo.pickupDate,
          pickup_time: checkoutInfo.pickupTime,
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
      setCheckoutInfo({ phone: "", pickupDate: "", pickupTime: "" });
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
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
                      onClick={() => removeFromCart(index)}
                      title="Hapus"
                    >
                      <FiTrash2 size={16} />
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
              <div className="mt-4 space-y-4">
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
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  maxLength={13}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Tanggal Pengambilan
                    </label>
                    <input
                      type="date"
                      value={checkoutInfo.pickupDate}
                      min={getMinDate()}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        if (isWeekday(selectedDate)) {
                          setCheckoutInfo({
                            ...checkoutInfo,
                            pickupDate: e.target.value,
                          });
                        } else {
                          toast.error(
                            "Pengambilan hanya tersedia pada hari Senin - Jumat",
                            {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "colored",
                            }
                          );
                        }
                      }}
                      className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Jam Pengambilan
                    </label>
                    <input
                      type="time"
                      value={checkoutInfo.pickupTime}
                      min="08:00"
                      max="14:00"
                      onChange={(e) =>
                        setCheckoutInfo({
                          ...checkoutInfo,
                          pickupTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Pengambilan tersedia Senin-Jumat, 08:00 - 14:00
                    </p>
                  </div>
                </div>

                <p className="text-white font-bold">Metode Pembayaran</p>
                <label className="flex items-center text-white font-normal">
                  <input type="checkbox" className="mr-2" checked disabled />
                  Pembayaran Cash On Delivery
                </label>

                <button
                  className="bg-creamyLight text-snavy px-4 py-2 rounded w-full hover:bg-creamy transition-colors"
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
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative z-50 transform transition-all duration-300 scale-100">
      {/* Close Button */}
      <button 
        onClick={() => setPopupVisible(false)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Product Image with Gradient Overlay */}
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <img
          src={`http://localhost:5000${popupProduct.image_url}`}
          alt={popupProduct.name}
          className="w-full h-64 object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h4 className="text-2xl font-bold text-gray-800">{popupProduct.name}</h4>
        
        <p className="text-gray-600 text-sm leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
          {popupProduct.description}
        </p>
        
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-snavy">
            Rp {popupProduct.price.toLocaleString("id-ID")}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Jumlah:</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={popupQuantity}
              onChange={handleChange}
              className="w-16 px-2 py-2 text-center focus:outline-none text-gray-700"
            />
            <button
              onClick={increment}
              className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setPopupVisible(false)}
          >
            Batal
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-lg bg-creamyLight text-snavy font-medium hover:bg-creamy transition-colors"
            onClick={() => handleAddToCart(popupProduct, popupQuantity)}
          >
            Masukan Keranjang
          </button>
        </div>
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
            fill="#1d2040"
            fillOpacity="1"
            d="M0,256L48,245.3C96,235,192,213,288,213.3C384,213,480,235,576,229.3C672,224,768,192,864,186.7C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default CatalogPage;
