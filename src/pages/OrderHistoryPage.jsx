import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiShoppingBag, FiPhone, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const itemsPerPage = 10;
  const adminWhatsApp = "1234567890"; // Replace with actual admin number

  // Move useEffect out of fetchOrders
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // Add useEffect for sorting
  useEffect(() => {
    setOrders(prevOrders => sortOrders(prevOrders));
  }, [sortOption]);

  const sortOrders = (ordersToSort) => {
    switch (sortOption) {
      case 'newest':
        return [...ordersToSort].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return [...ordersToSort].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'highest':
        return [...ordersToSort].sort((a, b) => b.total_price - a.total_price);
      case 'lowest':
        return [...ordersToSort].sort((a, b) => a.total_price - b.total_price);
      default:
        return ordersToSort;
    }
  };

  const fetchOrders = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get(`http://localhost:5000/api/orders/user/${username}`);
      const allOrders = response.data;
      setTotalPages(Math.ceil(allOrders.length / itemsPerPage));
      
      // Mark orders as read
      const unreadOrders = allOrders.filter(order => !order.is_read);
      if (unreadOrders.length > 0) {
        unreadOrders.forEach(async (order) => {
          await axios.patch(`http://localhost:5000/api/orders/${order.id}/read`);
        });
      }

      setOrders(sortOrders(allOrders));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'canceled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const handleWhatsAppClick = (orderId) => {
    const message = `Halo admin, saya ingin menanyakan tentang pesanan #${orderId}`;
    window.open(`https://wa.me/62${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-snavy via-navyDark to-navyDarkest pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
          <div className="text-left mb-10 text-white">
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Riwayat <span className="text-creamyLight">Pesanan</span>
          </h2>
          <p className="text-lg font-light">
            Lihat semua pesanan yang pernah kamu buat di sini
          </p>
        </div>
          </div>
          
          {/* Add sorting dropdown */}
          <div className="relative group">
  <select
    value={sortOption}
    onChange={handleSortChange}
    className="appearance-none bg-white/5 backdrop-blur-sm text-white px-4 py-2.5 pr-10 rounded-xl 
      border border-white/10 focus:outline-none focus:ring-2 focus:ring-creamyLight/50 
      hover:bg-white/10 transition-all duration-300 font-medium min-w-[180px]
      cursor-pointer"
  >
    <option value="newest" className="bg-navyDarkest text-white">Terbaru</option>
    <option value="oldest" className="bg-navyDarkest text-white">Terlama</option>
    <option value="highest" className="bg-navyDarkest text-white">Harga Tertinggi</option>
    <option value="lowest" className="bg-navyDarkest text-white">Harga Terendah</option>
  </select>
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <FiChevronDown className="w-5 h-5 text-creamyLight group-hover:text-white transition-colors duration-300" />
  </div>
  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-creamyLight/0 via-creamyLight/5 to-creamyLight/0 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
</div>
        </div>

        <div className="space-y-6">
          {orders
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((order) => (
            <div key={order.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Pesanan #{order.id}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-400 flex items-center">
                      <FiShoppingBag className="mr-2" />
                      {order.product_name} x {order.quantity}
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <FiCalendar className="mr-2" />
                      Pengambilan: {new Date(order.pickup_date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-400 flex items-center">
                      <FiClock className="mr-2" />
                      Pukul: {order.pickup_time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-semibold mb-2">
                    Rp {order.total_price.toLocaleString('id-ID')}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleWhatsAppClick(order.id)}
                className="mt-4 flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>Hubungi Admin</span>
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === index + 1
                    ? 'bg-creamyLight text-navyDarkest'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;