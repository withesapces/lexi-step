"use client";

import Navbar from "../components/Navbar";

export default function Account() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="mt-5">Gérer votre compte ici.</p>
      </div>
    </div>
  );
}
