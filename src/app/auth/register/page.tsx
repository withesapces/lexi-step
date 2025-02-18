"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

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
  
    console.log("Données envoyées :", JSON.stringify(formData));
  
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      console.log("Réponse brute :", response);
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Inscription réussie !");
        window.location.href = "/auth/login";
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
    console.log("Connexion avec Google");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Container responsive */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-bold mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-bold mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-bold mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            S'inscrire
          </button>
        </form>

        <div className="my-6 text-center">
          <span className="block mb-2">Ou</span>
          <button
            onClick={handleGoogleSignIn}
            className="btn w-full flex items-center justify-center space-x-2"
          >
            <FcGoogle size={20} />
            <span>Se connecter avec Google</span>
          </button>
        </div>

        <p className="text-center">
          Déjà inscrit ?{" "}
          <Link href="/auth/login" className="text-blue-600 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
