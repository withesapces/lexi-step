"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="border-b-4 border-black bg-gray-200 p-4">
      {/* Conteneur principal qui passe en colonne sur mobile et en ligne sur PC */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="w-full flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold">LexiStep</h1>
        </Link>
          {/* Bouton hamburger visible en mobile */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-gray-800 focus:outline-none"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        {/* Liens de navigation : affichage conditionnel et horizontal sur PC */}
        <div
          className={`mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 ${
            isOpen ? "block" : "hidden"
          } sm:flex`}
        >
          <Link href="/dashboard" className="btn block sm:inline-block">
            Home
          </Link>
          <Link href="/settings" className="btn block sm:inline-block">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
