import { Link } from 'react-router-dom';
import { FaHome, FaTrophy, FaChartLine, FaMusic, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function NavBar() {
  const { token, logout } = useAuth();

  return (
    <nav
      className="fixed w-full z-10"
      style={{
        background: theme.gradients.nav,
        boxShadow: theme.shadows.soft,
        backdropFilter: `blur(${theme.glass.blur})`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center px-3 py-2 rounded-full glass-surface radiant-border">
              <FaMusic className="h-8 w-8 text-indigo-300" />
              <span className="ml-2 text-xl font-bold text-white">NotaQuest</span>
            </Link>
            <div className="hidden md:flex md:space-x-1">
              <NavLink to="/" icon={<FaHome />} text="Home" />
              <NavLink to="/leaderboard" icon={<FaTrophy />} text="Leaderboard" />
              <NavLink to="/progress" icon={<FaChartLine />} text="Progress" />
            </div>
          </div>
          <div className="flex items-center">
            {token ? (
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white shadow-md"
                style={{
                  background: theme.gradients.aurora,
                  boxShadow: theme.shadows.glow
                }}
              >
                <FaUser className="mr-2" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white shadow-md"
                style={{
                  background: theme.gradients.aurora,
                  boxShadow: theme.shadows.glow
                }}
              >
                <FaUser className="mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-200 rounded-lg transition-all duration-200 hover:text-white"
      style={{
        border: `1px solid ${theme.palette.surface}`,
        backgroundColor: 'rgba(255, 255, 255, 0.04)'
      }}
    >
      <span className="mr-2 opacity-80">{icon}</span>
      {text}
    </Link>
  );
}
