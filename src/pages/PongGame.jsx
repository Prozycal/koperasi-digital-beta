import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import KPCoin from '../components/KPCoin';
import RankBadge from '../components/RankBadge';

const BASE_BALL_SPEED = 5;
const MAX_BALL_SPEED = 15;
const SPEED_INCREMENT = 0.3;
const DIFFICULTY_INCREASE_INTERVAL = 30; // Frames until speed increase

const PongGame = () => {
    const [gameStats, setGameStats] = useState({
      highScore: 0
    });
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedKP, setEarnedKP] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [ballSpeed, setBallSpeed] = useState(6);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playsRemaining, setPlaysRemaining] = useState(5);
  const [cooldownEnds, setCooldownEnds] = useState(null);
  const [timeUntilReset, setTimeUntilReset] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get(
          'http://localhost:5000/api/users/game-availability/pong',
          { headers: { Authorization: `Bearer ${token}` }}
        );

        setPlaysRemaining(response.data.playsRemaining);
        if (response.data.cooldownEnds) {
          setCooldownEnds(new Date(response.data.cooldownEnds));
          setTimeUntilReset(response.data.timeUntilReset);
        }
      } catch (error) {
        console.error('Error checking game availability:', error);
      }
    };

    checkAvailability();
  }, []);

  useEffect(() => {
    if (!cooldownEnds) return;

    const timer = setInterval(() => {
      const now = new Date();
      const timeLeft = cooldownEnds - now;
      
      if (timeLeft <= 0) {
        setCooldownEnds(null);
        setTimeUntilReset(null);
        setPlaysRemaining(5);
      } else {
        setTimeUntilReset(timeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownEnds]);

  // Format time remaining function
  const formatTimeRemaining = (ms) => {
    if (!ms) return '';
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Fetch initial game stats
  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/users/game-stats/pong', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data?.highScore) {
          setGameStats({ highScore: response.data.highScore });
          setHighScore(response.data.highScore);
        }
      } catch (error) {
        console.error('Error fetching game stats:', error);
      }
    };

    if (isFirstLoad) {
      fetchGameStats();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/game-leaderboard/pong');
        setLeaderboard(response.data.slice(0, 5)); // Get top 5 players
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
  
    fetchLeaderboard();
  }, []);

  // Game loop effect
  useEffect(() => {
    if (!gameStarted) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let currentScore = 0;
    
    // Improved paddle object with better mobile control
    const paddle = {
      width: Math.min(canvas.width * 0.2, 100), // Responsive paddle width
      height: 10,
      x: canvas.width / 2 - 50,
      y: canvas.height - 20,
      speed: 8,
      targetX: canvas.width / 2 - 50, // For smooth movement
    };
  
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 8,
        speed: BASE_BALL_SPEED,
        dx: BASE_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
        dy: -BASE_BALL_SPEED,
        frameCount: 0
      };
  
    // Improved touch/mouse handling
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      if (x) {
        paddle.targetX = Math.max(0, Math.min(x - paddle.width / 2, canvas.width - paddle.width));
      }
    };
  
    // Add touch start handler for mobile
    const handleTouchStart = (e) => {
      e.preventDefault();
      handleMove(e);
    };
  
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart);
  
    // Improved game loop with smooth paddle movement and better physics
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Smooth paddle movement
      const paddleDiff = paddle.targetX - paddle.x;
      paddle.x += paddleDiff * 0.2; // Smooth follow
  
      // Draw paddle with glow effect
      ctx.fillStyle = '#4FD1C5';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4FD1C5';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;
  
      // Draw ball with glow effect
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      ctx.fillStyle = '#F6E05E';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#F6E05E';
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
  
      // Improved ball movement with speed limiting
      ball.x += ball.dx;
      ball.y += ball.dy;
  
      // Wall collision with improved bounce angles
      if (ball.x - ball.size <= 0 || ball.x + ball.size >= canvas.width) {
        ball.dx *= -1;
        ball.x = Math.min(Math.max(ball.x, ball.size), canvas.width - ball.size);
      }
      if (ball.y - ball.size <= 0) {
        ball.dy *= -1;
        ball.y = ball.size;
      }
  
      // Improved paddle collision with segments and angle calculation
      if (ball.y + ball.size > paddle.y && 
        ball.y - ball.size < paddle.y + paddle.height && 
        ball.x > paddle.x && 
        ball.x < paddle.x + paddle.width) {
      
      // Calculate where the ball hit the paddle (0-1)
      const hitPos = (ball.x - paddle.x) / paddle.width;
      
      // Calculate new angle (-60 to 60 degrees)
      const angle = (hitPos - 0.5) * Math.PI * 0.66;
      
      // Progressive speed increase
      const newSpeed = Math.min(ball.speed + SPEED_INCREMENT, MAX_BALL_SPEED);
      
      // Update ball velocities with new speed and angle
      ball.speed = newSpeed;
      ball.dx = Math.sin(angle) * newSpeed;
      ball.dy = -Math.cos(angle) * newSpeed;
      
      // Ensure ball is above paddle
      ball.y = paddle.y - ball.size;
      
      // Update score and KP
      currentScore++;
      setScore(currentScore);
      updateKonestPoints();
    }

    ball.frameCount++;
