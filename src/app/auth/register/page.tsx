// src/app/auth/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inscription réussie !");
        // Connecter directement l'utilisateur avec NextAuth
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        if (res?.ok) {
          window.location.href = "/dashboard";
        } else {
          // Si l'authentification échoue, rediriger vers login
          window.location.href = "/auth/login";
        }
      } else {
        alert("Erreur : " + data.message);
      }

    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Erreur serveur");
    }
  };

  const handleGoogleSignIn = () => {
    // Placeholder pour la connexion avec Google
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-yellow-300 flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl bg-white border-4 border-black p-8 relative"
        style={{ boxShadow: "10px 10px 0px #000" }}
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-black mb-10 text-center transform -rotate-2"
        >
          <span className="bg-black text-yellow-300 px-6 py-3 inline-block">
            REJOINS LES GÉNIES
          </span>
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block font-black text-xl mb-2">
              🧠 Nom de super-génie
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Newton, Einstein, Toi..."
              value={formData.name}
              onChange={handleChange}
              className="w-full border-3 border-black p-3 text-lg font-bold focus:bg-pink-100 focus:outline-none transition-all transform hover:rotate-0"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block font-black text-xl mb-2">
              📧 Email de cerveau supérieur
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ton.genie@neurones.fr"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-3 border-black p-3 text-lg font-bold focus:bg-blue-100 focus:outline-none transition-all"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block font-black text-xl mb-2">
              🔒 Code secret ultra-puissant
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Minimum 8 caractères géniaux"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-3 border-black p-3 text-lg font-bold focus:bg-green-100 focus:outline-none transition-all"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="confirmPassword" className="block font-black text-xl mb-2">
              🔄 Confirme ton génie
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Même code, même génie"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border-3 border-black p-3 text-lg font-bold focus:bg-yellow-100 focus:outline-none transition-all"
              required
            />
          </motion.div>

          <motion.button 
            variants={itemVariants}
            type="submit" 
            className="w-full bg-black text-white font-black text-xl py-4 mt-6 border-4 border-black hover:bg-yellow-400 hover:text-black transition-all transform hover:-translate-y-1"
            whileHover={{ scale: 1.03, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
          >
            ACTIVER TON SUPER-CERVEAU 🚀
          </motion.button>
        </form>

        <motion.div 
          variants={itemVariants}
          className="mt-8 mb-6"
        >
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t-4 border-black"></div>
            <span className="mx-4 px-4 py-1 font-black text-lg bg-blue-400 transform rotate-1 inline-block">
              OPTION RAPIDE
            </span>
            <div className="flex-grow border-t-4 border-black"></div>
          </div>
          
          <motion.button
            variants={itemVariants}
            onClick={handleGoogleSignIn}
            className="mt-6 w-full bg-white text-black font-black text-lg py-3 border-4 border-black hover:bg-pink-400 transition-all flex items-center justify-center space-x-3"
            whileHover={{ scale: 1.02, rotate: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <FcGoogle size={24} />
            <span>GÉNIE EXPRESS AVEC GOOGLE</span>
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center bg-green-400 border-2 border-black p-4 transform -rotate-1 mb-6"
        >
          <p className="font-black text-lg">⚡️ +38% de productivité garantie ou remboursé</p>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-center font-bold text-lg"
        >
          Déjà un cerveau supérieur ?{" "}
          <Link 
            href="/auth/login" 
            className="bg-yellow-300 px-3 py-1 font-black hover:bg-black hover:text-white transition-all transform inline-block hover:rotate-1"
          >
            CONNECTE-TOI ICI !
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}