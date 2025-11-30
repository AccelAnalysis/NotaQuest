import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Stave, StaveNote, Accidental, Renderer, Formatter } from 'vexflow';
import type { GameMode, Note } from '../types';
import { getLevelConfig, generateNote, generateOptions } from '../config/levels';
import { progressService } from '../services/progress';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../styles/Play.css';

export default function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const staffRef = useRef<HTMLDivElement>(null);
  
  // Validate mode parameter
  const modeParam = searchParams.get('mode');
  const mode: GameMode = (modeParam === 'treble' || modeParam === 'bass' || modeParam === 'both') 
    ? modeParam 
    : 'treble';
  
  // Validate level parameter
  const levelParam = parseInt(searchParams.get('level') || '1', 10);
  const level = levelParam >= 1 && levelParam <= 5 ? levelParam : 1;
  
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  
  // Get level configuration with error handling
  let levelConfig;
  try {
    levelConfig = getLevelConfig(level);
  } catch (error) {
    console.error('Error getting level config:', error);
    // Fallback to level 1 config
    levelConfig = getLevelConfig(1);
  }
  
  // Generate a random number between min and max (inclusive)
  const getRandomInt = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  // Generate a new note based on level configuration
  const generateNewNote = useCallback(() => {
    try {
      const clef: 'treble' | 'bass' = 
        mode === 'both' ? (getRandomInt(0, 1) === 0 ? 'treble' : 'bass') : mode;
      
      // Create a modified level config based on current level
      const currentLevelConfig = {
        ...levelConfig,
        // Enable ledger lines only at level >= 3
        useLedgerLines: level >= 3,
        // Enable rests only at level >= 4
        includeRests: level >= 4 && levelConfig.includeRests,
        // Use MusicXML sequences only at level >= 5
        useMusicXML: level >= 5 && levelConfig.useMusicXML
      };
      
      // Generate note using level configuration
      const newNote = generateNote(currentLevelConfig, clef);
      setCurrentNote(newNote);
      
      // Generate answer options
      const correctAnswer = `${newNote.name}${newNote.accidental || ''}`;
      const optionsArray = generateOptions(correctAnswer, currentLevelConfig);
      
      setOptions(optionsArray);
    } catch (error) {
      console.error('Error generating note:', error);
      // Fallback to default note generation if there's an error
      const clef: 'treble' | 'bass' = 
        mode === 'both' ? (getRandomInt(0, 1) === 0 ? 'treble' : 'bass') : mode;
      
      const newNote: Note = {
        name: 'C',
        octave: clef === 'treble' ? 4 : 3,
        clef,
      };
      
      setCurrentNote(newNote);
      setOptions(['A', 'B', 'C', 'D']);
    }
  }, [mode, levelConfig, getRandomInt, level]);

  // Initialize VexFlow
  useEffect(() => {
    if (!staffRef.current || !currentNote) return;
    
    // Clear previous content
    staffRef.current.innerHTML = '';
    
    // Create a VexFlow renderer
    const renderer = new Renderer(
      staffRef.current,
      Renderer.Backends.SVG
    );
    
    const context = renderer.getContext();
    const stave = new Stave(10, 40, 400);
    
    // Add clef based on current note's clef
    stave.addClef(currentNote.clef);
    
    // Add time signature if needed (can be customized based on level)
    if (levelConfig.includeStems) {
      stave.addTimeSignature('4/4');
    }
    
    stave.setContext(context).draw();
    
    // Draw the note
    const note = new StaveNote({
      keys: [`${currentNote.name}/${currentNote.octave}${currentNote.accidental || ''}`],
      duration: 'q',
      clef: currentNote.clef,
    });
    
    // Add accidental if present
    if (currentNote.accidental) {
      note.addModifier(new Accidental(currentNote.accidental === 'b' ? 'b' : '#'));
    }
    
    // Add stem if the level includes them
    if (levelConfig.includeStems) {
      note.setStemDirection(currentNote.octave >= 4 ? -1 : 1);
    }
    
    const notes = [note];
    Formatter.FormatAndDraw(context, stave, notes);

    return () => {
      // Cleanup if needed
    };
  }, [currentNote, levelConfig.includeStems]);

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 0)); // Move to next tick
        generateNewNote();
      } catch (error) {
        console.error('Error initializing game:', error);
        // Fallback to a default note
        const defaultNote: Note = {
          name: 'C',
          octave: 4,
          clef: 'treble',
        };
        setCurrentNote(defaultNote);
        setOptions(['A', 'B', 'C', 'D']);
      }
    };
    
    initGame();
  }, [generateNewNote]);

  const handleAnswer = (selectedNote: string) => {
    if (!currentNote) return;

    const correctNote = `${currentNote.name}${currentNote.accidental || ''}`;
    const isCorrect = selectedNote === correctNote;
    const newScore = isCorrect ? score + 10 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    if (round >= 10) {
      // Level completed successfully
      const xpEarned = level * 100;
      progressService.recordLevel(level);
      progressService.recordScore(mode, newScore);
      
      navigate(`/results?score=${newScore}&level=${level}&xp=${xpEarned}`);
    } else {
      setRound(prevRound => prevRound + 1);
      generateNewNote();
    }
  };

  return (
    <ErrorBoundary>
      <div className="play-container">
      <div className="game-header">
        <div className="level">Level {level}: {levelConfig.name}</div>
        <div className="score">Score: {score}</div>
        <div className="round">Round: {round}/10</div>
      </div>
      <div className="level-description">{levelConfig.description}</div>
      
      <div className="staff-container" ref={staffRef}></div>
      
      <div className="answer-buttons">
        {options.map((note, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(note)}
            className="note-button"
          >
            {note}
          </button>
        ))}
      </div>
      
      <button 
        className="quit-button" 
        onClick={() => navigate('/')}
      >
        Quit Game
      </button>
    </div>
    </ErrorBoundary>
  );
}
