// pages/index.js
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title><Link href='/'>PookieSMS</Link></title>
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </Head>

      <nav className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition duration-300">SecretWhisper</span>
          </Link>
          <SignedOut>
          <div className="hidden md:flex space-x-6">
            <Link href="/sign-in">
              <span className="hover:text-blue-300 transition duration-300">Login</span>
            </Link>
            <Link href="/sign-up">
              <span className="hover:text-blue-300 transition duration-300">Sign Up</span>
            </Link>
          </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          <Link href="/login">
            <span className="block py-2 hover:text-blue-300 transition duration-300">Login</span>
          </Link>
          <Link href="/signup">
            <span className="block py-2 hover:text-blue-300 transition duration-300">Sign Up</span>
          </Link>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Welcome to SecretWhisper
          </h1>
          <p className={`text-xl md:text-2xl mb-8 transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Send messages anonymously with unparalleled security and ease.
          </p>
          <div className={`space-y-4 md:space-y-0 md:space-x-4 transition-opacity duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <span className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
                Get Started
              </span>
            </Link>

          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Anonymity", description: "Your identity remains a secret", icon: "🕵️" },
            { title: "Security", description: "End-to-end encryption for all messages", icon: "🔒" },
            { title: "Simplicity", description: "Easy to use interface", icon: "👌" }
          ].map((feature, index) => (
            <div key={index} className={`bg-gray-700 p-6 rounded-lg shadow-lg float-animation transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: `${index * 0.2}s`}}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 mt-16">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 PookieSMS. Made by  :  <Link className='text-blue-400 font-semibold' href="sumanjana.xyz">Suman Jana</Link> .</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy">
              <span className="text-sm hover:text-blue-300 transition duration-300">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="text-sm hover:text-blue-300 transition duration-300">Terms of Service</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}