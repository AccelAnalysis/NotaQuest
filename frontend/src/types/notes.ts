export interface Note {
  id: string;
  name: string;
  octave: number;
  isSharp: boolean;
  position: number;
  midi?: number;
  staffPosition?: number;
  clef?: 'treble' | 'bass';
  noteType?: string;
}

export type NoteType = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'thirty-second' | 'sixty-fourth';

export interface NotationItem {
  noteId: string;
  staffPosition: number;
  noteType: NoteType;
  isDotted?: boolean;
  hasStem?: boolean;
  stemDirection?: 'up' | 'down';
  beams?: number[];
  rest?: boolean;
}
