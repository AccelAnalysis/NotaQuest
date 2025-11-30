import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaGamepad,
  FaMusic,
  FaArrowRight,
  FaGuitar,
  FaLayerGroup,
  FaHeadphones,
  FaBookOpen,
  FaBolt,
  FaBrain
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getProfile } from '../services/gamification';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { theme } from '../theme';
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
  const [profile, setProfile] = useState<{ level: number; xp: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const practiceLabs = [
    {
      id: 'ear-training',
      title: 'Ear Training Lab',
      description: 'Identify intervals and train your musical intuition with audio-first drills.',
      icon: FaHeadphones,
      href: '/ear-training',
      badge: 'Intervals • Audio',
      image:
        'https://images.unsplash.com/photo-1507878866276-a947ef722fee?auto=format&fit=crop&w=900&q=80',
      accent: theme.palette.secondary
    },
    {
      id: 'mnemonics',
      title: 'Mnemonic Flashcards',
      description: 'Memorize lines and spaces with vivid phrases, color accents, and imagery.',
      icon: FaBookOpen,
      href: '/mnemonic',
      badge: 'Treble • Bass',
      image:
        'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80',
      accent: theme.palette.accent
    },
    {
      id: 'sight-reading',
      title: 'Sight Reading Studio',
      description: 'Read melodies on the staff with tempo-aware guidance and instant feedback.',
      icon: FaBolt,
      href: '/sight-reading',
      badge: 'Tempo • Rhythm',
      image:
        'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=900&q=80',
      accent: theme.palette.primaryStrong
    },
    {
      id: 'intervals',
      title: 'Interval Trainer',
      description: 'Practice interval jumps on a visual staff and reinforce theory with XP rewards.',
      icon: FaBrain,
      href: '/intervals',
      badge: 'Staff • Theory',
      image:
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80',
      accent: theme.palette.text
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.surfaces.page }}>
      <NavBar />
      
      {/* Main Content with Background */}
      <main className="flex-grow relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{ background: theme.gradients.pageOverlay }}
          ></div>
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
            <div
              className="inline-flex items-center px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: theme.surfaces.overlay,
                border: `1px solid ${theme.borders.strong}`
              }}
            >
              <FaMusic className="mr-2" style={{ color: theme.palette.primaryStrong }} />
              <span className="font-medium" style={{ color: theme.palette.secondary }}>
                Music Theory Mastery
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: theme.palette.text }}>
              Learn to Read <span style={{ color: theme.palette.primaryStrong }}>Music</span>
            </h1>

            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: theme.palette.textMuted }}>
              Master musical notation through interactive exercises and games. Perfect for beginners and experienced musicians alike.
            </p>

            <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] mb-10 items-stretch">
              <div
                className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-left"
                style={{
                  background: theme.gradients.aurora,
                  boxShadow: theme.shadows.glow,
                  border: `1px solid ${theme.borders.strong}`
                }}
              >
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%)]" />
                <div className="relative z-10 space-y-4">
                  <p className="text-sm uppercase tracking-[0.2em]" style={{ color: theme.palette.text }}>
                    Practice that feels like play
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: theme.palette.text }}>
                    Guided sessions, live feedback, and visuals to keep you motivated.
                  </h2>
                  <p className="text-base md:text-lg" style={{ color: theme.palette.text }}>
                    Switch between clefs instantly, see mnemonics on the staff, and jump into ear training without leaving the home screen.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Ear Training", "Sight Reading", "Flashcards", "Intervals"].map((label) => (
                      <span
                        key={label}
                        className="text-xs px-3 py-2 rounded-full"
                        style={{
                          backgroundColor: theme.surfaces.overlay,
                          color: theme.palette.text,
                          border: `1px solid ${theme.borders.subtle}`
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="relative rounded-3xl overflow-hidden min-h-[280px]"
                style={{ border: `1px solid ${theme.borders.subtle}`, boxShadow: theme.shadows.soft }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1484573026400-351044c1c1c7?auto=format&fit=crop&w=1200&q=80)'
                  }}
                ></div>
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(5, 7, 18, 0.4), rgba(5, 7, 18, 0.85))' }}
                ></div>
                <div className="relative z-10 h-full w-full flex flex-col justify-end p-6 text-left">
                  <p className="text-sm uppercase tracking-[0.2em] mb-2" style={{ color: theme.palette.secondary }}>
                    Visual Story
                  </p>
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.palette.text }}>
                    Colorful imagery keeps practice inspiring
                  </h3>
                  <p className="text-sm" style={{ color: theme.palette.textMuted }}>
                    Scenic backdrops, glowing gradients, and instrument shots add atmosphere to every session.
                  </p>
                </div>
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="max-w-5xl mx-auto mb-10 w-full">
              <p
                className="text-sm uppercase tracking-[0.2em] mb-3"
                style={{ color: theme.palette.secondary }}
              >
                Choose your focus
              </p>
              <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                {gameModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className="group relative w-full text-left rounded-2xl border transition-all duration-300 p-6 backdrop-blur hover:-translate-y-1"
                      style={{
                        backgroundColor: isSelected ? theme.surfaces.overlayStrong : theme.surfaces.overlay,
                        borderColor: isSelected ? theme.borders.strong : theme.borders.subtle,
                        boxShadow: isSelected ? theme.shadows.glow : theme.shadows.soft,
                        color: theme.palette.text
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="rounded-xl p-3 flex items-center justify-center shrink-0 transition-colors duration-300"
                          style={{
                            background: isSelected ? theme.gradients.auroraStrong : theme.gradients.aurora,
                            color: isSelected ? theme.palette.text : theme.palette.text
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-[0.18em] mb-1" style={{ color: theme.palette.secondary }}>
                            {mode.focus}
                          </p>
                          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: theme.palette.text }}>
                            {mode.name}
                            {isSelected && (
                              <span
                                className="text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: theme.surfaces.overlay,
                                  color: theme.palette.secondary,
                                  border: `1px solid ${theme.borders.subtle}`
                                }}
                              >
                                Selected
                              </span>
                            )}
                          </h3>
                          <p className="text-sm mb-3 leading-relaxed" style={{ color: theme.palette.textMuted }}>
                            {mode.description}
                          </p>
                          <p
                            className="text-xs rounded-lg px-3 py-2 inline-flex items-center gap-2"
                            style={{
                              color: theme.palette.secondary,
                              backgroundColor: theme.surfaces.overlay,
                              border: `1px solid ${theme.borders.subtle}`
                            }}
                          >
                            <span
                              className="inline-block h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: theme.palette.secondary }}
                            />
                            {mode.recommendation}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 rounded-2xl border pointer-events-none transition-opacity duration-300"
                        style={{
                          borderColor: theme.borders.strong,
                          opacity: isSelected ? 1 : 0,
                          background: isSelected ? theme.gradients.aurora : 'transparent'
                        }}
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
              className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-xl transition-all duration-300 overflow-hidden group"
              style={{
                background: theme.gradients.auroraStrong,
                color: theme.palette.text,
                boxShadow: theme.shadows.glow,
                border: `1px solid ${theme.borders.strong}`
              }}
            >
              <span className="relative z-10 flex items-center">
                <FaGamepad className="mr-3" />
                Start Practicing
                <FaArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: theme.gradients.aurora }}
              ></span>
            </motion.button>
          </motion.div>

          <motion.div
            className="relative z-10 max-w-6xl mx-auto mt-16 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] mb-2" style={{ color: theme.palette.secondary }}>
                  Jump into any mode
                </p>
                <h2 className="text-3xl font-bold" style={{ color: theme.palette.text }}>
                  Practice Labs with visuals and audio
                </h2>
              </div>
              <span
                className="px-3 py-2 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: theme.surfaces.overlay,
                  border: `1px solid ${theme.borders.subtle}`,
                  color: theme.palette.text
                }}
              >
                More colorful, more accessible
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {practiceLabs.map((lab) => {
                const Icon = lab.icon;
                return (
                  <Link
                    key={lab.id}
                    to={lab.href}
                    className="group relative overflow-hidden rounded-3xl border flex flex-col md:flex-row"
                    style={{
                      backgroundColor: theme.surfaces.overlay,
                      borderColor: theme.borders.subtle,
                      boxShadow: theme.shadows.soft
                    }}
                  >
                    <div
                      className="md:w-1/2 relative min-h-[220px]"
                      style={{ borderRight: `1px solid ${theme.borders.subtle}` }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${lab.image})` }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, rgba(5,7,18,0.35), rgba(5,7,18,0.85))' }}
                      ></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span
                          className="px-3 py-2 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: theme.surfaces.overlay,
                            border: `1px solid ${theme.borders.subtle}`,
                            color: theme.palette.text
                          }}
                        >
                          {lab.badge}
                        </span>
                        <Icon className="h-6 w-6" style={{ color: lab.accent }} />
                      </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8 text-left flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-semibold flex items-center gap-3" style={{ color: theme.palette.text }}>
                          <Icon className="h-6 w-6" style={{ color: lab.accent }} />
                          {lab.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: theme.palette.textMuted }}>
                          {lab.description}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: lab.accent }}>
                        Explore now
                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="backdrop-blur-sm border-t py-6"
        style={{ backgroundColor: theme.surfaces.overlayStrong, borderColor: theme.borders.subtle }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaMusic className="h-6 w-6" style={{ color: theme.palette.secondary }} />
              <span className="ml-2 text-xl font-bold" style={{ color: theme.palette.text }}>
                NotaQuest
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="transition-colors" style={{ color: theme.palette.textMuted }}>
                About
              </a>
              <a href="#" className="transition-colors" style={{ color: theme.palette.textMuted }}>
                Features
              </a>
              <a href="#" className="transition-colors" style={{ color: theme.palette.textMuted }}>
                Contact
              </a>
              {token && (
                <Link to="/progress" className="transition-colors" style={{ color: theme.palette.textMuted }}>
                  My Progress
                </Link>
              )}
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="text-sm" style={{ color: theme.palette.textMuted }}>
              &copy; {new Date().getFullYear()} NotaQuest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
