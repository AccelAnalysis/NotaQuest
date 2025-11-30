import { MnemonicCard } from '../types/mnemonic';

export const MNEMONIC_CARDS: MnemonicCard[] = [
  // Treble Clef Space notes (F-A-C-E)
  {
    note: 'F',
    mnemonic: 'F',
    phrase: 'F is the first space of the treble clef (FACE).',
    type: 'space',
    position: 0,
    clef: 'treble',
    image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Treble Clef',
      staff: 'Space',
      position: 'Space 1 (bottom)'
    }
  },
  {
    note: 'A',
    mnemonic: 'A',
    phrase: 'A is the second space of the treble clef (FACE).',
    type: 'space',
    position: 1,
    clef: 'treble',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Treble Clef',
      staff: 'Space',
      position: 'Space 2'
    }
  },
  {
    note: 'C',
    mnemonic: 'C',
    phrase: 'C is the third space of the treble clef (FACE).',
    type: 'space',
    position: 2,
    clef: 'treble',
    labels: {
      clef: 'Treble Clef',
      staff: 'Space',
      position: 'Space 3'
    }
  },
  {
    note: 'E',
    mnemonic: 'E',
    phrase: 'E is the top space of the treble clef (FACE).',
    type: 'space',
    position: 3,
    clef: 'treble',
    image: 'https://images.unsplash.com/photo-1421809313281-48f03fa45e9f?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Treble Clef',
      staff: 'Space',
      position: 'Space 4 (top)'
    }
  },
  // Treble Clef Line notes (E-G-B-D-F)
  {
    note: 'E',
    mnemonic: 'Every',
    phrase: 'Every Good Boy Does Fine - E is the bottom line.',
    type: 'line',
    position: 0,
    clef: 'treble',
    labels: {
      clef: 'Treble Clef',
      staff: 'Line',
      position: 'Line 1 (bottom)'
    }
  },
  {
    note: 'G',
    mnemonic: 'Good',
    phrase: 'Every Good Boy Does Fine - G is the second line.',
    type: 'line',
    position: 1,
    clef: 'treble',
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Treble Clef',
      staff: 'Line',
      position: 'Line 2'
    }
  },
  {
    note: 'B',
    mnemonic: 'Boy',
    phrase: 'Every Good Boy Does Fine - B is the middle line.',
    type: 'line',
    position: 2,
    clef: 'treble',
    labels: {
      clef: 'Treble Clef',
      staff: 'Line',
      position: 'Line 3'
    }
  },
  {
    note: 'D',
    mnemonic: 'Does',
    phrase: 'Every Good Boy Does Fine - D is the fourth line.',
    type: 'line',
    position: 3,
    clef: 'treble',
    labels: {
      clef: 'Treble Clef',
      staff: 'Line',
      position: 'Line 4'
    }
  },
  {
    note: 'F',
    mnemonic: 'Fine',
    phrase: 'Every Good Boy Does Fine - F is the top line.',
    type: 'line',
    position: 4,
    clef: 'treble',
    image: 'https://images.unsplash.com/photo-1454922915609-78549ad709bb?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Treble Clef',
      staff: 'Line',
      position: 'Line 5 (top)'
    }
  },
  // Bass Clef Space notes (A-C-E-G)
  {
    note: 'A',
    mnemonic: 'All',
    phrase: 'All Cows Eat Grass - A is the bottom space.',
    type: 'space',
    position: 0,
    clef: 'bass',
    labels: {
      clef: 'Bass Clef',
      staff: 'Space',
      position: 'Space 1 (bottom)'
    }
  },
  {
    note: 'C',
    mnemonic: 'Cows',
    phrase: 'All Cows Eat Grass - C is the second space.',
    type: 'space',
    position: 1,
    clef: 'bass',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Bass Clef',
      staff: 'Space',
      position: 'Space 2'
    }
  },
  {
    note: 'E',
    mnemonic: 'Eat',
    phrase: 'All Cows Eat Grass - E is the third space.',
    type: 'space',
    position: 2,
    clef: 'bass',
    labels: {
      clef: 'Bass Clef',
      staff: 'Space',
      position: 'Space 3'
    }
  },
  {
    note: 'G',
    mnemonic: 'Grass',
    phrase: 'All Cows Eat Grass - G is the top space.',
    type: 'space',
    position: 3,
    clef: 'bass',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Bass Clef',
      staff: 'Space',
      position: 'Space 4 (top)'
    }
  },
  // Bass Clef Line notes (G-B-D-F-A)
  {
    note: 'G',
    mnemonic: 'Good',
    phrase: 'Good Boys Do Fine Always - G is the bottom line.',
    type: 'line',
    position: 0,
    clef: 'bass',
    labels: {
      clef: 'Bass Clef',
      staff: 'Line',
      position: 'Line 1 (bottom)'
    }
  },
  {
    note: 'B',
    mnemonic: 'Boys',
    phrase: 'Good Boys Do Fine Always - B is the second line.',
    type: 'line',
    position: 1,
    clef: 'bass',
    image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Bass Clef',
      staff: 'Line',
      position: 'Line 2'
    }
  },
  {
    note: 'D',
    mnemonic: 'Do',
    phrase: 'Good Boys Do Fine Always - D is the middle line.',
    type: 'line',
    position: 2,
    clef: 'bass',
    labels: {
      clef: 'Bass Clef',
      staff: 'Line',
      position: 'Line 3'
    }
  },
  {
    note: 'F',
    mnemonic: 'Fine',
    phrase: 'Good Boys Do Fine Always - F is the fourth line.',
    type: 'line',
    position: 3,
    clef: 'bass',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=320&q=60',
    labels: {
      clef: 'Bass Clef',
      staff: 'Line',
      position: 'Line 4'
    }
  },
  {
    note: 'A',
    mnemonic: 'Always',
    phrase: 'Good Boys Do Fine Always - A is the top line.',
    type: 'line',
    position: 4,
    clef: 'bass',
    labels: {
      clef: 'Bass Clef',
      staff: 'Line',
      position: 'Line 5 (top)'
    }
  }
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

export const getCardsByType = (type: 'space' | 'line', clef: 'treble' | 'bass'): MnemonicCard[] => {
  return MNEMONIC_CARDS.filter(card => card.type === type && card.clef === clef)
    .sort((a, b) => a.position - b.position);
};
