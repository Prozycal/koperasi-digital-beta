import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash2,
  FiShoppingCart,
  FiList,
  FiMenu,
  FiX,
  FiCheck,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "./assets/yellow-icon.png";
import UserManagementPage from "./UserManagementPage";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [setAddingCategory] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
    description: "",
  });
  // Add these state variables at the beginning of the AdminPanel component
  const [currentProductsPage, setCurrentProductsPage] = useState(1);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const itemsPerPage = 10;

  // Add these pagination helper functions
  const indexOfLastProduct = currentProductsPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const indexOfLastOrder = currentOrdersPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const productPageCount = Math.ceil(products.length / itemsPerPage);
  const orderPageCount = Math.ceil(orders.length / itemsPerPage);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center items-center space-x-2 p-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-navyDark text-white hover:bg-navyDarkest"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === index + 1
                ? "bg-creamyLight text-navyDarkest font-bold"
                : "bg-navyDark text-white hover:bg-navyDarkest"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-navyDark text-white hover:bg-navyDarkest"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  const TableInfo = ({ total, currentPage, itemsPerPage }) => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);

    return (
      <div className="text-sm text-gray-300 mt-4 p-4">
        Showing {start} to {end} of {total} entries
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error("Mohon diisi semuanya!", {
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

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProducts();
      toast.success("Berhasil menambahkan produk!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setForm({
        name: "",
        price: "",
        category: "",
        image: null,
        description: "",
      });
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // Add state for edit modal and editing product
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle edit button click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: files ? files[0] : value,
    });
  };

  // Handle edit product submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editingProduct).forEach((key) => {
        formData.append(key, editingProduct[key]);
      });
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchProducts();
      toast.success("Berhasil update produk!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message
      );
    }
  };

  const toggleStockStatus = async (productId, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/products/${productId}/stock-status`,
        {
          is_out_of_stock: !currentStatus,
        }
      );
      fetchProducts(); // Refresh the product list
      toast.success("Status stok berhasil diperbarui");
    } catch (error) {
      console.error("Error toggling stock status:", error);
      toast.error("Gagal memperbarui status stok");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-snavy via-navyDark to-navyDarkest">
      {/* Floating Pill Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
        <nav className="bg-navyDark/90 backdrop-blur-md rounded-3xl shadow-lg shadow-black/20">
          <div className="px-4 py-2">
            {/* Desktop Navigation */}
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center space-x-3">
                <img src={logo} alt="logo" className="h-10 w-auto" />
              </div>

              {/* Navigation Pills */}
              <div className="hidden md:flex items-center bg-navyDarkest/50 rounded-full p-1.5">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                            ${
                              activeTab === "products"
                                ? "bg-creamyLight text-navyDarkest shadow-lg"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiList className="text-lg" />
                  <span>Produk</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                            ${
                              activeTab === "orders"
                                ? "bg-creamyLight text-navyDarkest shadow-lg"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiShoppingCart className="text-lg" />
                  <span>Pesanan</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                            ${
                              activeTab === "users"
                                ? "bg-creamyLight text-navyDarkest shadow-lg"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiUsers className="text-lg" />
                  <span>Users</span>
                </button>
              </div>

              {/* Right Section with Logout */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full 
                            bg-red-500/90 hover:bg-red-600 text-white transition-all duration-300"
                >
                  <span>Logout</span>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-full text-gray-300 hover:text-white 
                            hover:bg-white/10 transition-colors"
                >
                  {isSidebarOpen ? (
                    <FiX className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div
              className={`md:hidden transition-all duration-300 ease-in-out
                    ${
                      isSidebarOpen
                        ? "max-h-60 opacity-100 mt-3"
                        : "max-h-0 opacity-0 invisible"
                    }`}
            >
              <div className="bg-navyDarkest/50 rounded-2xl p-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-3 rounded-xl transition-all
                            ${
                              activeTab === "products"
                                ? "bg-creamyLight text-navyDarkest"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiList className="text-xl" />
                  <span>Produk</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-3 rounded-xl transition-all
                            ${
                              activeTab === "orders"
                                ? "bg-creamyLight text-navyDarkest"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiShoppingCart className="text-xl" />
                  <span>Pesanan</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-3 rounded-xl transition-all
                            ${
                              activeTab === "users"
                                ? "bg-creamyLight text-navyDarkest"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <FiUsers className="text-xl" />
                  <span>Users</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl 
                            bg-red-500/90 hover:bg-red-600 text-white transition-all"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Add padding top to main content to account for fixed navbar */}
      <div className="flex flex-1 pt-24">
        {/* Enhanced Main Content */}
        <main className="flex-1 p-3 lg:p-8 w-full">
          {activeTab === "products" && (
            <div className="space-y-8 px-4 lg:px-8 max-w-7xl mx-auto">
              {/* Enhanced Title */}
              <div className="text-left mb-8">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  <span className="text-white">Managemen </span>
                  <span className="text-creamyLight">Produk</span>
                </h2>
                <p className="text-white/80">
                  Kelola produk koperasi dengan mudah dan efisien
                </p>
              </div>

              {/* Enhanced Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Produk"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                                    focus:ring-navyDarkest focus:border-transparent transition-all duration-300"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                                    focus:ring-navyDarkest focus:border-transparent transition-all duration-300"
                  />

                  {/* Category Select with enhanced styling */}
                  <div className="relative">
                    <select
                      name="category"
                      value={form.category}
                      onChange={(e) => {
                        if (e.target.value === "Tambahkan Kategori Baru") {
                          setAddingCategory(true);
                        } else {
                          handleChange(e);
                          setAddingCategory(false);
                        }
                      }}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                                        focus:ring-navyDarkest focus:border-transparent transition-all duration-300 
                                        appearance-none bg-white"
                    >
                      <option value="" disabled>
                        Pilih Kategori
                      </option>
                      <option value="Makanan">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Seragam">Seragam</option>
                      <option value="Kebutuhan Belajar">
                        Kebutuhan Belajar
                      </option>
                      <option value="Tambahkan Kategori Baru">
                        Tambahkan Kategori Baru
                      </option>
                    </select>
                  </div>
                </div>

                <textarea
                  name="description"
                  placeholder="Deskripsi Produk"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                                focus:ring-navyDarkest focus:border-transparent transition-all duration-300 min-h-[100px]"
                />

                <div className="flex flex-col space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gambar Produk
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                                    file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navyDark 
                                    file:text-white hover:file:bg-navyDarkest transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-snavy hover:bg-navyDarkest text-white w-full sm:w-auto px-8 py-3 
                                rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg 
                                hover:shadow-snavy/20 active:scale-95"
                >
                  Tambah Produk
                </button>
              </form>

              {/* Products Table with enhanced styling */}
              <div className="overflow-auto bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Harga
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm text-white font-semibold">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          Rp. {product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                          {product.description}
                        </td>
                        <td className="px-6 py-4">
                          {product.image_url && (
                            <div className="flex justify-center">
                              <img
                                src={`http://localhost:5000${product.image_url}`}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg shadow-md transition-transform duration-300"
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 
                        rounded-lg transition-all duration-300 hover:shadow-lg 
                        hover:shadow-yellow-500/20"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                toggleStockStatus(
                                  product.id,
                                  product.is_out_of_stock
                                )
                              }
                              className={`p-2 rounded-lg transition-all duration-300 hover:shadow-lg
                            ${
                              product.is_out_of_stock
                                ? "bg-red-500 hover:bg-red-600 hover:shadow-red-500/20"
                                : "bg-green-500 hover:bg-green-600 hover:shadow-green-500/20"
                            } text-white`}
                              title={
                                product.is_out_of_stock
                                  ? "Tandai Tersedia"
                                  : "Tandai Kosong"
                              }
                            >
                              {product.is_out_of_stock ? (
                                <FiX className="w-4 h-4" />
                              ) : (
                                <FiCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 
                        rounded-lg transition-all duration-300 hover:shadow-lg 
                        hover:shadow-red-500/20"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TableInfo
                  total={products.length}
                  currentPage={currentProductsPage}
                  itemsPerPage={itemsPerPage}
                />
                <Pagination
                  currentPage={currentProductsPage}
                  totalPages={productPageCount}
                  onPageChange={setCurrentProductsPage}
                />
              </div>
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === "orders" && (
            <div className="space-y-8">
              <div className="text-left mb-8">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  <span className="text-white">Managemen </span>
                  <span className="text-creamyLight">Pesanan</span>
                </h2>
                <p className="text-white/80">
                  Kelola pesanan masuk dengan efisien
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-auto border border-white/10">
                <table className="w-full">
                  <thead className="min-w-full divide-y divide-white/10">
                    <tr className="bg-white/10">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        No. Pesanan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        No. WhatsApp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Produk
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total Harga
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Jadwal Pengambilan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {currentOrders
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 text-sm text-white">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <a
                              href={`https://wa.me/62${order.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white font-medium hover:underline"
                            >
                              {order.phone}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {order.product_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            Rp. {order.total_price.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-sm text-white">
                            <div>
                              <div className="font-medium">
                                {new Date(order.pickup_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <div className="text-gray-400 text-xs mt-1">
                                Pukul {order.pickup_time}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium
                                                        ${
                                                          order.status ===
                                                          "completed"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : order.status ===
                                                              "canceled"
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, "completed");
                                  toast.success("Pesanan selesai!");
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs 
                          font-medium rounded-md text-green-400 bg-green-500/10 hover:bg-green-500/20 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/50 
                          transition-all duration-200"
                              >
                                Selesai
                              </button>
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, "canceled");
                                  toast.error("Pesanan dibatalkan");
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs 
                          font-medium rounded-md text-red-400 bg-red-500/10 hover:bg-red-500/20 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 
                          transition-all duration-200"
                              >
                                Batalkan
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <TableInfo
                  total={orders.length}
                  currentPage={currentOrdersPage}
                  itemsPerPage={itemsPerPage}
                />
                <Pagination
                  currentPage={currentOrdersPage}
                  totalPages={orderPageCount}
                  onPageChange={setCurrentOrdersPage}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {activeTab === "users" && (
        <div className="flex-1">
          <UserManagementPage />
        </div>
      )}

      {/* Enhanced Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 z-10 p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Produk</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                            focus:ring-navyDarkest focus:border-transparent transition-all"
                placeholder="Nama Produk"
              />
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                            focus:ring-navyDarkest focus:border-transparent transition-all"
                placeholder="Harga"
              />
              <input
                type="text"
                name="category"
                value={editingProduct.category}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                            focus:ring-navyDarkest focus:border-transparent transition-all"
                placeholder="Kategori"
              />
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleEditChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 
                            focus:ring-navyDarkest focus:border-transparent transition-all min-h-[100px]"
                placeholder="Deskripsi"
              />
              <input
                type="file"
                name="image"
                onChange={handleEditChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                            file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navyDark 
                            file:text-white hover:file:bg-navyDarkest"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 
                                transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-white bg-snavy hover:bg-navyDarkest 
                                transition-all duration-300 hover:shadow-lg hover:shadow-snavy/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
