import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import image from "../assets/signup.png"
import logo from "../assets/paywise-logo.png"
import { Link } from "react-router-dom";

const Register = () => {
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
        <div className="flex-col justify-center h-screen p-6 ">
            {/* Theme Toggle Button */}
            <div className="flex justify-between px-4 items-center ">
                <div className=" w-50">
                    <Link to="/">
                        <img src={logo} alt="Register" className=" bg-zinc-100 w-md rounded-sm" />
                    </Link>
                </div>
                <button onClick={toggleTheme} className=" h-10  p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:cursor-pointer">
                    {theme === "light" ? <Moon className="text-gray-200" /> : <Sun className="text-yellow-400" />}
                </button>
            </div>
            <div className="p-8 rounded-lg shadow-lg w-full  m-auto gap-4 flex">
                {/* Left - Form Section */}
                <div className=" p-4 flex-1 justify-center ">
                    <h2 className="text-5xl text-center text-cyan-900 mb-3 font-extrabold">Sign up</h2>
                    <p className=" mb-6 text-center">
                        Hello Chief! Let’s get you started
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4 items-center flex-col flex justify-center">
                        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="w-md p-3 rounded-2xl text-black bg-gray-200 border-4 border-neutral-500 shadow-lg" required />
                        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="w-md p-3 rounded-2xl  text-black bg-gray-200  border-4 border-neutral-500 shadow-lg" required />
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-md p-3 rounded-2xl text-black bg-gray-200  border-4 border-neutral-500 shadow-lg" required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-md p-3 rounded-2xl text-black bg-gray-200  border-4 border-neutral-500 shadow-lg" required />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-md p-3 rounded-2xl text-black bg-gray-200  border-4 border-neutral-500 shadow-lg" required />
                        <div className="flex justify-center">
                            <button type="submit" className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer ">Let's get started</button>
                        </div>
                    </form>
                    <p className="md:hidden">
                        Already have an account? <a href="/login" className="font-bold text-cyan-900">Log in</a>
                    </p>

                    <p className="p-6  text-center">Make it simple, Sign up with <span className="font-bold hover:cursor-pointer ">Gmail</span></p>

                </div>

                {/* Right - Illustration */}
                <div className="w-1/2  hidden md:flex flex-col justify-center items-center ">
                    <img src={image} alt="Register  Illustration" className="w-md" />
                    <p className="hidden md:block">
                        Already have an account? <a href="/login" className="font-bold">Log in</a>
                    </p>
                </div>

            </div>


        </div>
    );
};

export default Register;
