import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ✅ Secure Firebase configuration using .env
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const BASE_URL = import.meta.env.VITE_BASE_URL; // ✅ Ensure BASE_URL is defined

// Google Signup Function
const googleReg = async () => {
    const navigate = useNavigate(); // ✅ Fix navigation issue

    try {
        const result = await signInWithPopup(auth, googleProvider);

        if (!result.user) {
            throw new Error("Google authentication failed");
        }

        const googleToken = await result.user.getIdToken();

        console.log("Google Token:", googleToken); // Debugging

        if (!googleToken) {
            throw new Error("Failed to retrieve Google ID Token");
        }

        // ✅ Send Google token to backend for authentication
        const response = await axios.post(
            `${BASE_URL}/user/google-signup`,  
            { token: googleToken }, 
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
                withCredentials: true, // Send cookies for authentication
            }
        );

        console.log("SignUp Success:", response.data);
        toast.success("Sign-Up Successful!");

        navigate("/dashboard"); // Redirect user after successful sign-up

    } catch (error) {
        console.error("Google Sign-Up Error:", error.response?.data || error.message);
        toast.error("Failed to sign-up with Google. Please try again.");
    }
};

export { auth, googleProvider, signInWithPopup, googleReg };
