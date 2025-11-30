import type { Note } from '../types';

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  notes: string[];
  octaves: number[];
  accidentals: ('b' | '#')[];
  includeRests: boolean;
  includeStems: boolean;
  useLedgerLines: boolean;
  useMusicXML: boolean;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Beginner Notes',
    description: 'Learn the basic notes A through G',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    octaves: [3, 4, 5],
    accidentals: [],
    includeRests: false,
    includeStems: false,
    useLedgerLines: false,
    useMusicXML: false
  },
  {
    id: 2,
    name: 'Sharps and Flats',
    description: 'Add sharps and flats to your note knowledge',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    octaves: [3, 4, 5],
    accidentals: ['b', '#'],
    includeRests: false,
    includeStems: false,
    useLedgerLines: false,
    useMusicXML: false
  },
  {
    id: 3,
    name: 'Ledger Lines',
    description: 'Master notes above and below the staff',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    octaves: [2, 3, 4, 5, 6], // Extended range for ledger lines
    accidentals: ['b', '#'],
    includeRests: false,
    includeStems: true,
    useLedgerLines: true,
    useMusicXML: false
  },
  {
    id: 4,
    name: 'Rests and Stems',
    description: 'Learn about rests and proper note stems',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    octaves: [2, 3, 4, 5, 6],
    accidentals: ['b', '#'],
    includeRests: true,
    includeStems: true,
    useLedgerLines: true,
    useMusicXML: false
  },
  {
    id: 5,
    name: 'MusicXML Sequences',
    description: 'Read and interpret MusicXML sequences',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    octaves: [2, 3, 4, 5, 6],
    accidentals: ['b', '#'],
    includeRests: true,
    includeStems: true,
    useLedgerLines: true,
    useMusicXML: true
  }
];

export function getLevelConfig(level: number): LevelConfig {
  const config = LEVELS.find(l => l.id === level);
  if (!config) {
    throw new Error(`Level ${level} not found`);
  }
  return config;
}

export function generateNote(levelConfig: LevelConfig, clef: 'treble' | 'bass'): Note {
  const noteName = levelConfig.notes[Math.floor(Math.random() * levelConfig.notes.length)];
  const octave = levelConfig.octaves[Math.floor(Math.random() * levelConfig.octaves.length)];
  
  let accidental: 'b' | '#' | undefined;
  if (levelConfig.accidentals.length > 0 && Math.random() < 0.3) {
    accidental = levelConfig.accidentals[Math.floor(Math.random() * levelConfig.accidentals.length)];
  }

  return {
    name: noteName,
    octave,
    clef,
    accidental
  };
}

export function generateOptions(correctNote: string, levelConfig: LevelConfig): string[] {
  const options = new Set([correctNote]);
  
  while (options.size < 4) {
    const randomNote = levelConfig.notes[Math.floor(Math.random() * levelConfig.notes.length)];
    let option = randomNote;
    
    // Add accidental if the level includes them
    if (levelConfig.accidentals.length > 0 && Math.random() < 0.3) {
      const accidental = levelConfig.accidentals[Math.floor(Math.random() * levelConfig.accidentals.length)];
      option += accidental;
    }
    
    options.add(option);
  }
  
  // Convert to array and shuffle
  return Array.from(options).sort(() => Math.random() - 0.5);
}
