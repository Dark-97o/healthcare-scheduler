import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVz7zTfjww0-u3JvVIDz6AACRoJZrTAXM",
  authDomain: "medicare-7a0d3.firebaseapp.com",
  projectId: "medicare-7a0d3",
  storageBucket: "medicare-7a0d3.firebasestorage.app",
  messagingSenderId: "374024044709",
  appId: "1:374024044709:web:72b7e42ece3b2028410d4c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
