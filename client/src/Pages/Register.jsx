import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/signup.png";
import logo from "../assets/paywise-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {sendWelcomeEmail} from '../Hooks/email'
import { motion } from "framer-motion";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); 
  };

  //   const handlePastePassword = (e) => {
  //     e.preventDefault();
  //     toast.error("Cannot paste into this field");
  //     return;
  //   };

  const emailReg = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError(""); 

    try {
      const { firstName, lastName, email, password, confirmPassword } =
        formData;

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        toast.error("Oops, all fields are required");
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        throw new Error("Passwords do not match");
      }

      const response = await axios.post(`${BASE_URL}/user/register`, formData, {
        withCredentials: true,
      });

      if (response?.data) {
        const userData = response.data.user;

        
        localStorage.removeItem("userId"); 
        localStorage.setItem("userId", userData._id); 

        //localStorage.setItem("userId", userData._id);
        setUser(userData);
        await sendWelcomeEmail(userData.firstName, userData.email);
        navigate("/dashboard");
        toast.success(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Internal server error";
      setError(errorMessage); 
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };


  // google signUp, working
  const googleReg = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
       (user);

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      //    ("Firebase ID Token:", idToken);
      if (idToken) {
         (idToken);
        //localStorage.setItem('token', idToken);
        // ("Token stored in localStorage:", localStorage.getItem("token")); 
      }
      //  ("Google Auth Token:", idToken);

      // Send the ID Token to backend
      const response = await axios.post(
        "http://localhost:3000/auth/google-auth",
        { idToken }, // The request body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response?.data) {
         ("Backend Response:", response.data);
        const user = response.data.user;
         ("Backend Response:", user);
        // Store user data locally
        localStorage.setItem("userId", user._id);
         (user._id);

        setUser(user);
        navigate("/dashboard");
        toast.success("Google Sign-In Successful!");
      }
    } catch (error) {
      toast.error("Google Sign-In Error");
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <div className="flex-col justify-center  p-8 min-h-screen">
      {/* Theme Toggle Button */}
      <div className="flex justify-between px-4 items-center">
        <div className="w-35">
          <Link to="/">
            <img
              src={logo}
              alt="Register"
              className="bg-zinc-100 w-md rounded-sm"
            />
          </Link>
        </div>
        <button
          onClick={toggleTheme}
          className="h-10  p-2 bg-blue-950 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="text-gray-200" />
          ) : (
            <Sun className="text-yellow-400" />
          )}
        </button>
      </div>

      


      <div className="p-  rounded-lg  w-full m-auto gap-4 md:flex items-center ">
        {/* soft background accents */}
          <div
            aria-hidden
            className=" pointer-events-none absolute top-2 -left-24 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl"
          ></div>
          <div
            aria-hidden
            className="hidden md:block pointer-events-none absolute top-40 right-5  h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl"
          ></div>
        {/* Left - Form Section */}
        <div className="py-4 md:flex-1 justify-center ">
          <h2 className=" text-3xl md:text-5xl text-center mb-3 font-extrabold bg-gradient-to-r from-green-800 via-cyan-600 to-cyan-500 bg-clip-text text-transparent">
            Sign up
          </h2>
          <p className="mb-6 text-center">Hello Chief! Let’s get you started</p>

          <form
            onSubmit={emailReg}
            className="space-y-4 flex flex-col items-center w-full justify-center"
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className=" w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-cyan-700 shadow-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-cyan-700 shadow-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-cyan-700 shadow-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onPaste={(e) => e.preventDefault()}
              className="w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-cyan-700 shadow-lg"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onPaste={(e) => e.preventDefault()}
              className="w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-cyan-700 shadow-lg"
              required
            />

            
            <div className="flex w-full justify-center ">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={emailReg}
                className="cursor-pointer  bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:scale-105 w-2/4"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="md:hidden p-2 flex justify-center">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-cyan-900">
              Log in
            </Link>
          </p>


          {/* google signup button */}
          {/* <p className="md:p-6 p-2 text-center">
            Make it simple, Sign up with{" "}
            <span
              className="font-bold hover:cursor-pointer"
              onClick={googleReg}
            >
              Gmail
            </span>
          </p> */}
        </div>

        {/* Right - Illustration */}
        <div className="w-1/2 hidden md:flex flex-col flex-1 justify-center items-center">
         
          <motion.img
              src={image}
              alt="Register Illustration"
              className="w-md drop-shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          <p className="hidden md:block p-3">
            Already have an account?{" "}
            <Link to="/login" className="font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
