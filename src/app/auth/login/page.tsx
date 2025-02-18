"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Utilise la fonction signIn pour se connecter avec les credentials
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    if (res?.ok) {
      window.location.href = "/"; // Rediriger vers la page d'accueil ou le dashboard
    } else {
      alert("Erreur de connexion : " + res?.error);
    }
  };

  const handleGoogleSignIn = async () => {
    // Vous pouvez ajouter ici la connexion avec Google
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
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
