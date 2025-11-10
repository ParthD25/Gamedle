import { type ApiGame } from "../src/models/Game"
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

function toApiGame(raw: any): ApiGame {
  const idNum = typeof raw.id === 'string' ? parseInt(raw.id, 10) : Number(raw.id);
  const genresArr: any[] = Array.isArray(raw.genres)
    ? raw.genres.map((name: string, idx: number) => ({ id: idx, name }))
    : [];
  const companiesArr: any[] = Array.isArray(raw.involved_companies)
    ? raw.involved_companies.map((name: string, idx: number) => ({ id: idx, company: { id: idx, name } }))
    : [];
  const firstRelease = typeof raw.first_release_date === 'number'
    ? raw.first_release_date
    : (typeof raw.release_date === 'number' ? raw.release_date : undefined);
  const rating = typeof raw.rating === 'number' ? raw.rating : undefined;

  return {
    id: Number.isFinite(idNum) ? idNum : 0,
    name: raw.name,
    first_release_date: firstRelease,
    rating,
    genres: genresArr,
    involved_companies: companiesArr
  };
}

// Game functions
export const requestGameDataWithTitle = async (gameTitle: string): Promise<ApiGame | undefined> => {
  try {
    const games = await searchGames(gameTitle, 1);
    if (games.length > 0) {
      const game = games[0] as any;
      return toApiGame(game);
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
    return toApiGame(game);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getFiveSuggestions(input: string): Promise<string[]> {
  try {
    console.log('[getFiveSuggestions] Input:', input);
    const games = await searchGames(input, 5);
    console.log('[getFiveSuggestions] Raw games:', games);
    const titles = games.map((game: any) => game.name);
    console.log('[getFiveSuggestions] Titles:', titles);
    return titles;
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

// User functions - simplified for Firebase
export async function getUser(_email: string) {
  // Firebase handles users differently - this may not be needed
  return null;
}

export async function getCurrentUser(_token: string) {
  // Use Firebase auth current user
  const user = auth.currentUser;
  if (user) {
    return {
      email: user.email || '',
      username: user.displayName || undefined
    };
  }
  return null;
}

export async function updateUsername(_token: string, username: string) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await firebaseUpdateUsername(user.uid, username);

    // Return expected format for ProfilePage
    return {
      token: await user.getIdToken(),
      user: {
        email: user.email || '',
        username: username
      }
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}