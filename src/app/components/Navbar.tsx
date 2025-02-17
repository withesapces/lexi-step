"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b-4 border-black bg-gray-200 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">LexiStep</h1>
      <div className="flex space-x-4">
        <Link href="/" className="btn">Home</Link>
        <Link href="/settings" className="btn">Settings</Link>
        <Link href="/account" className="btn">Account</Link>
      </div>
    </nav>
  );
}
