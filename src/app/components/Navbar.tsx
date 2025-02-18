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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">LexiStep</h1>
        {/* Bouton hamburger visible en mobile */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {/* Menu de navigation */}
      <div
        className={`mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 ${
          isOpen ? "block" : "hidden"
        } sm:block`}
      >
        <Link href="/" className="btn block">
          Home
        </Link>
        <Link href="/settings" className="btn block">
          Settings
        </Link>
        <Link href="/account" className="btn block">
          Account
        </Link>
        <Link href="/auth/register" className="btn block">
          Register
        </Link>
      </div>
    </nav>
  );
}
