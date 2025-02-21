"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiEye, FiTrendingUp } from "react-icons/fi";
import { IoMdBook } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setIsOpen(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className="border-b-4 border-black bg-yellow-300 p-4 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="w-2/12 flex items-center justify-between">
            <Link href="/">
              <motion.div 
                className="flex items-center" 
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <h1 className="text-3xl font-black bg-black text-yellow-300 px-3 py-1 transform rotate-1"
                    style={{ textShadow: "2px 2px 0px #FFF" }}>
                  LEXISTEP
                </h1>
              </motion.div>
            </Link>
            
            <motion.button
              onClick={toggleMenu}
              className="sm:hidden bg-black text-yellow-300 p-3 border-2 border-black focus:outline-none"
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
          
          <motion.div
            variants={navVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            className={`mt-4 w-full sm:w-auto sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 ${
              isOpen ? "block" : "hidden"
            } sm:flex`}
          >
            <motion.div variants={itemVariants}>
              <Link href="/dashboard">
                <motion.div
                  className="font-black bg-pink-400 text-black px-4 py-2 border-3 border-black flex items-center space-x-2 transform hover:rotate-2"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEye className="text-xl" />
                  <span>DASHBOARD</span>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link href="/leaderboard">
                <motion.div
                  className="font-black bg-blue-400 text-black px-4 py-2 border-3 border-black flex items-center space-x-2 transform hover:-rotate-2"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiTrendingUp className="text-xl" />
                  <span>CLASSEMENT</span>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/library">
                <motion.div
                  className="font-black bg-green-400 text-black px-4 py-2 border-3 border-black flex items-center space-x-2 transform hover:rotate-2"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoMdBook className="text-xl" />
                  <span>MES TEXTES</span>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link href="/settings">
                <motion.div
                  className="font-black bg-green-400 text-black px-4 py-2 border-3 border-black flex items-center space-x-2 transform hover:rotate-2"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRegUser className="text-xl" />
                  <span>PROFIL</span>
                </motion.div>
              </Link>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </nav>
  );
}