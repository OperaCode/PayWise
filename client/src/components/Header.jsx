import React from 'react';
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">PayWise</h1>
      <button
        onClick={toggleTheme}
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        {theme === "light" ? <Moon className="text-gray-800" /> : <Sun className="text-yellow-400" />}
      </button>
    </header>
  );
};

export default Header;
