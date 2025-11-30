import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Results.css';

export default function Results() {
  const [searchParams] = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const navigate = useNavigate();
  
  const getMessage = () => {
    if (score >= 90) return "Maestro! You're a Music Genius! 🎵✨";
    if (score >= 70) return "Great job! You've got a good ear! 🎼";
    if (score >= 50) return "Not bad! Keep practicing! 🎻";
    return "Keep at it! Practice makes perfect! 🎵";
  };

  return (
    <div className="results-container">
      <h1>Game Over!</h1>
      <div className="score-display">
        <h2>Your Score:</h2>
        <div className="score">{score}</div>
        <p className="message">{getMessage()}</p>
      </div>
      
      <div className="button-group">
        <button 
          className="play-again-button"
          onClick={() => navigate(-1)} // Go back to the game with the same mode
        >
          Play Again
        </button>
        
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
