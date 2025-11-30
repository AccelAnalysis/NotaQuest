import { Link } from 'react-router-dom';
import { FaHome, FaTrophy, FaChartLine, FaMusic, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaMusic className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">NotaQuest</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <NavLink to="/" icon={<FaHome />} text="Home" />
              <NavLink to="/leaderboard" icon={<FaTrophy />} text="Leaderboard" />
              <NavLink to="/progress" icon={<FaChartLine />} text="Progress" />
            </div>
          </div>
          <div className="flex items-center">
            {token ? (
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaUser className="mr-2" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-indigo-500 transition-colors duration-200"
    >
      <span className="mr-2">{icon}</span>
      {text}
    </Link>
  );
}
