import { getRandomNote, playNote } from '../utils/music';
import type { Note } from '../utils/music';
import { addXP } from '../services/gamification';

type GameState = {
  currentNote: Note | null;
  score: number;
  xp: number;
  level: number;
  isPlaying: boolean;
  feedback: 'correct' | 'incorrect' | null;
};

type GameCallbacks = {
  onScoreUpdate?: (score: number) => void;
  onGameStart?: () => void;
  onGameEnd?: () => void;
};

class GameController {
  private state: GameState = {
    currentNote: null,
    score: 0,
    xp: 0,
    level: 1,
    isPlaying: false,
    feedback: null,
  };

  private callbacks: GameCallbacks = {};

  constructor(callbacks: GameCallbacks = {}) {
    this.callbacks = callbacks;
  }

  start(): void {
    this.state = {
      currentNote: null,
      score: 0,
      xp: this.state.xp,
      level: this.state.level,
      isPlaying: true,
      feedback: null,
    };
    this.callbacks.onGameStart?.();
    this.next();
  }

  next(): void {
    if (!this.state.isPlaying) return;
    
    const note = getRandomNote();
    this.state.currentNote = note;
    this.playCurrentNote();
  }

  async updateXPFromBackend(): Promise<void> {
    try {
      // This method can be expanded to sync with the backend
      // For now, it just returns the current state
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update XP from backend:', error);
    }
  }

  async submitAnswer(selectedNoteId: string, token: string): Promise<void> {
    if (!this.state.currentNote || !this.state.isPlaying) return;

    const isCorrect = selectedNoteId === this.state.currentNote.id;
    
    if (isCorrect) {
      this.state.score += 10;
      this.state.feedback = 'correct';
      this.callbacks.onScoreUpdate?.(this.state.score);
      
      // Award XP for correct answer
      const xpEarned = 10;
      try {
        const response = await addXP(token, xpEarned);
        if (response) {
          this.state.xp = response.xp;
          this.state.level = response.level;
        }
      } catch (error) {
        console.error('Failed to update XP:', error);
      }
    } else {
      this.state.feedback = 'incorrect';
    }

    // Show feedback briefly, then move to next note
    setTimeout(() => {
      this.state.feedback = null;
      this.next();
    }, 1000);
  }

  playCurrentNote(): void {
    if (this.state.currentNote) {
      playNote(this.state.currentNote.midi);
    }
  }

  getCurrentNote(): Note | null {
    return this.state.currentNote;
  }

  getScore(): number {
    return this.state.score;
  }

  getXP(): number {
    return this.state.xp;
  }

  getLevel(): number {
    return this.state.level;
  }

  getFeedback(): 'correct' | 'incorrect' | null {
    return this.state.feedback;
  }

  isPlaying(): boolean {
    return this.state.isPlaying;
  }
}

export default GameController;
