import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from '../assets/logo.png';
import logo2 from '../assets/logo2.png'
import { div } from "framer-motion/client";

const menuItems = [];

function Navbar() {
  const [isTop, setIsTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <header
        className={`
        top-0 left-0 w-full z-50 
        transition-colors duration-400 ease-in-out font-bebas 
        ${isTop
            ? ""

            : "bg-stone-300 shadow-lg shadow-stone-800/60"
          }
      `}
      >
        {/* 1. Container: Justify center when top, between when scrolled */}
        <div
          className={`
          container mx-auto px-4 md:px-[6rem] py-5 flex items-center gap-10 
          transition-all duration-400 ease-in-out font-bebas bg-white
          ${isTop ? "justify-center h-[10rem]" : "justify-center h-[6rem]"} 
        `}
        >
          {/* 2. Logo: Change size and margin based on isTop */}
          <a href="/" className="transition-all duration-400 ease-in-out hover:opacity-80 z-10">
            <img
              src={logo}
              alt="Your Company Logo"
              className={`
              w-auto transition-all duration-400 ease-in-out
              ${isTop ? "h-40" : "h-3"}  {/* Adjust h-24 and h-10 as needed */}
            `}
            />
          </a>
          <a href="/" className="transition-all duration-400 ease-in-out hover:opacity-80 z-10">
            <img
              src={logo2}
              alt="Your Company Logo"
              className={`
              w-auto transition-all duration-400 ease-in-out
              ${isTop ? "h-40" : "h-3"}  {/* Adjust h-24 and h-10 as needed */}
            `}
            />
          </a>

          {/* 3. Desktop Menu: Hide when logo is centered (isTop=true) */}
          <nav className={`hidden md:block font-bebas transition-opacity duration-300 ${isTop ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <ul className="flex space-x-8">
              {menuItems.map((item) => (
                <li key={item.id} className="relative group">
                  <a
                    href={item.href}
                    target={item.target}
                    className="text-white font-bold text-md transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                  <span className="absolute -bottom-2 left-1 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full mt-2"></span>
                </li>
              ))}
            </ul>
          </nav>


        </div>

        {/* Mobile Menu (No change, opens based on hamburger click) */}
        {isMobileMenuOpen && (
          <nav className="md:hidden absolute top-full left-0 w-full bg-stone-600 shadow-lg z-20">
            <ul className="flex flex-col p-4 text-white">
              {menuItems.map((item) => (
                <li key={item.id} className="border-b border-stone-500">
                  <a
                    href={item.href}
                    target={item.target}
                    className="block py-3 hover:bg-stone-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <div className="h-[5rem] flex flex-col items-center justify-center w-full ">
        <a href="/" className="transition-all text-gray-800 duration-400 text-[3rem] ease-in-out hover:opacity-80 z-10 flex items-center justify-center">
          MENU
        </a>
        <div className="flex items-center justify-center text-[1rem] text-gray-800">EXPERIENCE CULINARY ELEGANCE</div>
      </div>
    </div>
  );
}

export default Navbar;