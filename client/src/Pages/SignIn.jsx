import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Hooks/FirebaseConfig"; // Ensure this is set up correctly
import { toast } from "react-toastify";
import { ThemeContext } from "../context/ThemeContext";

import { UserContext } from "../context/UserContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/Register.png";
import logo from "../assets/paywise-logo.png";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Login = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Fix: Initialize isSubmitting state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Email and Paasword Login
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/user/login`,
        formData,
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(response.data)); // Store user data in local storage
      toast.success("Login successful");
      setUser(response.data.user); // ✅ Update UserContext immediately
      navigate("/dashboard", { state: { user: response.data } }); // Redirect to dashboard
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const GoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get Firebase ID token
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);

      // Send user details to backend
      const response = await axios.post(
        "http://localhost:3000/user/google-login",
        {
          uid: user.uid, // Firebase UID
          email: user.email,
          name: user.displayName,
          profilePic: user.photoURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data) {
        console.log("Backend Response:", response.data);

        // ✅ Store user data in local storage (only on client-side)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setUser(response.data.user);
        navigate("/dashboard", { state: { user: response.data.user } });
        toast.success("✅ Google Sign-In Successful!");
      }
    } catch (error) {
      toast.error("Google Sign-In Error");
      console.error("Google Sign-In Error:", error.message);
    }
  };

  //   const GoogleLogin = async () => {
  //     const auth = getAuth();
  //     // const provider = new GoogleAuthProvider();
  //     try {
  //         signInWithPopup(auth, provider)
  //         .then((result) => {
  //           // This gives you a Google Access Token. You can use it to access the Google API.
  //           const credential = GoogleAuthProvider.credentialFromResult(result);
  //           const token = credential.accessToken;
  //           // The signed-in user info.
  //           const user = result.user;
  //           // IdP data available using getAdditionalUserInfo(result)
  //           // ...
  //         }).
  //       console.log("User Info from Firebase:", user);

  //       // ✅ Send token to backend for verification
  //       const response = await axios.post(
  //         "http://localhost:3000/user/google-login",
  //         { token }
  //       );

  //       console.log("User Info from Backend:", response.data);

  //       // ✅ Store user data in local storage
  //       localStorage.setItem("user", JSON.stringify(response.data.user));

  //       // ✅ Update UserContext immediately
  //       setUser(response.data.user);

  //       // ✅ Redirect to dashboard
  //       navigate("/dashboard", { state: { user: response.data.user } });

  //       toast.success("Login successful");
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
                {isSubmitting ? "Logging in with Email..." : "Email"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                {isSubmitting ? "Logging in with Wallet..." : "Wallet"}{" "}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                {isSubmitting ? "Logging in with Gmail..." : "Gmail"}
              </button>
            </div>
          </form>

          <p className="md:hidden">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold">
              Sign Up
            </Link>
          </p>
          <p className="p-6 text-center">
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
