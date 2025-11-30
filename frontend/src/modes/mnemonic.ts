export interface MnemonicCard {
  note: string;
  mnemonic: string;
  type: 'space' | 'line';
  position: number;
  clef: 'treble' | 'bass';
}

export const MNEMONIC_CARDS: MnemonicCard[] = [
  // Treble Clef Space notes (F-A-C-E)
  { note: 'F', mnemonic: 'F', type: 'space', position: 0, clef: 'treble' },
  { note: 'A', mnemonic: 'A', type: 'space', position: 1, clef: 'treble' },
  { note: 'C', mnemonic: 'C', type: 'space', position: 2, clef: 'treble' },
  { note: 'E', mnemonic: 'E', type: 'space', position: 3, clef: 'treble' },
  // Treble Clef Line notes (E-G-B-D-F)
  { note: 'E', mnemonic: 'E', type: 'line', position: 0, clef: 'treble' },
  { note: 'G', mnemonic: 'G', type: 'line', position: 1, clef: 'treble' },
  { note: 'B', mnemonic: 'B', type: 'line', position: 2, clef: 'treble' },
  { note: 'D', mnemonic: 'D', type: 'line', position: 3, clef: 'treble' },
  { note: 'F', mnemonic: 'F', type: 'line', position: 4, clef: 'treble' },
  // Bass Clef Space notes (A-C-E-G)
  { note: 'A', mnemonic: 'A', type: 'space', position: 0, clef: 'bass' },
  { note: 'C', mnemonic: 'C', type: 'space', position: 1, clef: 'bass' },
  { note: 'E', mnemonic: 'E', type: 'space', position: 2, clef: 'bass' },
  { note: 'G', mnemonic: 'G', type: 'space', position: 3, clef: 'bass' },
  // Bass Clef Line notes (G-B-D-F-A)
  { note: 'G', mnemonic: 'G', type: 'line', position: 0, clef: 'bass' },
  { note: 'B', mnemonic: 'B', type: 'line', position: 1, clef: 'bass' },
  { note: 'D', mnemonic: 'D', type: 'line', position: 2, clef: 'bass' },
  { note: 'F', mnemonic: 'F', type: 'line', position: 3, clef: 'bass' },
  { note: 'A', mnemonic: 'A', type: 'line', position: 4, clef: 'bass' }
];

export const MNEMONIC_PHRASES = {
  treble: {
    space: 'FACE - Space notes from bottom to top',
    line: 'Every Good Boy Does Fine - Line notes from bottom to top'
  },
  bass: {
    space: 'All Cows Eat Grass - Space notes from bottom to top',
    line: 'Good Boys Do Fine Always - Line notes from bottom to top'
  }
};

export const getCardsByType = (type: 'space' | 'line', clef: 'treble' | 'bass') => {
  return MNEMONIC_CARDS.filter(card => card.type === type && card.clef === clef)
    .sort((a, b) => a.position - b.position);
};
