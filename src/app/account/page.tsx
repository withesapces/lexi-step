"use client";

export const dynamic = "force-dynamic";

import { useSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Account() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="mt-5">Gérer votre compte ici.</p>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="btn btn-primary mt-4"
        >
          Se déconnecter
        </button>

      </div>
    </div>
  );
}
