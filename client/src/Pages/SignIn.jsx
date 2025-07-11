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
import { sendSignInEmail } from "../Hooks/email";

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

      if (response?.data?.user) {
        const user = response.data.user;

        localStorage.setItem("userId", user._id);
        setUser(user);
        // console.log("✅ User from backend:", user);

        await sendSignInEmail(user.firstName, user.email);

        navigate("/dashboard");
        toast.success("Login Successful! Welcome Back!");
      } else {
        toast.error("Invalid server response.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error?.response?.data?.message || "An unexpected error occurred";
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  
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

      const response = await axios.post(
        `${BASE_URL}/auth/google-auth`,
        { idToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response?.data) {
        console.log("Backend Response:", response.data);
        const user = response.data.user;
        console.log("Backend Response:", user);

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
    <div className="p-8 min-h-screen">
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

      <div className="rounded-lg  w-full px- gap-4 items-center flex">
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
        <div className="w-full p-6 flex-1 flex-col flex items-center">
          <h2 className="text-3xl md:text-4xl text-center text-cyan-900 mb-3 font-extrabold">
            Sign in
          </h2>
          <p className="mb-6 text-center">Hello Chief! Welcome Back!</p>

          <form
            onSubmit={loginUser}
            className="space-y-4 flex flex-col items-center w-full justify-center"
          >
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              placeholder="Email"
              className="md:w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="md:w-3/4 p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />

            <div className="w-full  flex items-center justify-center p-4 ">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/4 bg-cyan-700 text-white p-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer"
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

          {/* google signup button */}
          {/* <p className="md:p-6 p-2 text-center">
            Make it simple, Sign in with{" "}
            <span
              className="font-bold hover:cursor-pointer"
              onClick={GoogleLogin}
            >
              Gmail
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
