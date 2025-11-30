import type { Note } from '../types/notes';

interface XMLNote extends Omit<Note, 'name' | 'isSharp' | 'position'> {
  step: string;
  alter?: number;
  duration: number;
  isRest: boolean;
  stemDirection?: 'up' | 'down';
}

export function parseMusicXML(xmlString: string): { notes: Note[] } {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  const notes: XMLNote[] = [];
  let noteId = 0;
  
  // Get all note elements
  const noteElements = xmlDoc.getElementsByTagName('note');
  
  Array.from(noteElements).forEach(noteEl => {
    const rest = noteEl.getElementsByTagName('rest');
    const pitch = noteEl.getElementsByTagName('pitch')[0];
    const duration = noteEl.getElementsByTagName('duration')[0]?.textContent || '4';
    const stem = noteEl.getElementsByTagName('stem')[0]?.textContent;
    
    if (rest.length > 0) {
      // Handle rest
      notes.push({
        id: `rest-${noteId++}`,
        midi: 0,
        staffPosition: 0,
        octave: 0,
        step: '',
        duration: parseInt(duration, 10) || 4,
        isRest: true,
        stemDirection: stem as 'up' | 'down' | undefined
      });
    } else if (pitch) {
      // Handle pitched note
      const step = pitch.getElementsByTagName('step')[0]?.textContent || '';
      const octave = parseInt(pitch.getElementsByTagName('octave')[0]?.textContent || '4', 10);
      const alter = parseInt(pitch.getElementsByTagName('alter')[0]?.textContent || '0', 10);
      
      // Calculate MIDI note number (C4 = 60)
      const stepToMidi: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
      const midi = 60 + (octave - 4) * 12 + stepToMidi[step] + alter;
      
      // Simple staff position calculation (C4 = 0, B3 = 1, D4 = -1, etc.)
      const staffPosition = (4 - octave) * 7 + (['C', 'D', 'E', 'F', 'G', 'A', 'B'].indexOf(step) - 3);
      
      notes.push({
        id: `${step}${octave}${alter !== 0 ? (alter > 0 ? '#' : 'b') : ''}-${noteId++}`,
        midi,
        staffPosition,
        octave,
        step,
        alter: alter !== 0 ? alter : undefined,
        duration: parseInt(duration, 10) || 4,
        isRest: false,
        stemDirection: stem as 'up' | 'down' | undefined
      });
    }
  });
  
  // Convert XMLNote to our standard Note format
  const standardNotes: Note[] = notes.map(note => {
    // Ensure we have required values, provide defaults if missing
    const staffPosition = note.staffPosition ?? 0;
    const midi = note.midi ?? 60; // Middle C as default MIDI value
    const octave = note.octave ?? 4; // Default to middle C octave
    const step = note.step || 'C'; // Default to C if step is missing
    const alter = note.alter ?? 0;
    
    return {
      id: note.id || `note-${Math.random().toString(36).substr(2, 9)}`,
      name: step + (alter === 1 ? '#' : ''),
      octave,
      isSharp: alter === 1,
      position: staffPosition,
      midi,
      staffPosition,
      clef: staffPosition > 0 ? 'treble' : 'bass'
    };
  });

  return { notes: standardNotes };
}
