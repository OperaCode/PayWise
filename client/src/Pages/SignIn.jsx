import React from 'react'
import image from "../assets/Register.png"
import { useState, useEffect } from 'react';
import { Moon, Sun } from "lucide-react";
import { Link } from 'react-router-dom';
import logo from "../assets/paywise-logo.png";


const Login = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };
    return (
        <>
            

            <div className="  bg-zinc-100">
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

                <div className="rounded-lg shadow-lg w-full  px-10 gap-4 items-center flex">
                 {/* Right - Illustration */}
                    <div className="w-1/2  hidden md:flex flex-col justify-center items-center ">
                        <img src={image} alt="Signup  Illustration" className="w-md" />
                        <p className="hidden md:block">
                            Don't have an account? <a href="/register" className="font-bold">Sign Up</a> 
                        </p>
                    </div>

                 {/* Left - Form Section */}
                    <div className="w-1/2 p-6  flex-1  ">
                        <h2 className="text-5xl text-center text-cyan-900 mb-3 font-extrabold">Sign in</h2>
                        <p className=" mb-6 text-center">
                            Hello Chief! Welcome Back!
                        </p>
                        <form  className="space-y-4">
                            <input type="email" name="email" placeholder="Email"  className="w-md full p-3 rounded-2xl bg-gray-200 border-4 border-neutral-500 shadow-lg"required />
                            <input type="password" name="password" placeholder="Enter password"  className="w-md full p-3 rounded-2xl bg-gray-200 border-4 border-neutral-500 shadow-lg" required />
                            
                            <button type="submit" className="w-sm bg-cyan-700 text-white py-3 rounded-3xl font-semibold hover:bg-green-900 transition hover:cursor-pointer ">Log in</button>
                        </form>
                        <p className="md:hidden">
                            Don't have an account? <a href="/register" className="font-bold">Sign Up</a>
                        </p>

                    </div>

                    
                </div>

            </div>
        </>
    )
}

export default Login
