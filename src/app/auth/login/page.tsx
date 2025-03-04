"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({ 
    identifier: "",
    password: "" 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      identifier: formData.identifier,
      password: formData.password,
    });
    if (res?.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Erreur de connexion : " + res?.error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-yellow-300 flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white border-4 border-black p-8 relative"
        style={{ boxShadow: "8px 8px 0px #000" }}
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-black mb-8 text-center transform -rotate-2"
        >
          <span className="bg-black text-yellow-300 px-4 py-2 inline-block">
            CONNECTE TON CERVEAU
          </span>
        </motion.h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label htmlFor="identifier" className="block font-bold mb-2 text-xl">
              📧 Email ou pseudo
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              placeholder="einstein@cerveau.fr ou DrEinstein"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-bold text-lg focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label htmlFor="password" className="block font-bold mb-2 text-xl">
              🔒 Code secret
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ton mot de passe ultra-sécurisé"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-bold text-lg focus:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              required
            />
          </motion.div>
          
          <motion.button 
            type="submit" 
            className="w-full bg-black text-white font-black text-xl py-4 border-4 border-black hover:bg-yellow-300 hover:text-black transition-all transform hover:-translate-y-1 hover:rotate-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            ACTIVER TON CERVEAU →
          </motion.button>
        </form>
      
        <motion.p 
          className="text-center font-bold text-lg mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Pas encore de super-cerveau ?{" "}
          <Link 
            href="/auth/register" 
            className="bg-green-400 px-2 py-1 font-black hover:bg-black hover:text-white transition-all transform inline-block hover:rotate-1"
          >
            INSCRIS-TOI ICI !
          </Link>
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center bg-yellow-300 border-2 border-black p-3 transform -rotate-1"
        >
          <p className="font-bold">🧠 Connecte-toi pour débloquer +43% de mémoire</p>
        </motion.div>
      </motion.div>
    </div>
  );
}