import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Mnemonic from './routes/Mnemonic';
import SightReading from './routes/SightReading';
import Leaderboard from './routes/Leaderboard';
import EarTraining from './routes/EarTraining';
import Intervals from './routes/Intervals';
import Play from './routes/Play';
import Results from './routes/Results';
import Progress from './routes/Progress';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mnemonic" element={<Mnemonic />} />
      <Route path="/sight-reading" element={<SightReading />} />
      <Route path="/ear-training" element={<EarTraining />} />
      <Route path="/intervals" element={<Intervals />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/play" element={<Play />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
};

export default AppRouter;
