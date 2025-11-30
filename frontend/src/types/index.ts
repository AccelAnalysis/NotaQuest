export type GameMode = 'treble' | 'bass' | 'both';

export interface Note {
  name: string;
  octave: number;
  clef: 'treble' | 'bass';
  accidental?: 'b' | '#';
}
