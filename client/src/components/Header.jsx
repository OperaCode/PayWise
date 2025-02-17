import React from 'react';
import { useContext,useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import Logo from "../assets/paywise-logo.png"
import { Link } from 'react-router-dom';


const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext); // Get theme & toggle function


   
    return (
        <header className="  fixed w-screen top-0 z-50 pt-2">
            <nav className=' flex justify-between p-4 items-center md:px-12'>
                <div className='bg-zinc-100 rounded-sm'>
                   <Link to="/">
                   <img src={Logo} alt="" className='hover:cursor-pointer w-40 md:w-48'/>
                   </Link>
                </div>

                <div className='flex items-center gap-4 p-4'>
                    <ul className='flex gap-4 font-bold'>
                        <Link to="/login">
                        <li className='hover:cursor-pointer'>Sign In</li>
                        </Link>
                        <Link to="/register">
                        <li className='hover:cursor-pointer'>Register</li>
                        </Link>
                    </ul>

                    <button
                        onClick={toggleTheme}
                        className="p-2 bg-blue-950 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
                    >
                        {theme === "light" ? <Moon className="text-white" /> : <Sun className="text-yellow-400" />}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
