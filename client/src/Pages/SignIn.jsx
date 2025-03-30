import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";

import { UserContext } from "../context/UserContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/Register.png";
import logo from "../assets/paywise-logo.png";
import Loader from "../components/Loader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(" ");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    // setError("");
    //setLoading(true);

    try {
      const { email, password } = formData;

      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }
      setIsSubmitting(true);

      const response = await axios.post(`${BASE_URL}/user/login`, formData, {
        withCredentials: true,
      });

      if (response?.data) {
        //console.log("Backend Response:", response.data);
        const user = response.data.user;
        //console.log("Backend Response:", user);
        // Store user data locally
        localStorage.setItem("userId", user._id);
        localStorage.setItem("token", user.token);
        //console.log(user);
        //console.log(token)

        setUser(user);
        navigate("/dashboard");
        toast.success("Login Succesful!, Welcome Back!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // const loginUser1 = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const { email, password } = formData;

  //     if (!email || !password) {
  //       toast.error("All fields are required");
  //       return;
  //     }

  //     setIsSubmitting(true);

  //     // ✅ Initialize Firebase Auth
  //     const auth = getAuth();
  //     if (!auth) {
  //       throw new Error("Firebase authentication not initialized properly.");
  //     }

  //     // ✅ Authenticate with Firebase
  //     let userCredential;
  //     try {
  //       userCredential = await signInWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );
  //     } catch (firebaseError) {
  //       console.error("🔥 Firebase Authentication Error:", firebaseError);
  //       if (firebaseError.code === "auth/invalid-credential") {
  //         toast.error("Invalid email or password. Please try again.");
  //       } else {
  //         toast.error(firebaseError.message || "Authentication failed.");
  //       }
  //       return;
  //     }

  //     const user = userCredential.user;
  //     console.log("✅ Firebase User:", user);

  //     // ✅ Get Firebase ID Token
  //     let idToken;
  //     try {
  //       idToken = await user.getIdToken();
  //     } catch (tokenError) {
  //       console.error("🔥 Firebase Token Error:", tokenError);
  //       toast.error("Failed to retrieve authentication token.");
  //       return;
  //     }

  //     console.log("✅ Firebase ID Token:", idToken);

  //     // ✅ Send ID Token to backend
  //     let response;
  //     try {
  //       response = await axios.post(
  //         "http://localhost:3000/user/login",
  //         { idToken },
  //         { withCredentials: true }
  //       );
  //     } catch (apiError) {
  //       console.error("🔥 API Login Error:", apiError);
  //       toast.error(apiError.response?.data?.message || "Login failed.");
  //       return;
  //     }

  //     console.log("✅ Login Successful:", response.data);
  //     toast.success("Login Successful");

  //     // ✅ Store user data in state or localStorage
  //     setUser(response.data);
  //     localStorage.setItem("token", response.data.token);

  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.error("🔥 Unexpected Error:", error);
  //     toast.error(error.message || "An unexpected error occurred.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const GoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      //   console.log("Firebase ID Token:", idToken);
      if (idToken) {
        //console.log(idToken)
        localStorage.setItem("token", idToken);
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        ); 
      }
      // console.log("Google Auth Token:", idToken);

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
        console.log("Backend Response:", response.data);
        const user = response.data.user;
        console.log("Backend Response:", user);
        // Store user data locally
        localStorage.setItem("userId", user._id);
        console.log(user);

        setUser(user);
        navigate("/dashboard");
        toast.success("Google Sign-In Successful!");
      }
    } catch (error) {
      toast.error("Google Sign-In Error");
      console.error("Google Sign-In Error:", error.message);
    }
  };

  // const GoogleLogin = async () => {
  //     const auth = getAuth();
  //     const provider = new GoogleAuthProvider();

  //     try {
  //       const result = await signInWithPopup(auth, provider);
  //       const user = result.user;

  //       // Get Firebase ID token
  //       const idToken = await user.getIdToken();
  //       console.log("Firebase ID Token:", idToken);

  //       // Send the ID Token to backend
  //       const response = await axios.post(
  //         "http://localhost:3000/user/google-auth",
  //         { idToken }
  //       );

  //       if (response?.data) {
  //         console.log("Backend Response:", response);

  //         console.log("Google Login - Backend Response:", response.data);
  //         console.log("Expected userId:", response.data?.user?._id);

  //         // Store user ID explicitly
  //         localStorage.setItem("userId", response.data.user._id);
  //         //localStorage.setItem("token", response.data.token); // 
  //         localStorage.setItem("user", JSON.stringify(response.data.user)); // 

  //         setUser(response.data.user);
  //         navigate("/dashboard", { state: { user: response.data.user } });
  //         toast.success("✅ Google Sign-In Successful!");
  //       }
  //     } catch (error) {
  //       toast.error("Google Sign-In Error");
  //       console.error("Google Sign-In Error:", error.message);
  //     }
  //   };

  
  return (
    <div className="p-8 h-screen">
      {/* Theme Toggle Button */}
      <div className="flex justify-between px-4 items-center">
        <div className="w-50">
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
          className="h-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="text-gray-200" />
          ) : (
            <Sun className="text-yellow-400" />
          )}
        </button>
      </div>

      <div className="rounded-lg shadow-lg w-full px-10 gap-4 items-center flex">
        {/* Right - Illustration */}
        <div className="w-1/2 hidden md:flex flex-col justify-center items-center">
          <img src={image} alt="Signup Illustration" className="w-md" />
          <p className="hidden md:block">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Left - Form Section */}
        <div className="w-1/2 p-6 flex-1 flex-col flex items-center">
          <h2 className="text-5xl text-center text-cyan-900 mb-3 font-extrabold">
            Sign in
          </h2>
          <p className="mb-6 text-center">Hello Chief! Welcome Back!</p>

          <form
            onSubmit={loginUser}
            className="space-y-4 flex-col flex items-center w-full m-auto"
          >
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              placeholder="Email"
              className="w-md full p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="w-md full p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />

            <div className="flex-col space-y-4 items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          {/* Show Loader when Logging in */}
          {loading && (
            <div className="loader">
              <Loader />
            </div>
          )}

          <p className="md:hidden p-2">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold">
              Sign Up
            </Link>
          </p>
          <p className="md:p-6 p-2 text-center">
            Make it simple, Sign in with{" "}
            <span
              className="font-bold hover:cursor-pointer"
              onClick={GoogleLogin}
            >
              Gmail
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
