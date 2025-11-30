import notesData from '../data/notation-basic.json';

export interface Note {
  id: string;
  midi: number;
  staffPosition: number;
  octave: number;
  step: string;
  alter?: number;
  duration: number;
  isRest: boolean;
  stemDirection?: 'up' | 'down';
}

export interface NotationItem extends Note {
  // Extended properties for notation rendering
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export const noteToStaffPosition = (noteId: string): number => {
  const note = notesData.notes.find(n => n.id === noteId);
  return note ? note.staffPosition : 0;
};

export const getRandomNote = (): Note => {
  const randomIndex = Math.floor(Math.random() * notesData.notes.length);
  return notesData.notes[randomIndex];
};

// Load and parse a MusicXML file
export async function loadXMLLevel(level: 'beginner' | 'intermediate' | 'advanced'): Promise<{ notes: Note[] }> {
  try {
    const response = await fetch(`/musicxml/samples/${level}.xml`);
    if (!response.ok) {
      throw new Error(`Failed to load ${level} level`);
    }
    const xmlString = await response.text();
    const { parseMusicXML } = await import('../musicxml/parser');
    return parseMusicXML(xmlString);
  } catch (error) {
    console.error('Error loading MusicXML:', error);
    return { notes: [] };
  }
}

export const playNote = (midiNumber: number, duration = 1): void => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    const frequency = 440 * Math.pow(2, (midiNumber - 69) / 12);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );
    
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('AudioContext not supported or blocked by browser');
  }
};
