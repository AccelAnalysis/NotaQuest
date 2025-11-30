export interface MnemonicCard {
  note: string;
  mnemonic: string;
  phrase: string;
  type: 'space' | 'line';
  position: number;
  clef: 'treble' | 'bass';
  image?: string;
  color?: string;
  labels: {
    clef: string;
    staff: string;
    position: string;
  };
}
