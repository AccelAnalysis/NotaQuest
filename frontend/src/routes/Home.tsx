import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGamepad, FaMusic, FaArrowRight, FaGuitar, FaLayerGroup } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getProfile } from '../services/gamification';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import '../styles/Home.css';

type GameMode = 'treble' | 'bass' | 'both';

const gameModes = [
  {
    id: 'treble',
    name: 'Treble Clef',
    description: 'Learn notes on the upper staff with melody-friendly drills.',
    focus: 'Staff focus: Lines & spaces above middle C',
    recommendation: 'Recommended for vocalists, violin, flute, and clarinet players.',
    icon: FaMusic
  },
  {
    id: 'bass',
    name: 'Bass Clef',
    description: 'Master low-end notes with rhythmic anchoring exercises.',
    focus: 'Staff focus: Lines & spaces below middle C',
    recommendation: 'Recommended for bass, cello, trombone, and tuba players.',
    icon: FaGuitar
  },
  {
    id: 'both',
    name: 'Both Clefs',
    description: 'Challenge yourself by switching between treble and bass.',
    focus: 'Staff focus: Full grand staff coverage',
    recommendation: 'Recommended for pianists, composers, and theory refreshers.',
    icon: FaLayerGroup
  }
] satisfies Array<{
  id: GameMode;
  name: string;
  description: string;
  focus: string;
  recommendation: string;
  icon: typeof FaMusic;
}>;

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('treble');
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
            <div className="max-w-5xl mx-auto mb-10 w-full">
              <p className="text-sm text-indigo-200 uppercase tracking-[0.2em] mb-3">Choose your focus</p>
              <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                {gameModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={`group relative w-full text-left rounded-2xl border transition-all duration-300 p-6 backdrop-blur bg-gray-800/60 hover:bg-gray-800/90 hover:-translate-y-1 ${
                        isSelected ? 'border-indigo-500/70 shadow-lg shadow-indigo-500/20' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-xl p-3 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-900/40 text-indigo-200'
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-[0.18em] text-indigo-300 mb-1">{mode.focus}</p>
                          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                            {mode.name}
                            {isSelected && <span className="text-xs font-medium text-indigo-200 bg-indigo-900/50 px-2 py-0.5 rounded-full">Selected</span>}
                          </h3>
                          <p className="text-sm text-gray-300 mb-3 leading-relaxed">{mode.description}</p>
                          <p className="text-xs text-indigo-200 bg-indigo-900/40 border border-indigo-700/50 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400" />
                            {mode.recommendation}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 rounded-2xl border pointer-events-none transition-opacity duration-300 ${
                          isSelected ? 'border-indigo-400/40 opacity-100' : 'border-transparent opacity-0 group-hover:opacity-100 group-hover:border-indigo-300/30'
                        }`}
                      ></div>
                    </button>
                  );
                })}
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
