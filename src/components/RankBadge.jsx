import React from 'react';
import { loadSlim } from "tsparticles-slim";

const RankBadge = ({ tier }) => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const renderEliteBadge = (tier) => {
    return (
      <div className="relative">
        <span className={`rank-badge ${getBadgeClass()}`}>
          {tier}
          <div className="badge-sparkles"></div>
        </span>
        
      </div>
    );
  };

  const getBadgeClass = () => {
    switch (tier) {
      case 'Eternal':
        return 'badge-eternal';
      case 'Celestial':
        return 'badge-celestial';
      case 'Mythril':
        return 'badge-mythril';
      case 'Emerald':
        return 'badge-emerald';
      case 'Diamond':
        return 'badge-diamond';
      case 'Platinum':
        return 'badge-platinum';
      case 'Gold':
        return 'badge-gold';
      case 'Silver':
        return 'badge-silver';
      case 'Bronze':
        return 'badge-bronze';
      default:
        return 'badge-user';
    }
  };

  return tier === 'Eternal' || tier === 'Celestial' || tier === 'Mythril' 
    ? renderEliteBadge(tier)
    : (
      <span className={`rank-badge ${getBadgeClass()}`}>
        {tier}
      </span>
    );
};

export default RankBadge;