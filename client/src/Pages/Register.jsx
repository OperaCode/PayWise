import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/signup.png";
import logo from "../assets/paywise-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from "firebase/auth";
// import AuthContext from "../context/AuthContext";

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
//   const { googleSignIn, user, logout } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear the error when the user types
  };


//   const handlePastePassword = (e) => {
//     e.preventDefault();
//     toast.error("Cannot paste into this field");
//     return;
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError(""); // Reset error before validation

    try {
      const { firstName, lastName, email, password, confirmPassword } =
        formData;

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError("Oops, all fields are required");
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        throw new Error("Passwords do not match");
      }

      
      const response = await axios.post(
        `${BASE_URL}/user/register`,
        formData,
        { withCredentials: true }
      );

      if (response?.data) {
          const userInfo = response.data;
          console.log(userInfo);
        setUser(userInfo);
        toast.success("Registration Successful");
        navigate("/dashboard", { state: { user: user } })} 
    
    }catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Internal server error";
      setError(errorMessage); // Set error message
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  


};

 const googleReg = async (e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Get Firebase ID token
      const token = await user.getIdToken();
      console.log("Firebase Token:", token);
  
      // Send user details to backend
      const response = await axios.post("http://localhost:3000/user/google-auth", {
        uid: user.uid, // Firebase UID
        email: user.email,
        name: user.displayName,
        profilePic: user.photoURL,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
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
 

  return (
    <div className="flex-col justify-center p-4">
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
          className="h-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl"
        >
          {theme === "light" ? (
            <Moon className="text-gray-200" />
          ) : (
            <Sun className="text-yellow-400" />
          )}
        </button>
      </div>

      <div className="p-8 rounded-lg shadow-lg w-full m-auto gap-4 flex">
        {/* Left - Form Section */}
        <div className="p-4 flex-1 justify-center">
          <h2 className="text-5xl text-center text-cyan-900 mb-3 font-extrabold">
            Sign up
          </h2>
          <p className="mb-6 text-center">Hello Chief! Let’s get you started</p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center"
          >
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg"
              required
            />

            {/* Display error message */}
            {/* {formValidMessage && <p className="text-red-600">{formValidMessage}</p>} */}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer"
              >
                {loading ? "Registering..." : "Let's get started"}
              </button>
            </div>
          </form>

          <p className="md:hidden p-2 flex justify-center">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-cyan-900">
              Log in
            </Link>
          </p>

          <p className="md:p-6 p-2 text-center">
            Make it simple, Sign up with{" "}
            <span
              className="font-bold hover:cursor-pointer"
               onClick={googleReg}
            >
              Gmail
            </span>
          </p>
        </div>

        {/* Right - Illustration */}
        <div className="w-1/2 hidden md:flex flex-col justify-center items-center">
          <img src={image} alt="Register Illustration" className="w-md" />
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
}



export default Register;
