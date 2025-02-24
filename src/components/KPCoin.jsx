import React from 'react';
import { motion } from 'framer-motion';

const KPCoin = ({ amount, className = '' }) => {
  return (
    <motion.div
      className={`inline-flex items-center gap-1 ${className}`}
    >
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 flex items-center justify-center shadow-lg ring-2 ring-yellow-500/20">
          <span className="text-xs font-bold text-yellow-800">KP</span>
          <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse"></div>
        </div>
      </div>
      <span className="font-medium">{amount.toLocaleString()}</span>
    </motion.div>
  );
};

export default KPCoin;