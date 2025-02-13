import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/signup.png"
import logo from "../assets/paywise-logo.png"
import { Link } from "react-router-dom";

const SignUp = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form validation logic here
        console.log(formData);
    };

    return (
        <div className="flex-col justify-center h-screen bg-zinc-100">
            {/* Theme Toggle Button */}
            <div className="flex justify-between px-4 items-center ">
                <div className=" w-50">
                    <Link to="/">
                        <img src={logo} alt="signup" className="" />
                    </Link>
                </div>
                <button onClick={toggleTheme} className=" h-10  p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:cursor-pointer">
                    {theme === "light" ? <Moon className="text-gray-200" /> : <Sun className="text-yellow-400" />}
                </button>
            </div>
            <div className="p-8 rounded-lg shadow-lg w-full  gap-4 flex">
                {/* Left - Form Section */}
                <div className="w-1/2 p- flex-1">
                    <h2 className="text-3xl text-center mb-3 font-bold">Sign up</h2>
                    <p className=" mb-6 text-center">
                        Hello Chief! Let’s get you started
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-200  shadow-md" required />
                        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-200  shadow-md" required />
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-200  shadow-md" required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-200  shadow-md" required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-200  shadow-md" required />
                        <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition hover:cursor-pointer">Let's get started</button>
                    </form>
                    <p className="md:hidden">
                        Already have an account? <a href="/login" className="font-bold">Log in</a>
                    </p>

                </div>

                {/* Right - Illustration */}
                <div className="w-1/2  hidden md:flex flex-col justify-center items-center ">
                    <img src={image} alt="Signup  Illustration" className="w-md" />
                    <p className="hidden md:block">
                        Already have an account? <a href="/login" className="font-bold">Log in</a>
                    </p>
                </div>

            </div>


        </div>
    );
};

export default SignUp;
