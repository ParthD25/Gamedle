import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Authentication functions
export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login for:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", userCredential.user.uid);
    return {
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message);
  }
};

export const registerUser = async (email: string, username: string, password: string) => {
  try {
    console.log("Starting registration for:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential.user.uid);
    
    await updateProfile(userCredential.user, { displayName: username });
    console.log("Profile updated with username:", username);

    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      username,
      createdAt: Timestamp.now(),
      gamesPlayed: 0,
      bestScore: 0
    });
    console.log("Firestore user document created");

    return {
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Game functions
export const getRandomGame = async () => {
  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef);
    const querySnapshot = await getDocs(q);

    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (games.length === 0) {
      throw new Error("No games found");
    }

    // Get random game
    const randomIndex = Math.floor(Math.random() * games.length);
    return games[randomIndex];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const searchGames = async (title: string, limitCount: number = 5) => {
  try {
    console.log('[searchGames] Searching for:', title, 'limit:', limitCount);
    const gamesRef = collection(db, "games");
    
    // Firestore case-sensitive search - use nameLower field for case-insensitive matching
    const searchTerm = title.toLowerCase();
    const q = query(
      gamesRef,
      where("nameLower", ">=", searchTerm),
      where("nameLower", "<=", searchTerm + "\uf8ff"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('[searchGames] Found', results.length, 'results');
    return results;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Leaderboard functions
export const submitScore = async (userId: string, gameId: string, score: number, guessesUsed: number) => {
  try {
    await addDoc(collection(db, "scores"), {
      userId,
      gameId,
      score,
      guessesUsed,
      submittedAt: Timestamp.now()
    });

    // Update user stats
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      await updateDoc(userRef, {
        gamesPlayed: (userData.gamesPlayed || 0) + 1,
        bestScore: Math.max(userData.bestScore || 0, score)
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getLeaderboard = async (limitCount: number = 10) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      orderBy("bestScore", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// User functions
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    throw new Error("User not found");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUsername = async (userId: string, newUsername: string) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      username: newUsername
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};