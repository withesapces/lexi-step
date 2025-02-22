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
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const navVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        height: { duration: 0.3 }
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className="border-b-4 border-black bg-yellow-300 p-4 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="w-full sm:w-auto flex items-center justify-between mb-4 sm:mb-0">
            <Link href="/">
              <motion.div 
                className="flex items-center" 
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <h1 className="text-2xl sm:text-3xl font-black bg-black text-yellow-300 px-3 py-1 transform rotate-1"
                    style={{ textShadow: "2px 2px 0px #FFF" }}>
                  LEXISTEP
                </h1>
              </motion.div>
            </Link>
            
            <motion.button
              onClick={toggleMenu}
              className="sm:hidden bg-black text-yellow-300 p-2 rounded-md border-2 border-black focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
          
          <motion.div
            variants={navVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            className={`w-full sm:w-auto overflow-hidden ${
              isOpen ? "block" : "hidden"
            } sm:flex sm:items-center sm:justify-end sm:flex-1`}
          >
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto items-stretch sm:items-center">
              <motion.div variants={itemVariants} className="w-full sm:w-auto">
                <Link href="/dashboard" className="block w-full">
                  <motion.div
                    className="font-black bg-pink-400 text-black px-4 py-2 border-3 border-black flex items-center justify-center sm:justify-start space-x-2 transform hover:rotate-2 w-full"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye className="text-xl" />
                    <span>DASHBOARD</span>
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants} className="w-full sm:w-auto">
                <Link href="/leaderboard" className="block w-full">
                  <motion.div
                    className="font-black bg-purple-400 text-black px-4 py-2 border-3 border-black flex items-center justify-center sm:justify-start space-x-2 transform hover:-rotate-2 w-full"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTrendingUp className="text-xl" />
                    <span>CLASSEMENT</span>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="w-full sm:w-auto">
                <Link href="/library" className="block w-full">
                  <motion.div
                    className="font-black bg-orange-400 text-black px-4 py-2 border-3 border-black flex items-center justify-center sm:justify-start space-x-2 transform hover:rotate-2 w-full"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IoMdBook className="text-xl" />
                    <span>MES TEXTES</span>
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants} className="w-full sm:w-auto">
                <Link href="/settings" className="block w-full">
                  <motion.div
                    className="font-black bg-cyan-400 text-black px-4 py-2 border-3 border-black flex items-center justify-center sm:justify-start space-x-2 transform hover:rotate-2 w-full"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRegUser className="text-xl" />
                    <span>PROFIL</span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}