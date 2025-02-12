import React from 'react';
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import Logo from "../assets/paywise-logo.png"


const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="bg-zinc-100 shadow-sm fixed w-full top-0 z-0 ">
            <nav className=' flex justify-between p-4 items-center md:px-12'>
                <div className=''>
                    <img src={Logo} alt="" className='hover:cursor-pointer w-40 md:w-48'/>
                </div>

                <div className='flex items-center gap-4 p-4'>
                    <ul className='flex gap-4 font-bold'>
                        <li className='hover:cursor-pointer'>Sign In</li>
                        <li className='hover:cursor-pointer'>Register</li>
                    </ul>

                    <button
                        onClick={toggleTheme}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-2xl hover:cursor-pointer"
                    >
                        {theme === "light" ? <Moon className="text-white" /> : <Sun className="text-yellow-400" />}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
