import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameController from '../controllers/GameController';
import { progressService, type GameMode } from '../services/progress';

// Type for timer reference
type TimerRef = ReturnType<typeof setInterval> | null;

// Types
import type { Note } from '../types/notes';

// Game constants
const GAME_DURATION = 60; // 60 seconds
const NOTE_GENERATION_INTERVAL = 2000; // 2 seconds
const GAME_MODE: GameMode = 'sight-reading';
const CORRECT_ANSWER_POINTS = 10;
const WRONG_ANSWER_PENALTY = 2;

// TimerBar component
const TimerBar = ({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
    <div
      className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
      style={{ width: `${(timeLeft / totalTime) * 100}%` }}
    />
  </div>
);

// NoteDisplay component
const NoteDisplay = ({ note }: { note: Note | null }) => {
  if (!note) return null;
  
  return (
    <div className="text-center my-8">
      <div className="text-6xl font-bold text-indigo-800 mb-2">
        {note.name}
        {note.isSharp && <span className="text-4xl">♯</span>}
        <span className="text-4xl">{note.octave}</span>
      </div>
      <div className="mt-4 text-gray-600">
        Position: {note.position}
      </div>
    </div>
  );
};

const SightReading = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const gameController = useRef<GameController | null>(null);
  const noteInterval = useRef<TimerRef>(null);
  const navigate = useNavigate();

  // End the game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (noteInterval.current) {
      clearInterval(noteInterval.current);
      noteInterval.current = null;
    }
    
    // Save final score
    progressService.recordScore(GAME_MODE, score);
    
    // Navigate to results
    navigate('/results', { 
      state: { 
        score,
        gameMode: GAME_MODE,
        timePlayed: GAME_DURATION - timeLeft
      } 
    });
  }, [navigate, score, timeLeft]);

  // Initialize game controller
  useEffect(() => {
    const controller = new GameController({
      onScoreUpdate: (newScore: number) => setScore(newScore),
      onGameEnd: endGame
    });
    gameController.current = controller;

    return () => {
      if (noteInterval.current) {
        clearInterval(noteInterval.current);
        noteInterval.current = null;
      }
    };
  }, [endGame]);

  // Handle note generation
  const generateNewNote = useCallback(() => {
    if (!gameController.current) return;
    
    gameController.current.next();
    const note = gameController.current.getCurrentNote();
    if (note) {
      // Use functional update to ensure we have the latest state
      setCurrentNote(prev => {
        const noteName = typeof note === 'string' ? note : note.name;
        return {
          id: `${noteName}${note.octave}-${Date.now()}`,
          name: noteName,
          octave: note.octave,
          isSharp: noteName.includes('#'),
          position: Math.floor(Math.random() * 20) + 1
        };
      });
    }
  }, []);

  // Handle note submission
  const handleNoteSubmit = useCallback((noteName: string) => {
    if (!gameController.current || !currentNote) return false;
    
    const isCorrect = noteName === currentNote.name;
    if (isCorrect) {
      // Update score
      const newScore = score + CORRECT_ANSWER_POINTS;
      setScore(newScore);
      
      // Update progress
      progressService.recordScore(GAME_MODE, newScore);
    }
    
    return isCorrect;
  }, [currentNote, score]);

  // Start the game
  const startGame = useCallback(() => {
    // Reset all states at once to minimize re-renders
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setIsPlaying(true);
    
    // Clear any existing interval
    if (noteInterval.current) {
      clearInterval(noteInterval.current);
      noteInterval.current = null;
    }
    
    // Generate first note immediately
    generateNewNote();
    
    // Start note generation interval
    noteInterval.current = setInterval(() => {
      generateNewNote();
    }, NOTE_GENERATION_INTERVAL);
  }, [generateNewNote]);

  // Game timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, endGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Sight Reading Trainer</h1>
          <p className="text-lg text-gray-600">Improve your sight reading skills</p>
        </header>

        {!isPlaying ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            {timeLeft === 0 ? (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Time's up!</h2>
                <p className="text-xl mb-6">Your score: <span className="font-bold">{score}</span></p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">How to Play</h2>
                <p className="mb-4">Identify each note as quickly as possible.</p>
                <p>You'll have 60 seconds to get as many notes right as you can!</p>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              {timeLeft === 0 ? 'Play Again' : 'Start Game'}
            </button>
            
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium border border-indigo-200 rounded-lg hover:bg-indigo-50"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 transition-colors text-sm font-medium rounded-lg"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-bold text-indigo-800">Score: {score}</div>
              <div className="text-xl font-bold text-gray-700">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <TimerBar timeLeft={timeLeft} totalTime={GAME_DURATION} />
            
            <NoteDisplay note={currentNote} />

            <div className="grid grid-cols-7 gap-2 mt-8">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((note) => (
                <button
                  key={note}
                  onClick={() => {
                    const isCorrect = handleNoteSubmit(note);
                    if (isCorrect) {
                      // Generate a new note after a short delay for better UX
                      setTimeout(generateNewNote, 200);
                    } else {
                      setScore(prev => Math.max(0, prev - WRONG_ANSWER_PENALTY));
                    }
                  }}
                  className="py-3 px-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg transition-colors font-medium disabled:opacity-50"
                  disabled={!isPlaying || !currentNote}
                >
                  {note}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setCurrentNote(prev => ({
                      ...prev!,
                      isSharp: !prev?.isSharp
                    }));
                  }}
                  className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg transition-colors text-sm font-medium"
                  disabled={!isPlaying}
                >
                  Toggle Sharp/Flat
                </button>
                <button
                  onClick={() => currentNote && gameController.current?.playCurrentNote()}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors text-sm font-medium"
                  disabled={!isPlaying || !currentNote}
                >
                  Play Again
                </button>
              </div>
              
              <button
                onClick={() => {
                  generateNewNote();
                  setScore(prev => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg transition-colors text-sm font-medium"
              >
                Skip Note (-1)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SightReading;
