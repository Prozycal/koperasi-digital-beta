import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiShoppingCart, FiList, FiMenu } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import logo from './assets/yellow-icon.png';


function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [addingCategory, setAddingCategory] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    description: '',
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
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
        toast.error('Mohon diisi semuanya!', {
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
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProducts();
      toast.success('Berhasil menambahkan produk!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      setForm({ name: '', price: '', category: '', image: null, description: '' });
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
    }
  };

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
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
        await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        fetchProducts();
        toast.success('Berhasil update produk!', {
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
        console.error('Error updating product:', error.response?.data || error.message);
    }
};

return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-snavy to-navyDark">
        {/* Header */}
        <header className="bg-navyDark text-creamyLight shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold"><img src={logo} alt="logo" className="h-13 w-20 inline-block pb-2" /> Admin</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white text-2xl md:hidden"
                    >
                        <FiMenu />
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm md:text-base"
                    onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>

        <div className="flex flex-1">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative top-0 left-0 h-full w-64 bg-navyDark text-white shadow-lg transform md:translate-x-0 transition-transform duration-300 z-50 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <nav className="min-h-screen flex flex-col space-y-2">
                    <button
                        onClick={() => {
                            setActiveTab('products');
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-navyDarkest ${
                            activeTab === 'products' ? 'bg-navyDarkest' : ''
                        }`}
                    >
                        <FiList className="text-lg" />
                        <span>Managemen Produk</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('orders');
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-navyDarkest ${
                            activeTab === 'orders' ? 'bg-navyDarkest' : ''
                        }`}
                    >
                        <FiShoppingCart className="text-lg" />
                        <span>Managemen Pesanan</span>
                    </button>
                </nav>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                ></div>
            )}

            <main className="flex-1 p-4 sm:p-6 w-full">
                {activeTab === "products" && (
                    <div className="space-y-6 px-4 lg:px-8 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
                        {/* Title */}
                        <div className="text-left mb-5">
                            <h2 className="text-5xl font-extrabold leading-tight mb-4 text-white">
                                Managemen <span className="text-creamyLight">Produk</span>
                            </h2>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 bg-white p-4 sm:p-4 rounded-lg shadow-md w-full"
                        >
                            {/* Grid Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nama Produk"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-navyDarkest text-sm sm:text-base"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Harga"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-navyDarkest text-sm sm:text-base"
                                />
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
                                        className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-navyDarkest text-sm sm:text-base"
                                    >
                                        <option value="" disabled>
                                            Pilih Kategori
                                        </option>
                                        <option value="Makanan">Makanan</option>
                                        <option value="Minuman">Minuman</option>
                                        <option value="Seragam">Seragam</option>
                                        <option value="Kebutuhan Belajar">Kebutuhan Belajar</option>
                                        <option value="Tambahkan Kategori Baru">Tambahkan Kategori Baru</option>
                                    </select>

                                    {addingCategory && (
                                        <input
                                            type="text"
                                            name="category"
                                            placeholder="Tulis kategori baru"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="mt-2 w-full border rounded px-4 py-2 focus:ring-2 focus:ring-navyDarkest text-sm sm:text-base"
                                        />
                                    )}
                                </div>
                            </div>
                            <textarea
                                name="description"
                                placeholder="Deskripsi"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-navyDarkest text-sm sm:text-base"
                            />
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-navyDarkest file:text-navyDarkest"
                            />
                            <button
                                type="submit"
                                className="bg-snavy hover:bg-navyDarkest text-white w-full sm:w-auto px-6 py-2 rounded text-sm sm:text-base"
                            >
                                Tambah Produk
                            </button>
                        </form>

                        {/* Responsive Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-navyDarkest text-white text-sm sm:text-base">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Nama</th>
                                        <th className="px-4 py-2 text-left">Kategori</th>
                                        <th className="px-4 py-2 text-left">Harga</th>
                                        <th className="px-4 py-2 text-left">Deskripsi</th>
                                        <th className="px-4 py-2 text-center">Gambar</th>
                                        <th className="px-4 py-2 text-center"> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-t">
                                            <td className="px-4 py-2 text-sm">{product.name}</td>
                                            <td className="px-4 py-2 text-sm">{product.category}</td>
                                            <td className="px-4 py-2 text-sm">Rp. {product.price.toLocaleString("id-ID")}</td>
                                            <td className="px-4 py-2 text-sm overflow-hidden">{product.description}</td>
                                            <td className="px-4 py-2 text-center">
                                                {product.image_url && (
                                                    <img
                                                        src={`http://localhost:5000${product.image_url}`}
                                                        alt={product.name}
                                                        className="w-full h-20 object-cover rounded-md"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-2 flex justify-center space-x-2">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
        onClick={() => {
            handleDelete(product.id); // Memanggil fungsi delete
            toast.error(`Produk dihapus: ${product.name}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
        <FiTrash2 />
    </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <div className="text-left mb-5">
                            <h2 className="text-5xl font-extrabold leading-tight mb-4 text-white">
                                Managemen <span className="text-creamyLight">Pesanan</span>
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-navyDarkest text-white text-sm sm:text-base">
                                    <tr>
                                        <th className="px-4 py-2 text-left">No. Pesanan</th>
                                        <th className="px-4 py-2 text-left">Nama Pembeli</th>
                                        <th className="px-4 py-2 text-left">No. WhatsApp</th>
                                        <th className="px-4 py-2 text-left">Produk</th>
                                        <th className="px-4 py-2 text-left">Jumlah</th>
                                        <th className="px-4 py-2 text-left">Total Harga</th>
                                        <th className="px-4 py-2 text-left">Status Pembayaran</th>
                                        <th className="px-4 py-2 text-center">Konfirmasi</th>
                                    </tr>
                                </thead>
                                <tbody>
    {orders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Mengurutkan dari yang terbaru ke yang terlama
        .map((order) => (
            <tr key={order.id} className="border-t">
                <td className="px-4 py-2 text-sm">{order.id}</td>
                <td className="px-4 py-2 text-sm">{order.customer}</td>
                <td className="px-4 py-2 text-sm">
                    <a
                    href={`https://wa.me/${order.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-snavy font-bold underline"
                    >
                    {order.phone}
                    </a>
                </td>
                <td className="px-4 py-2 text-sm">{order.product_name}</td>
                <td className="px-4 py-2 text-sm">{order.quantity}</td>
                <td className="px-4 py-2 text-sm">Rp. {order.total_price.toLocaleString("id-ID")}</td>
                <td className="px-4 py-2 text-sm">{order.status}</td>
                <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                        onClick={() => {
                            updateOrderStatus(order.id, "completed");
                            toast.success('Pesanan selesai!', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                        Selesai
                    </button>
                    <button
                        onClick={() => {
                            updateOrderStatus(order.id, "canceled");
                            toast.error(`Pesanan dibatalkan`, {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Batalkan
                    </button>
                </td>
            </tr>
        ))}
</tbody>

                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={editingProduct.name}
                            onChange={handleEditChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Nama Produk"
                        />
                        <input
                            type="number"
                            name="price"
                            value={editingProduct.price}
                            onChange={handleEditChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Harga"
                        />
                        <input
                            type="text"
                            name="category"
                            value={editingProduct.category}
                            onChange={handleEditChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Kategori"
                        />
                        <textarea
                            name="description"
                            value={editingProduct.description}
                            onChange={handleEditChange}
                            className="w-full border rounded px-4 py-2"
                            placeholder="Deskripsi"
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleEditChange}
                            className="block w-full text-sm"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-snavy hover:bg-navyDarkest text-white px-4 py-2 rounded"
                            >
                                Save
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
