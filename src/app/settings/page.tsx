"use client";
export const dynamic = 'force-dynamic';
import Navbar from "../components/Navbar";

export default function Settings() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-5">Options de personnalisation à venir.</p>
      </div>
    </div>
  );
}
