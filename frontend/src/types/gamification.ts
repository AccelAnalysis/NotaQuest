export interface Achievement {
  id: number;
  name: string;
  description: string;
  xp_reward: number;
  created_at: string;
}

export interface UserProfile {
  id: number;
  username: string;
  xp: number;
  level: number;
  achievements: Achievement[];
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  xp: number;
  level: number;
}
