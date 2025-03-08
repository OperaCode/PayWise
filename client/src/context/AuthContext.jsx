import React, { createContext, useState, useEffect } from "react";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  getAuth, 
  onAuthStateChanged 
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import axios from "axios";

// 🔹 Firebase Config from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// 🔹 Initialize Firebase & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Function to handle Google Sign-In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // 🔹 Get Firebase ID Token
      const idToken = await firebaseUser.getIdToken();

      // 🔹 Send user data to backend for authentication
      const res = await axios.post(
        "http://localhost:3000/user/google-auth",
        { idToken }, // 🔹 Corrected to send only the Firebase token
        { withCredentials: true }
      );

      // 🔹 Save user data & token in local storage
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // 🔹 Function to handle Logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // 🔹 Monitor Auth State Changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         // 🔹 Get Firebase ID Token
//         const idToken = await firebaseUser.getIdToken();

//         // 🔹 Validate the user session with the backend
//         try {
//           const res = await axios.post(
//             "http://localhost:3000/user/validate-session",
//             { idToken }, // 🔹 Send token to backend for verification
//             { withCredentials: true }
//           );
//           setUser(res.data.user);
//         } catch (error) {
//           console.error("Session validation failed:", error);
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
