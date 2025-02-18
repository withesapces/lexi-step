"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Connexion :", formData);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Connexion réussie !");
        // Rediriger vers le tableau de bord par exemple
        window.location.href = "/";
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion :", error?.message || String(error));
      alert("Erreur serveur");
    }
  };


  const handleGoogleSignIn = () => {
    // Placeholder pour la connexion avec Google
    console.log("Connexion avec Google");
    // Ajoutez ici la logique de connexion avec Google
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Container responsive */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button type="submit" className="btn btn-primary w-full">
            Se connecter
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
          Pas encore inscrit ?{" "}
          <Link href="/auth/register" className="text-blue-600 underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
