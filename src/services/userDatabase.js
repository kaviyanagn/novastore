/**
 * User Database Service
 * -------------------------------------------------------------
 * Features:
 * - Persistent storage using IndexedDB with synchronized localStorage fallback
 * - Pre-seeded accounts (1 authorized CRUD Admin account + 1 sample customer)
 * - Real credential verification during login
 * - Single-account restriction policy for CRUD API access
 */

const DB_NAME = "NovaStore_Database";
const DB_VERSION = 1;
const STORE_NAME = "users";
const LOCAL_STORAGE_KEY = "novastore_user_database";

// Designated single account allowed to access the CRUD API
export const CRUD_AUTHORIZED_EMAIL = "admin@novastore.com";

// Default pre-seeded accounts in the database
const DEFAULT_SEEDED_USERS = [
  {
    id: "usr_admin_001",
    name: "Nova Administrator",
    email: CRUD_AUTHORIZED_EMAIL,
    username: "admin",
    password: "admin123", // In a real backend this is hashed; for browser DB demo it is verified directly
    role: "Administrator",
    canAccessCrud: true, // Only this account has true!
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr_customer_002",
    name: "Alex Morgan",
    email: "customer@novastore.com",
    username: "customer",
    password: "password123",
    role: "Customer",
    canAccessCrud: false, // Standard customer - NO CRUD access
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    createdAt: "2026-02-15T10:30:00.000Z",
  },
];

/**
 * Initialize and load database from storage
 */
export function getDatabaseUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // First time initialization: seed database
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_USERS));
      syncToIndexedDB(DEFAULT_SEEDED_USERS);
      return DEFAULT_SEEDED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_USERS));
      return DEFAULT_SEEDED_USERS;
    }
    return parsed;
  } catch (err) {
    console.warn("Failed to read user database from localStorage:", err);
    return DEFAULT_SEEDED_USERS;
  }
}

/**
 * Save users list to localStorage and IndexedDB
 */
function saveDatabaseUsers(users) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    syncToIndexedDB(users);
  } catch (err) {
    console.error("Failed to save user database:", err);
  }
}

/**
 * IndexedDB background synchronization
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return resolve(null);
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function syncToIndexedDB(users) {
  try {
    const db = await openIndexedDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    users.forEach((u) => store.put(u));
  } catch (err) {
    // Non-blocking fallback
    console.debug("IndexedDB sync notice:", err?.message);
  }
}

/**
 * Initialize database on startup
 */
export function initUserDatabase() {
  return getDatabaseUsers();
}

/**
 * Register a new user and save into the database
 */
export function registerUser({ name, email, username, password }) {
  if (!email || !email.trim()) {
    throw new Error("Email address is required.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = (username || email.split("@")[0] || "user").trim().toLowerCase();
  const cleanName = (name || cleanUsername).trim();

  const users = getDatabaseUsers();

  // Check if account already exists in database
  const existing = users.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail ||
      (u.username && u.username.toLowerCase() === cleanUsername)
  );

  if (existing) {
    throw new Error(`An account with email "${cleanEmail}" already exists in the database. Please sign in instead.`);
  }

  // Security policy: Only the pre-configured admin@novastore.com has CRUD access.
  // Any newly created account in the database is a standard customer without CRUD access.
  const isAuthorizedAdmin = cleanEmail === CRUD_AUTHORIZED_EMAIL.toLowerCase();

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    email: cleanEmail,
    username: cleanUsername,
    password: password,
    role: isAuthorizedAdmin ? "Administrator" : "Customer",
    canAccessCrud: isAuthorizedAdmin,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveDatabaseUsers(updatedUsers);

  // Return user without revealing sensitive password
  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Authenticate credentials against the user database
 */
export function authenticateUser({ emailOrUsername, password }) {
  if (!emailOrUsername || !emailOrUsername.trim()) {
    throw new Error("Email address or username is required.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }

  const query = emailOrUsername.trim().toLowerCase();
  const users = getDatabaseUsers();

  // 1. Check if user exists in the database
  const matchedUser = users.find(
    (u) =>
      u.email.toLowerCase() === query ||
      (u.username && u.username.toLowerCase() === query)
  );

  if (!matchedUser) {
    throw new Error(
      `No user found in the database matching "${emailOrUsername}". Please check your email or register a new account.`
    );
  }

  // 2. Check password against database record
  if (matchedUser.password !== password) {
    throw new Error("Incorrect password. Please verify your credentials and try again.");
  }

  // 3. Return sanitized user
  const { password: _, ...safeUser } = matchedUser;
  return safeUser;
}

/**
 * Check if a given user has permission to access the CRUD API
 * ONLY ONE account (admin@novastore.com) is granted access.
 */
export function checkCrudAccess(user) {
  if (!user || !user.email) return false;
  return (
    user.email.toLowerCase() === CRUD_AUTHORIZED_EMAIL.toLowerCase() &&
    Boolean(user.canAccessCrud)
  );
}

/**
 * Reset database to default seed data (useful for demonstration/testing)
 */
export function resetDatabase() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEEDED_USERS));
  syncToIndexedDB(DEFAULT_SEEDED_USERS);
  return DEFAULT_SEEDED_USERS;
}
