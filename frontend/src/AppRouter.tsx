import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Mnemonic from './routes/Mnemonic';
import SightReading from './routes/SightReading';
import Leaderboard from './routes/Leaderboard';
import Play from './routes/Play';
import Results from './routes/Results';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mnemonic" element={<Mnemonic />} />
      <Route path="/sight-reading" element={<SightReading />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/play" element={<Play />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
};

export default AppRouter;
