import React, { useState, useEffect } from 'react';
import logo from './assets/yellow-icon.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiLogOut, FiUser, FiClock } from 'react-icons/fi';
import RankBadge from './RankBadge';
import KPCoin from './KPCoin';
import axios from 'axios';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [userData, setUserData] = useState({
    konest_points: 0,
    rank_tier: 'User'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setUserData({
            konest_points: response.data.konest_points || 0,
            rank_tier: response.data.rank_tier || 'User'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    // Set interval to fetch data every minute
    const interval = setInterval(fetchUserData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUnreadOrders = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const response = await axios.get(`http://localhost:5000/api/orders/unread/${username}`);
          setUnreadOrders(response.data.count);
        } catch (error) {
          console.error('Error fetching unread orders:', error);
        }
      }
    };

    
  
    fetchUnreadOrders();
    const interval = setInterval(fetchUnreadOrders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const DefaultProfileIcon = () => (
    <div className="w-full h-full bg-gradient-to-br from-navyDark to-navyDarkest flex items-center justify-center">
      <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  const navItems = [
    { href: '/#home', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#catalog', label: 'Catalog' },
    { href: '/#top', label: 'Rank' },
    { href: '/#contact', label: 'Contact' },
    { href: '/play', label: 'Games' },
  ];
  

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-0 right-0 mx-auto w-[95%] max-w-6xl z-50 transition-all duration-300 ${
        scrolled ? 'top-2' : 'top-4'
      }`}
    >
      <div className={`bg-snavy/90 backdrop-blur-md rounded-3xl shadow-lg shadow-black/20 transition-all duration-300 
        ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={logo} alt="logo" className="h-10 w-auto" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center bg-navyDarkest/50 rounded-full p-1.5">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative px-4 py-2 text-gray-300 rounded-full transition-colors hover:text-white"
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative">
  <motion.button
    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
    className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-creamyLight transition-all duration-300"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {unreadOrders > 0 && (
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-xs text-white font-medium">{unreadOrders}</span>
      </div>
    )}
                  {localStorage.getItem('profilePicture') && !imageError ? (
                    <img
                      src={`http://localhost:5000${localStorage.getItem('profilePicture')}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <DefaultProfileIcon />
                  )}
                </motion.button>

                <AnimatePresence>
  {isProfileDropdownOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className="absolute right-0 mt-2 w-72 bg-gradient-to-b from-navyDark to-navyDarkest rounded-xl 
        shadow-lg shadow-black/20 backdrop-blur-lg border border-white/10 overflow-hidden z-50"
    >
      {localStorage.getItem('userToken') ? (
        <>
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                {localStorage.getItem('profilePicture') && !imageError ? (
                  <img
                    src={`http://localhost:5000${localStorage.getItem('profilePicture')}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">
                    {localStorage.getItem('username')}
                  </p>
                  <RankBadge tier={userData.rank_tier} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <KPCoin 
                    amount={userData.konest_points} 
                    className="text-sm text-yellow-400"
        />
      </div>
    </div>
            </div>
          </div>

          <div className="p-2">
  <a
    href="/settings"
    className="flex items-center space-x-3 px-4 py-3 text-gray-300 rounded-lg 
      hover:bg-white/10 transition-all duration-200 group"
  >
    <FiSettings className="w-5 h-5 text-gray-400 group-hover:text-creamyLight 
      transition-colors" />
    <span className="group-hover:text-white">Settings</span>
  </a>

  {/* Add Order History Button Here */}
  <a
    href="/orders"
    className="flex items-center space-x-3 px-4 py-3 text-gray-300 rounded-lg 
      hover:bg-white/10 transition-all duration-200 group"
  >
    <FiClock className="w-5 h-5 text-gray-400 group-hover:text-creamyLight 
      transition-colors" />
    <span className="group-hover:text-white">Riwayat Pesanan</span>
    {unreadOrders > 0 && (
      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        {unreadOrders}
      </span>
    )}
  </a>

  <button
    onClick={() => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('username');
      localStorage.removeItem('profilePicture');
      window.location.reload();
    }}
    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 rounded-lg 
      hover:bg-red-500/10 transition-all duration-200 group"
  >
    <FiLogOut className="w-5 h-5 group-hover:text-red-300 transition-colors" />
    <span className="group-hover:text-red-300">Logout</span>
  </button>
</div>
        </>
      ) : (
        <div className="p-2">
          <a 
            href="/login" 
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 rounded-lg 
              hover:bg-white/10 transition-all duration-200 group"
          >
            <FiUser className="w-5 h-5 text-gray-400 group-hover:text-creamyLight 
              transition-colors" />
            <span className="group-hover:text-white">Sign Up</span>
          </a>
        </div>
      )}
    </motion.div>
  )}
</AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4"
              >
                <div className="bg-navyDarkest/50 rounded-2xl p-2 space-y-1">
                  {navItems.map((item) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-3 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                      whileHover={{ x: 10 }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;