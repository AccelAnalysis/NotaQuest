import { useState, useEffect } from 'react';
import { FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import { getRandomInterval, playInterval } from '../utils/audio-intervals';
import { addXP } from '../services/gamification';
import { useAuth } from '../context/AuthContext';
import StaffDisplay from '../components/StaffDisplay';
import NoteRenderer, { NotationItem } from '../components/NoteRenderer';
import '../routes/Play.css';

type Difficulty = 'easy' | 'medium' | 'hard';

// Map interval names to their display names
const INTERVAL_NAMES: Record<string, string> = {
  'P1': 'Perfect Unison',
  'm2': 'Minor 2nd',
  'M2': 'Major 2nd',
  'm3': 'Minor 3rd',
  'M3': 'Major 3rd',
  'P4': 'Perfect 4th',
  'Tritone': 'Tritone',
  'P5': 'Perfect 5th',
  'm6': 'Minor 6th',
  'M6': 'Major 6th',
  'm7': 'Minor 7th',
  'M7': 'Major 7th',
  'P8': 'Perfect Octave'
};

// Available intervals for each difficulty level
const INTERVALS_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'P5', 'P8'],
  medium: ['m2', 'M2', 'm3', 'M3', 'P4', 'Tritone', 'P5', 'm6', 'M6', 'm7', 'M7'],
  hard: ['m2', 'M2', 'm3', 'M3', 'P4', 'Tritone', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']
};

// XP rewards by difficulty
const XP_REWARDS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30
};

const Intervals = () => {
  const { token } = useAuth();
  const [currentInterval, setCurrentInterval] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState<string>('');
  const [notes, setNotes] = useState<NotationItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate a new interval and update the staff display
  const generateNewInterval = () => {
    const interval = getRandomInterval(difficulty);
    setCurrentInterval(interval);
    
    // For demonstration, we'll use fixed root note (C4) and calculate the interval
    const rootNote = { position: 0, octave: 4 };
    const intervalNote = { position: getIntervalPosition(interval), octave: 4 };
    
    setNotes([
      {
        noteId: 'root',
        staffPosition: rootNote.position,
        isRest: false,
        stemDirection: 'up',
        alter: 0,
        octave: rootNote.octave,
        duration: 1,
        noteType: 'quarter'
      },
      {
        noteId: 'interval',
        staffPosition: intervalNote.position,
        isRest: false,
        stemDirection: 'up',
        alter: 0,
        octave: intervalNote.octave,
        duration: 1,
        noteType: 'quarter'
      }
    ]);
    
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFeedback('');
  };

  // Map interval to staff position (simplified)
  const getIntervalPosition = (interval: string): number => {
    const intervalPositions: Record<string, number> = {
      'P1': 0, 'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4,
      'P4': 5, 'Tritone': 6, 'P5': 7, 'm6': 8,
      'M6': 9, 'm7': 10, 'M7': 11, 'P8': 12
    };
    return intervalPositions[interval] || 0;
  };

  // Play the current interval
  const playCurrentInterval = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    playInterval(440, currentInterval).finally(() => {
      setIsPlaying(false);
    });
  };

  // Handle answer selection
  const handleAnswer = async (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers
    
    const correct = answer === currentInterval;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setFeedback(correct ? 'Correct!' : `Incorrect! It was ${INTERVAL_NAMES[currentInterval]}`);
    
    // Update score
    const newScore = {
      correct: correct ? score.correct + 1 : score.correct,
      total: score.total + 1
    };
    setScore(newScore);
    
    // Add XP for correct answer
    if (correct && token) {
      try {
        await addXP(token, XP_REWARDS[difficulty]);
      } catch (error) {
        console.error('Failed to add XP:', error);
      }
    }
    
    // Show animation
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      // Generate new interval after a delay
      setTimeout(generateNewInterval, 1000);
    }, 1500);
  };

  // Initialize with first interval
  useEffect(() => {
    generateNewInterval();
  }, [difficulty]);

  // Animation class for the staff container
  const getStaffContainerClass = () => {
    let className = 'staff-container';
    if (isAnimating) {
      className += isCorrect ? ' correct-answer' : ' incorrect-answer';
    }
    return className;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Interval Training</h1>
      
      {/* Difficulty Selector */}
      <div className="difficulty-selector">
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
            onClick={() => setDifficulty(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Score Display */}
      <div className="score-display">
        Score: {score.correct} / {score.total}
      </div>
      
      {/* Staff Display */}
      <div className={getStaffContainerClass()}>
        <StaffDisplay>
          {notes.map((note) => (
            <NoteRenderer key={note.noteId} {...note} />
          ))}
        </StaffDisplay>
        
        {/* Play Button */}
        <button
          className="play-button"
          onClick={playCurrentInterval}
          disabled={isPlaying}
        >
          <FaPlay className="mr-2" />
          {isPlaying ? 'Playing...' : 'Play Interval'}
        </button>
      </div>
      
      {/* Answer Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
        {INTERVALS_BY_DIFFICULTY[difficulty].map((interval) => {
          const isSelected = selectedAnswer === interval;
          const isCorrectAnswer = interval === currentInterval;
          let buttonClass = 'interval-button';
          
          if (selectedAnswer !== null) {
            if (isSelected) {
              buttonClass += isCorrect ? ' bg-green-500 text-white' : ' bg-red-500 text-white';
            } else if (isCorrectAnswer) {
              buttonClass += ' bg-green-500 text-white';
            } else {
              buttonClass += ' bg-gray-200 text-gray-700';
            }
          } else {
            buttonClass += ' bg-blue-100 text-blue-700 hover:bg-blue-200';
          }
          
          return (
            <button
              key={interval}
              className={buttonClass}
              onClick={() => handleAnswer(interval)}
              disabled={selectedAnswer !== null}
            >
              {INTERVAL_NAMES[interval]}
              {selectedAnswer === interval && (
                <span className="ml-2">
                  {isCorrect ? <FaCheck /> : <FaTimes />}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div className={`answer-feedback ${isCorrect ? 'answer-correct' : 'answer-incorrect'}`}>
          {feedback}
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-12 text-gray-600 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-2">How to Practice</h2>
        <p className="mb-4">
          Listen to the interval by clicking the "Play Interval" button. 
          Then select which interval you think you heard from the options below.
        </p>
        <p>
          <strong>Tip:</strong> Try to sing the interval after hearing it to improve your ear training.
        </p>
      </div>
    </div>
  );
};

export default Intervals;