if (ball.frameCount >= DIFFICULTY_INCREASE_INTERVAL) {
  ball.frameCount = 0;
  const speedIncrease = 0.1;
  const newSpeed = Math.min(ball.speed + speedIncrease, MAX_BALL_SPEED);
  if (newSpeed > ball.speed) {
    const speedRatio = newSpeed / ball.speed;
    ball.speed = newSpeed;
    ball.dx *= speedRatio;
    ball.dy *= speedRatio;
  }
}
  
      // Game over condition with improved collision check
      if (ball.y - ball.size > canvas.height) {
        handleGameOver(currentScore);
        return;
      }
  
      animationFrameId = requestAnimationFrame(gameLoop);
    };
  
    gameLoop();
  
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, [gameStarted]);

  // Handle game over
  const handleGameOver = useCallback(async (finalScore) => {
    setGameStarted(false);
    setScore(finalScore);
    
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
  
      // Save the score
      const response = await axios.post(
        'http://localhost:5000/api/users/game-score', 
        { score: finalScore, gameType: 'pong' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update high score if necessary
      if (response.data?.highScore) {
        const newHighScore = response.data.highScore;
        setHighScore(newHighScore);
        setGameStats(prev => ({ ...prev, highScore: newHighScore }));
        
        if (finalScore >= newHighScore) {
          toast.success('New High Score! 🎉');
        }
      }

      // Update plays remaining and check for cooldown
    const availabilityResponse = await axios.get(
        'http://localhost:5000/api/users/game-availability/pong',
        { headers: { Authorization: `Bearer ${token}` }}
      );
  
      setPlaysRemaining(availabilityResponse.data.playsRemaining);
      
      // If no plays remaining, set cooldown
      if (availabilityResponse.data.cooldownEnds) {
        setCooldownEnds(new Date(availabilityResponse.data.cooldownEnds));
        setTimeUntilReset(availabilityResponse.data.timeUntilReset);
      }
  
      toast.info(`Game Over! Score: ${finalScore}`);
  } catch (error) {
    console.error('Error saving score:', error);
    toast.info(`Game Over! Score: ${finalScore}`);
  }
}, []);

  // Update KP points
  const updateKonestPoints = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.post(
        'http://localhost:5000/api/users/add-kp', 
        { amount: 1 },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setEarnedKP(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating KP:', error);
      if (!error.config?.silent) {
        toast.error('Failed to update KP');
      }
    }
  };

  // Reset game
  const resetGame = () => {
    // Only allow reset if there are plays remaining
    if (playsRemaining > 0 && !timeUntilReset) {
      setScore(0);
      setGameStarted(true);
      setBallSpeed(BASE_BALL_SPEED);
      setEarnedKP(0);
      // Decrease plays remaining locally for immediate feedback
      setPlaysRemaining(prev => Math.max(0, prev - 1));
    }
  };

  // Update the DefaultProfileIcon component to return an SVG element
const createDefaultProfileIcon = () => {
    const div = document.createElement('div');
    div.className = 'w-full h-full bg-gradient-to-br from-navyDark to-navyDarkest flex items-center justify-center';
    div.innerHTML = `
      <svg class="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    `;
    return div;
  };
  
  // Update the DefaultProfileIcon component for React rendering
  const DefaultProfileIcon = () => (
    <div className="w-full h-full bg-gradient-to-br from-navyDark to-navyDarkest flex items-center justify-center">
      <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-navyDarkest py-20 px-4">
      <div className="max-w-2xl mx-auto mt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Konest <span className="text-creamyLight">Play!</span>
          </h1>
          <p className="text-gray-400">Hit the ball to earn Konest Points!</p>
        </div>

        <div className="bg-navyDark rounded-xl p-6 shadow-lg">
            
          {/* Score Display */}
          <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <p className="text-sm opacity-70">Current Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="text-white text-right">
            <p className="text-sm opacity-70">High Score</p>
            <p className="text-2xl font-bold">{highScore}</p>
          </div>
        </div>

          {/* KP Earned Display */}
        <div className="bg-navyDarkest rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-400 mb-1">Earned this session:</p>
          <KPCoin amount={earnedKP} className="text-lg text-white" />
        </div>

          {/* Add this section for plays remaining and cooldown */}
        <div className="mb-4 text-center">
          {timeUntilReset ? (
            <div className="bg-red-500/10 text-red-300 rounded-lg p-3">
              <p className="text-sm mb-1">Daily limit reached! Play again in:</p>
              <p className="font-mono font-bold">{formatTimeRemaining(timeUntilReset)}</p>
            </div>
          ) : (
            <div className="bg-green-500/10 text-green-300 rounded-lg p-3">
              <p className="text-sm mb-1">Plays remaining today:</p>
              <p className="font-bold text-lg">{playsRemaining}</p>
            </div>
          )}
        </div>

        {/* Disable game start if no plays remaining */}
        <div className="relative rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full bg-navyDarkest"
          />

          {(!gameStarted || timeUntilReset) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                disabled={timeUntilReset > 0}
                className={`px-8 py-3 rounded-lg font-bold shadow-lg transition-all
                  ${timeUntilReset 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-creamyLight text-navyDarkest hover:shadow-creamyLight/20'
                  }`}
              >
                {timeUntilReset
                  ? 'Come back tomorrow!'
                  : score > 0 ? 'Play Again' : 'Start Game'}
              </motion.button>
            </div>
          )}
        </div>

          {/* Leaderboard */}
<div className="bg-navyDarkest rounded-lg p-4 mb-4 mt-5">
  <h3 className="text-white font-semibold mb-3">Top 5 Players</h3>
  <div className="space-y-2">
  {leaderboard.map((player, index) => (
  <div 
    key={player.id}
    className="flex items-center gap-3 bg-navyDark/50 rounded-lg p-2"
  >
    <div className="flex-none w-8 h-8 rounded-full overflow-hidden ring-2 ring-creamyLight/20">
      {player.profile_picture ? (
        <img
          src={`http://localhost:5000${player.profile_picture}`}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            const defaultIcon = createDefaultProfileIcon();
            e.target.parentElement.appendChild(defaultIcon);
          }}
        />
      ) : (
        <DefaultProfileIcon />
      )}
    </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white/90 font-medium truncate">
              {player.display_name || player.username}
            </span>
            <RankBadge tier={player.rank_tier} />
          </div>
        </div>
        <div className="flex-none text-right">
          <div className="text-creamyLight font-bold">{player.high_score}</div>
          <div className="text-xs text-white/50">High Score</div>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Instructions */}
          <div className="mt-4 text-gray-400 text-sm">
            <p className="mb-2">Instructions:</p>
            <ul className="list-disc list-inside space-y-1 opacity-70">
              <li>Move your mouse or finger to control the paddle</li>
              <li>Hit the ball to earn 1 KP</li>
              <li>Ball speed increases with each hit</li>
              <li>Try to keep the ball in play as long as possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PongGame;