'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MyNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-cover bg-center fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600" style={{ backgroundImage: "url('/catbg.png')" }}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-black drop-shadow-lg">SNSerenity</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-controls="navbar-sticky"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${menuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg bg-black/30 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-transparent">
            <li><Link href="/" className="block py-2 px-3 text-black hover:text-pink-300 transition">Home</Link></li>
            <li><Link href="/posts" className="block py-2 px-3 text-black hover:text-pink-300 transition">Posts</Link></li>
            <li><Link href="/users" className="block py-2 px-3 text-black hover:text-pink-300 transition">Users</Link></li>
            <li><Link href="/dashboard" className="block py-2 px-3 text-black hover:text-pink-300 transition">Dashboard</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
