import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZIQKX7rvASNnW3LxgF_VSH_ihY2jguj8",
  authDomain: "diegmabaru.firebaseapp.com",
  projectId: "diegmabaru",
  storageBucket: "diegmabaru.firebasestorage.app",
  messagingSenderId: "425280354362",
  appId: "1:425280354362:web:d745cadb1d5164e8241d03",
  measurementId: "G-Z0MJD4YL21",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
