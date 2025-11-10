import { type ApiGame } from "../src/models/Game"
import Game from "../src/models/Game"
import { auth } from "../src/firebase"
import {
  loginUser,
  registerUser,
  logoutUser,
  getRandomGame as firebaseGetRandomGame,
  searchGames,
  submitScore as firebaseSubmitScore,
  getLeaderboard as firebaseGetLeaderboard,
  updateUsername as firebaseUpdateUsername
} from "../src/firebaseServices"

// Authentication functions
export const register = async (email: string, username: string, password: string) => {
  try {
    const result = await registerUser(email, username, password);
    return { token: result.token, user: result.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const result = await loginUser(email, password);
    return { token: result.token, user: result.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await logoutUser();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Game functions
export const requestGameDataWithTitle = async (gameTitle: string): Promise<ApiGame | undefined> => {
  try {
    const games = await searchGames(gameTitle, 1);
    if (games.length > 0) {
      const game = games[0] as any;
      return {
        id: parseInt(game.id),
        name: game.name,
        first_release_date: game.release_date,
        rating: game.rating,
        genres: game.genres || [],
        involved_companies: game.involved_companies || []
      };
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return undefined;
  }
};

export async function getRandomGame() {
  try {
    const game = await firebaseGetRandomGame() as any;
    return {
      id: parseInt(game.id),
      name: game.name,
      first_release_date: game.release_date,
      rating: game.rating,
      genres: game.genres || [],
      involved_companies: game.involved_companies || []
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getFiveSuggestions(input: string): Promise<string[]> {
  try {
    const games = await searchGames(input, 5);
    return games.map((game: any) => game.name);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
}

// Leaderboard functions
export async function submitScore(gameId: string, score: number, guessesUsed: number) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await firebaseSubmitScore(user.uid, gameId, score, guessesUsed);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLeaderboard() {
  try {
    return await firebaseGetLeaderboard();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// User functions 
export async function getUser(email: string) {
  return null;
}

export async function getCurrentUser(token: string) {
  // Use auth.currentUser instead
  return null;
}

export async function updateUsername(token: string, username: string) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await firebaseUpdateUsername(user.uid, username);
  } catch (error: any) {
    throw new Error(error.message);
  }
}