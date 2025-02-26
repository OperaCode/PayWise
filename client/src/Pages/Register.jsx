import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/signup.png";
import logo from "../assets/paywise-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { auth, googleProvider } from "../Hooks/FirebaseConfig";
import { signInWithPopup } from "firebase/auth"; // Ensure correct import



const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this matches your .env variable

const Register = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValidMessage, setFormValidMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Password validation
    const [uCase, setUCase] = useState(false);
    const [num, setNum] = useState(false);
    const [sChar, setSChar] = useState(false);
    const [passwordLength, setPasswordLength] = useState(false);

    useEffect(() => {
        const { password } = formData;
        setUCase(/[A-Z]/.test(password));
        setNum(/\d/.test(password));
        setSChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
        setPasswordLength(password.length > 5);
    }, [formData.password]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, password, confirmPassword } = formData;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setFormValidMessage("All fields are required");
            toast.error("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setFormValidMessage("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:3000/user/register`, formData, { withCredentials: true });

            if (response?.data) {
                toast.success("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000); // Delay navigation for better user experience
            }
        } catch (error) {
            toast.error(error?.response?.data?.msg || "Internal Server Error");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };



    const googleReg = async (googleResponse) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const googleToken = await result.user.getIdToken();

            console.log("Google Token:", googleToken); // Debugging

            const response = await axios.post(
                `http://localhost:3000/user/google-signup`,
                { token: googleToken }, // Send in request body
                {
                    headers: { Authorization: `Bearer ${googleToken}` },
                    withCredentials: true,
                }
            );

            console.log("SignUp Success:", response.data);
            toast.success("Sign-Up Successful!");

            // Redirect after successful signup
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Google Sign-Up Error:", error);
            toast.error("Failed to sign-up with Google. Please try again.");
        }
      };



    // const googleReg = async (e) => {
    //     e.preventDefault();
    //     try {

    //         // const idToken = googleResponse.credential; // This contains the ID token

    //         // console.log("Sending Google ID Token:", idToken); // Debugging

    //         // const response = await fetch("http://localhost:3000/user/google-signup", {
    //         //     method: "POST",
    //         //     headers: { "Content-Type": "application/json" },
    //         //     body: JSON.stringify({ idToken }),
    //         // });

    //         // console.log("SignUp Success:", response.data);
    //         // toast.success("Sign-Up Successful!");
    //         // console.log(data);

    //         const result = await signInWithPopup(auth, googleProvider);
    //         const googleToken = await result.user.getIdToken();

    //         console.log("Google Token:", googleToken); // Debugging

    //         const response = await axios.post(
    //             "http://localhost:3000/user/google-signup",
    //             { token: googleToken }, // Send in request body
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${googleToken}`, // Send in headers
    //                 },
    //                 withCredentials: true, // Allow cookies if needed
    //             }
    //         );

    //         console.log("SignUp Success:", response.data);
    //         toast.success("Sign-Up Successful!");
    //     } catch (error) {
    //         console.error("Google Sign-Up Error:", error);
    //         toast.error("Failed to sign-up with Google. Please try again.");
    //     }
    // };

    return (
        <div className="flex-col justify-center p-4">
            {/* Theme Toggle Button */}
            <div className="flex justify-between px-4 items-center">
                <div className="w-50">
                    <Link to="/">
                        <img src={logo} alt="Register" className="bg-zinc-100 w-md rounded-sm" />
                    </Link>
                </div>
                <button onClick={toggleTheme} className="h-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl">
                    {theme === "light" ? <Moon className="text-gray-200" /> : <Sun className="text-yellow-400" />}
                </button>
            </div>

            <div className="p-8 rounded-lg shadow-lg w-full m-auto gap-4 flex">
                {/* Left - Form Section */}
                <div className="p-4 flex-1 justify-center">
                    <h2 className="text-5xl text-center text-cyan-900 mb-3 font-extrabold">Sign up</h2>
                    <p className="mb-6 text-center">Hello Chief! Let’s get you started</p>

                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
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
                        {formValidMessage && <p className="text-red-600">{formValidMessage}</p>}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition"
                            >
                                {loading ? "Registering..." : "Let's get started"}
                            </button>
                        </div>
                    </form>

                    <p className="md:hidden">
                        Already have an account?{" "}
                        <Link to="/login" className="font-bold text-cyan-900">
                            Log in
                        </Link>
                    </p>

                    <p className="p-6 text-center">
                        Make it simple, Sign up with{" "}
                        <span className="font-bold hover:cursor-pointer" onClick={googleReg}>Gmail</span>
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
};

export default Register;
