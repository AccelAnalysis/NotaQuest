import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGamepad, FaMusic, FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getProfile } from '../services/gamification';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import '../styles/Home.css';

type GameMode = 'treble' | 'bass' | 'both';

const gameModes = [
  { id: 'treble', name: 'Treble Clef', description: 'Learn notes in the treble clef' },
  { id: 'bass', name: 'Bass Clef', description: 'Master the bass clef' },
  { id: 'both', name: 'Both Clefs', description: 'Challenge yourself with both clefs' },
];

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('treble');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Profile state will be used in a future update
  const [profile] = useState<{ level: number; xp: number } | null>(null);
  const [isLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await getProfile(token);
        setProfile({
          level: userProfile.level,
          xp: userProfile.xp
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const startGame = () => {
    navigate(`/play?mode=${selectedMode}`);
  };

  const selectedGameMode = gameModes.find(mode => mode.id === selectedMode);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <NavBar />
      
      {/* Main Content with Background */}
      <main className="flex-grow relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1511671782779-c97d3d27d5f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 mb-6">
              <FaMusic className="mr-2 text-indigo-400" />
              <span className="text-indigo-300 font-medium">Music Theory Mastery</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Learn to Read <span className="text-indigo-400">Music</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Master musical notation through interactive exercises and games. Perfect for beginners and experienced musicians alike.
            </p>

            {/* Game Mode Selection */}
            <div className="max-w-md mx-auto mb-10">
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl py-4 px-6 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div>
                    <p className="text-sm text-gray-400">Game Mode</p>
                    <p className="text-white font-medium">{selectedGameMode?.name}</p>
                    <p className="text-sm text-gray-400 mt-1">{selectedGameMode?.description}</p>
                  </div>
                  <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
                    {gameModes.map((mode) => (
                      <div
                        key={mode.id}
                        className={`px-6 py-3 cursor-pointer hover:bg-gray-700/50 transition-colors duration-150 ${
                          selectedMode === mode.id ? 'bg-indigo-900/30' : ''
                        }`}
                        onClick={() => {
                          setSelectedMode(mode.id as GameMode);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <p className="text-white font-medium">{mode.name}</p>
                        <p className="text-sm text-gray-400">{mode.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                <FaGamepad className="mr-3" />
                Start Practicing
                <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaMusic className="h-6 w-6 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">NotaQuest</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              {token && (
                <Link to="/progress" className="text-gray-400 hover:text-white transition-colors">
                  My Progress
                </Link>
              )}
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NotaQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
