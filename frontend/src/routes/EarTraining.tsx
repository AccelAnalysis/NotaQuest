import { useState, useEffect, useCallback, useRef } from 'react';
import { playInterval, getRandomInterval } from '../utils/audio-intervals';
import { useAuth } from '../context/AuthContext';
import GameController from '../controllers/GameController';

const intervals = [
  { name: 'P1', fullName: 'Perfect Unison' },
  { name: 'm2', fullName: 'Minor 2nd' },
  { name: 'M2', fullName: 'Major 2nd' },
  { name: 'm3', fullName: 'Minor 3rd' },
  { name: 'M3', fullName: 'Major 3rd' },
  { name: 'P4', fullName: 'Perfect 4th' },
  { name: 'Tritone', fullName: 'Tritone' },
  { name: 'P5', fullName: 'Perfect 5th' },
  { name: 'm6', fullName: 'Minor 6th' },
  { name: 'M6', fullName: 'Major 6th' },
  { name: 'm7', fullName: 'Minor 7th' },
  { name: 'M7', fullName: 'Major 7th' },
  { name: 'P8', fullName: 'Perfect Octave' }
];

export default function EarTraining() {
  const { token } = useAuth();
  const [currentInterval, setCurrentInterval] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, isCorrect: boolean} | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Create a ref to store the game controller instance
  const gameControllerRef = useRef<GameController | null>(null);

  const playRandomInterval = useCallback(() => {
    const interval = getRandomInterval(difficulty);
    setCurrentInterval(interval);
    setIsPlaying(true);
    
    // For advanced mode, we'll need to modify the playInterval call if it supports these options
    playInterval(440, interval).finally(() => setIsPlaying(false));
  }, [difficulty]);

  const checkAnswer = useCallback(async (selectedInterval: string) => {
    if (!currentInterval || !gameControllerRef.current) return;
    
    const isCorrect = selectedInterval === currentInterval;
    
    // Update score immediately
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
    
    // Handle feedback and XP using GameController
    if (isCorrect && token) {
      try {
        await gameControllerRef.current.submitAnswer(selectedInterval, token);
        // Update local state with the latest XP and level from the controller
        setXp(gameControllerRef.current.getXP());
        setLevel(gameControllerRef.current.getLevel());
        
        setFeedback({
          message: `Correct! +10 XP`,
          isCorrect: true
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
        setFeedback({
          message: 'Correct!',
          isCorrect: true
        });
      }
    } else if (!isCorrect) {
      setFeedback({
        message: `Incorrect! It was ${currentInterval}`,
        isCorrect: false
      });
    }

    // Clear feedback after 2 seconds
    const timer = setTimeout(() => {
      setFeedback(null);
      playRandomInterval();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentInterval, playRandomInterval, token]);

  // Initialize the game controller and game state
  useEffect(() => {
    // Initialize the game controller if it doesn't exist
    if (!gameControllerRef.current) {
      gameControllerRef.current = new GameController({
        onScoreUpdate: (newScore) => {
          // Update score if needed
          setScore(prev => ({
            ...prev,
            correct: newScore.correct,
            total: newScore.total
          }));
        },
        onGameStart: () => {
          // Reset game state when a new game starts
          setScore({ correct: 0, total: 0 });
          setFeedback(null);
        }
      });
      
      // Initialize the game
      gameControllerRef.current.start();
      
      // Set initial XP and level
      setXp(gameControllerRef.current.getXP());
      setLevel(gameControllerRef.current.getLevel());
    }
    
    // Set up the interval for the current game mode
    let mounted = true;
    
    const init = () => {
      if (mounted) {
        playRandomInterval();
      }
    };
    
    // Only run the effect when difficulty changes or on first render
    if (!isInitialized) {
      setIsInitialized(true);
      init();
    } else {
      init();
    }
    
    return () => {
      mounted = false;
      // Cleanup any playing audio when component unmounts or difficulty changes
      setIsPlaying(false);
    };
  }, [difficulty, isInitialized, playRandomInterval]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Ear Training</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {([
              { level: 'beginner', label: 'Beginner (Shows Notes)' },
              { level: 'intermediate', label: 'Intermediate (No Notes)' },
              { level: 'advanced', label: 'Advanced (Random Inversion + Tempo)' }
            ] as const).map(({ level, label }) => (
              <button
                key={level}
                className={`px-4 py-2 rounded-md text-sm ${
                  difficulty === level 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setDifficulty(level)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 my-8">
          <button
            onClick={playRandomInterval}
            disabled={isPlaying}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              isPlaying ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPlaying ? 'Playing...' : 'Replay Sound'}
          </button>
          {currentInterval && difficulty === 'beginner' && (
            <div className="flex items-center px-4 bg-gray-100 rounded-md">
              <span className="text-gray-700 font-mono">{currentInterval}</span>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`p-4 mb-6 rounded-md ${
            feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {intervals
            .filter(interval => 
              difficulty === 'beginner' ? ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'P5', 'P8'].includes(interval.name) :
              difficulty === 'intermediate' ? true :
              difficulty === 'advanced' && ['m2', 'M2', 'm3', 'M3', 'P4', 'Tritone', 'P5', 'm7', 'M7'].includes(interval.name)
            )
            .map(interval => (
              <button
                key={interval.name}
                onClick={() => checkAnswer(interval.name)}
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                {interval.fullName}
              </button>
            ))}
        </div>

        <div className="mt-8 pt-4 border-t">
          <div className="text-center">
            <p className="text-lg">
              Score: {score.correct} / {score.total} 
              {score.total > 0 && ` (${Math.round((score.correct / score.total) * 100)}%)`}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Level {level} • {xp} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
