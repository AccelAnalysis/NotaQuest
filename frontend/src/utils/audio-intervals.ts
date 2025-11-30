// Extend the Window interface to include webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export const playInterval = async (rootFreq: number, intervalName: string) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const intervalSemitones: { [key: string]: number } = {
    'P1': 0, 'm2': 1, 'M2': 2, 'm3': 3, 'M3': 4,
    'P4': 5, 'Tritone': 6, 'P5': 7, 'm6': 8, 'M6': 9,
    'm7': 10, 'M7': 11, 'P8': 12
  };

  const semitones = intervalSemitones[intervalName];
  if (semitones === undefined) {
    throw new Error(`Unknown interval: ${intervalName}`);
  }

  const intervalFreq = rootFreq * Math.pow(2, semitones / 12);
  
  const playTone = (freq: number, startTime: number) => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    gainNode.gain.value = 0.5;
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1);
    
    osc.start(startTime);
    osc.stop(startTime + 1);
    
    return osc;
  };

  // Play root note
  playTone(rootFreq, audioContext.currentTime);
  
  // Play interval after a short delay
  playTone(intervalFreq, audioContext.currentTime + 1.2);
  
  // Play both notes together
  playTone(rootFreq, audioContext.currentTime + 2.5);
  playTone(intervalFreq, audioContext.currentTime + 2.5);
};

export const getRandomInterval = (difficulty: 'easy' | 'medium' | 'hard') => {
  const intervalsByDifficulty = {
    easy: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'P5', 'P8'],
    medium: ['m2', 'M2', 'm3', 'M3', 'P4', 'Tritone', 'P5', 'm6', 'M6', 'm7', 'M7'],
    hard: ['m2', 'M2', 'm3', 'M3', 'P4', 'Tritone', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']
  };

  const intervals = intervalsByDifficulty[difficulty];
  const randomIndex = Math.floor(Math.random() * intervals.length);
  return intervals[randomIndex];
};
