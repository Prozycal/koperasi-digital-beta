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
    <div className="min-h-screen bg-gradient-to-br from-snavy via-navyDark to-navyDarkest pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header and Sort Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 mt-10">
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2 md:mb-4">
              Riwayat <span className="text-creamyLight">Pesanan</span>
            </h2>
            <p className="text-base md:text-lg font-light">
              Lihat semua pesanan yang pernah kamu buat di sini
            </p>
          </div>
          
          {/* Sorting dropdown - Full width on mobile */}
          <div className="relative group w-full md:w-auto">
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full md:w-auto appearance-none bg-white/5 backdrop-blur-sm text-white px-4 py-2.5 pr-10 rounded-xl 
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
          </div>
        </div>
  
        {/* Orders List */}
        <div className="space-y-4 md:space-y-6">
          {orders
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((order) => (
            <div key={order.id} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white/10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Order Details */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Pesanan #{order.id}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-400 flex items-center text-sm md:text-base">
                      <FiShoppingBag className="mr-2 flex-shrink-0" />
                      <span className="break-words">{order.product_name} x {order.quantity}</span>
                    </p>
                    <p className="text-gray-400 flex items-center text-sm md:text-base">
                      <FiCalendar className="mr-2 flex-shrink-0" />
                      <span className="break-words">
                        {new Date(order.pickup_date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                    <p className="text-gray-400 flex items-center text-sm md:text-base">
                      <FiClock className="mr-2 flex-shrink-0" />
                      Pukul: {order.pickup_time}
                    </p>
                  </div>
                </div>
  
                {/* Price and Status */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:gap-0">
                  <p className="text-white font-semibold text-base md:text-lg md:mb-2">
                    Rp {order.total_price.toLocaleString('id-ID')}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
  
              {/* WhatsApp Button */}
              <button
                onClick={() => handleWhatsAppClick(order.id)}
                className="mt-4 w-full md:w-auto flex items-center justify-center md:justify-start space-x-2 text-green-400 hover:text-green-300 transition-colors bg-green-400/10 md:bg-transparent rounded-lg p-2 md:p-0"
              >
                <FiPhone className="w-4 h-4" />
                <span>Hubungi Admin</span>
              </button>
            </div>
          ))}
        </div>
  
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center flex-wrap gap-2 mt-8">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 md:px-4 py-2 rounded-lg transition-all text-sm md:text-base ${
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