import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/paywise-logo.png";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Rewards", href: "#proof" },
   
  ];

  return (
    <header className="fixed top-0 left-0 w-full  z-50 backdrop-blur-md  shadow-sm transition-all duration-300">
      <nav className="flex items-center justify-between px-4 py-3 md:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src={Logo}
              alt="PayWise Logo"
              className="bg-zinc-100 w-32 md:w-40 transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.isLink ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `text-sm font-semibold px-3 py-2 rounded-md transition-colors duration-200 ${
                        isActive ? "underline" : "hover:underline"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-semibold px-3 py-2 rounded-md hover:underline transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}

            <li>
              <Link to="/register">
                <button
                  aria-label="Register for PayWise"
                  className="cursor-pointer bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-700 text-sm text-white px-3 py-2 rounded-3xl font-semibold hover:bg-cyan-600 shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                 Register
                </button>
              </Link>
            </li>
          </ul>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full cursor-pointer transition-colors duration-200"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="flex items-center space-x-4 md:hidden ">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full  hover:bg-blue-800  transition-colors duration-200"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <button
            className="p-2 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-cyan-900 backdrop-blur-lg px-4 py-6 space-y-4">
          <ul className="flex flex-col items-center py-4 bg-cyan-900/10">
            {navItems.map((item) => (
              <li key={item.name} className="w-full text-center">
                {item.isLink ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `block py-3 text-base font-semibold ${
                        isActive ? "underline" : "hover:underline"
                      } transition-colors duration-200`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <a
                    href={item.href}
                    className="block py-3 text-base font-semibold hover:underline transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
