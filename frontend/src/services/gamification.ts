// frontend/src/services/gamification.ts
import type { Achievement, UserProfile, LeaderboardEntry } from '../types/gamification';

const API_BASE_URL = '/api/gamification';

export const getProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const data = await response.json();
  return {
    ...data.profile,
    achievements: data.achievements || []
  };
};

export const addXP = async (token: string, xp: number): Promise<{ 
  success: boolean; 
  xp: number; 
  level: number;
  message?: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/add-xp`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ xp }),
  });

  if (!response.ok) {
    throw new Error('Failed to add XP');
  }

  return response.json();
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  let response: Response;
  let responseText: string;
  
  try {
    response = await fetch(`${API_BASE_URL}/leaderboard`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Get the raw response text first
    responseText = await response.text();
    
    if (!response.ok) {
      console.error('Leaderboard fetch error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
    }

    // Try to parse as JSON only if the response is not empty
    if (!responseText.trim()) {
      console.warn('Empty response from leaderboard endpoint');
      return [];
    }
    
    const data = JSON.parse(responseText);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getLeaderboard:', {
      error,
      response: {
        status: response?.status,
        statusText: response?.statusText,
        headers: response ? Object.fromEntries(response.headers.entries()) : {},
        body: responseText
      }
    });
    
    // Return empty array for non-200 responses or parse errors
    return [];
  }
};
