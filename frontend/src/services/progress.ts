export type GameMode = 'treble' | 'bass' | 'both' | 'ear-training' | 'sight-reading';

interface ProgressData {
  bestScores: Record<GameMode, number>;
  completedLevels: number[];
  lastPlayed: string;
  history: Array<{
    date: string;
    mode: GameMode;
    score: number;
    level?: number;
  }>;
}

const STORAGE_KEY = 'musicNotesProgress';

const defaultProgress: ProgressData = {
  bestScores: {
    'treble': 0,
    'bass': 0,
    'both': 0,
    'ear-training': 0,
    'sight-reading': 0
  },
  completedLevels: [],
  lastPlayed: new Date().toISOString(),
  history: []
};

function loadProgress(): ProgressData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...defaultProgress };
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { ...defaultProgress };
  }
}

function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      lastPlayed: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export const progressService = {
  recordScore(mode: GameMode, score: number): void {
    const progress = loadProgress();
    
    // Update best score if current score is higher
    if (score > (progress.bestScores[mode] || 0)) {
      progress.bestScores[mode] = score;
    }
    
    // Add to history
    progress.history.push({
      date: new Date().toISOString(),
      mode,
      score
    });
    
    saveProgress(progress);
  },
  
  recordLevel(level: number): void {
    const progress = loadProgress();
    
    if (!progress.completedLevels.includes(level)) {
      progress.completedLevels.push(level);
      progress.completedLevels.sort((a, b) => a - b);
      saveProgress(progress);
    }
  },
  
  getProgress(): ProgressData {
    return loadProgress();
  },
  
  getBestScores(): Record<GameMode, number> {
    return loadProgress().bestScores;
  },
  
  resetProgress(): void {
    saveProgress({ ...defaultProgress });
  },
  
  getProgressHistory(days: number = 30) {
    const progress = loadProgress();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return progress.history
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
};

export type { ProgressData };
