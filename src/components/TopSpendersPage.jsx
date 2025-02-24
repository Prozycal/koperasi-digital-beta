import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RankBadge from './RankBadge';
import KPCoin from './KPCoin';
import { motion } from 'framer-motion';
import { FiUser, FiInfo } from 'react-icons/fi';

const TopSpendersPage = () => {
  const [topSpenders, setTopSpenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [showRankInfo, setShowRankInfo] = useState(false);

  const rankTiers = [
    { name: 'Eternal', minPoints: 10000, description: '' },
    { name: 'Celestial', minPoints: 7500, description: '' },
    { name: 'Mythril', minPoints: 5000, description: '' },
    { name: 'Emerald', minPoints: 3500, description: '' },
    { name: 'Diamond', minPoints: 2000, description: '' },
    { name: 'Platinum', minPoints: 1000, description: '' },
    { name: 'Gold', minPoints: 500, description: '' },
    { name: 'Silver', minPoints: 250, description: '' },
    { name: 'Bronze', minPoints: 100, description: '' },
    { name: 'User', minPoints: 0, description: '' }
  ];

  const DefaultProfileIcon = () => (
    <div className="w-full h-full bg-gradient-to-br from-navyDark to-navyDarkest flex items-center justify-center">
      <FiUser className="w-6 h-6 text-white/70" />
    </div>
  );

  useEffect(() => {
    const fetchTopSpenders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/top-spenders');
        setTopSpenders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top spenders:', error);
        setLoading(false);
      }
    };

    fetchTopSpenders();
  }, []);

  const handleImageError = (userId) => {
    setImageErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  return (
    <section className="py-16 bg-navyDarkest text-white min-h-screen" id="top">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold mb-4">
            Konest <span className="text-creamyLight">Leaderboard</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Temukan users elite kami dan pencapaian mereka. Dapatkan Konest Points (KP) melalui transaksi dan naik peringkat untuk membuka badge dan privilage eksklusif.
          </p>
          <button
            onClick={() => setShowRankInfo(!showRankInfo)}
            className="mt-4 flex items-center gap-2 mx-auto bg-navyDark hover:bg-opacity-80 px-4 py-2 rounded-lg transition-all"
          >
            <FiInfo /> {showRankInfo ? 'Tutup Rank Info' : 'Info Rank System'}
          </button>
        </div>

        {/* Rank System Information */}
        {showRankInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="bg-navyDark rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Konest Points Ranking System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rankTiers.map((tier) => (
                  <div key={tier.name} className="bg-navyDarkest rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RankBadge tier={tier.name} />
                      <KPCoin amount={tier.minPoints} className="text-sm text-yellow-400" />
                    </div>
                    <p className="text-sm text-gray-400">{tier.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-navyDarkest rounded-lg">
                <h4 className="font-semibold mb-2">Cara mendapatkan Konest Points</h4>
                <ul className="text-sm text-gray-400 list-disc list-inside">
                  <li>Setiap sekali pembelian di kisaran Rp.500 - Rp.5,000 maka akan mendapat 1-10 KP secara random</li>
                  <li>Setiap sekali pembelian diatas Rp.5,000 maka akan mendapat 10-20 KP secara random</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-creamyLight border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 max-w-3xl mx-auto">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
          {topSpenders.slice(0, 3).map((user, index) => (
            <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex flex-col items-center ${
                    index === 1 ? 'order-first' : ''
                  }`}
                >
                  <div className={`relative ${
                    index === 1 ? 'w-24 h-24' : 'w-20 h-20'
                  } mb-4`}>
                    <div className={`w-full h-full rounded-full overflow-hidden ring-4 ring-opacity-50 ${
                      index === 0 ? 'ring-fuchsia-400' :
                      index === 1 ? 'ring-blue-400' :
                      'ring-cyan-400'
                    }`}>
                      {user.profile_picture && !imageErrors[user.id] ? (
                        <img
                          src={`http://localhost:5000${user.profile_picture}`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(user.id)}
                        />
                      ) : (
                        <DefaultProfileIcon />
                      )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 bg-navyDark rounded-full flex items-center justify-center ${
                      index === 1 ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-lg'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="text-center">
                <div className="font-semibold">{user.display_name || user.username}</div>
                <RankBadge tier={user.rank_tier} />
                <div className="mt-2">
                  <KPCoin 
                    amount={user.konest_points} 
                    className="text-sm text-yellow-400"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

            {/* Rest of Leaderboard */}
            {topSpenders.slice(3).map((user, index) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + 3) * 0.1 }}
                className="bg-navyDark rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">
                    #{index + 4}
                  </span>
                  
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-creamyLight">
                    {user.profile_picture && !imageErrors[user.id] ? (
                      <img 
                        src={`http://localhost:5000${user.profile_picture}`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(user.id)}
                      />
                    ) : (
                      <DefaultProfileIcon />
                    )}
                  </div>
                  
                  <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {user.display_name || user.username}
                  </span>
                  <RankBadge tier={user.rank_tier} />
                </div>
                <KPCoin 
                  amount={user.konest_points} 
                  className="text-sm text-yellow-400 mt-1"
                />
              </div>
            </div>
          </motion.div>
            ))}
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
};

export default TopSpendersPage;