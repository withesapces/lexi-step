"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { debounce } from 'lodash';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [usernameStatus, setUsernameStatus] = useState({
    isChecking: false,
    isAvailable: true,
    message: ""
  });

  // Fonction debounce pour éviter trop de requêtes pendant la saisie
  const checkUsernameAvailability = debounce(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus({
        isChecking: false,
        isAvailable: false,
        message: username ? "Pseudo trop court (min. 3 caractères)" : ""
      });
      return;
    }

    setUsernameStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (response.ok) {
        setUsernameStatus({
          isChecking: false,
          isAvailable: data.available,
          message: data.available ? "✅ Pseudo disponible" : "❌ Pseudo déjà pris"
        });
      } else {
        setUsernameStatus({
          isChecking: false,
          isAvailable: false,
          message: "Erreur lors de la vérification"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du pseudo:", error);
      setUsernameStatus({
        isChecking: false,
        isAvailable: false,
        message: "Erreur de connexion"
      });
    }
  }, 500);

  useEffect(() => {
    if (formData.username) {
      checkUsernameAvailability(formData.username);
    }
    return () => {
      checkUsernameAvailability.cancel();
    };
  }, [formData.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérification que le mot de passe et la confirmation correspondent
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas!");
      return;
    }

    // Vérification que le pseudo est valide et disponible
    if (!usernameStatus.isAvailable) {
      alert("Le pseudo n'est pas valide ou déjà pris!");
      return;
    }

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
          identifier: formData.email, // Utiliser l'email comme identifiant par défaut
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

  // Fonction helper pour déterminer la couleur du message de status du pseudo
  const getUsernameStatusColor = () => {
    if (usernameStatus.isChecking) return "text-gray-500";
    if (!usernameStatus.message) return "";
    return usernameStatus.isAvailable ? "text-green-600" : "text-red-600";
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
            <label htmlFor="username" className="block font-black text-xl mb-2">
              🔥 Pseudo unique de génie
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="DrEinstein, SuperNewton..."
              value={formData.username}
              onChange={handleChange}
              className={`w-full border-3 border-black p-3 text-lg font-bold focus:outline-none transition-all ${
                usernameStatus.isAvailable ? "focus:bg-purple-100" : "focus:bg-red-100"
              }`}
              required
            />
            {(usernameStatus.isChecking || usernameStatus.message) && (
              <p className={`mt-2 text-sm font-bold ${getUsernameStatusColor()}`}>
                {usernameStatus.isChecking ? "Vérification en cours..." : usernameStatus.message}
              </p>
            )}
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
              minLength={8}
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
            disabled={!usernameStatus.isAvailable}
          >
            ACTIVER TON SUPER-CERVEAU 🚀
          </motion.button>
        </form>

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