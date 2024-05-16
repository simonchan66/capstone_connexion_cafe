"use client";
import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "./_utils/auth-context";

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut, signInWithEmailAndPassword } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function handleSignIn() {
    gitHubSignIn()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Sign in failed", error);
      });
  }

  function handleEmailSignIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Sign in failed", error);
      });
  }

  function handleSignOut() {
    firebaseSignOut()
      .then(() => {
        console.log("Sign out successful");
      })
      .catch((error) => {
        console.error("Sign out failed", error);
      });
  }

  function handleLanguageChange() {
    const newLang = lang === "en" ? "zh" : "en";
    setLang(newLang);
    document.cookie = `language=${newLang}; path=/`;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-white mb-8">
          Welcome to Connexion Cafe POS
        </h1>
        {!user && (
          <>
            <form onSubmit={handleEmailSignIn} className="mb-3">
              <div className="mb-3">
                <label htmlFor="email" className="block text-white font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="block text-white font-semibold ">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
      >
        Sign In
      </button>
    </form>
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
      >
        Sign In with GitHub
      </button>
      <Link 
        href="/Admin"
        className="block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full w-full text-center transition duration-300 ease-in-out"
      >
        Admin Mode
      </Link>
    </div>
  </>
          
        )}
        {user && (
          <>
            <div className="text-center mb-6">
              <p className="text-white text-xl font-semibold">
                Welcome, {user.displayName || "Anonymous User"}
              </p>
              <p className="text-gray-400">{user.email || "Anonymous"}</p>
            </div>
            <Link
              href="/Home"
              className="block bg-green-600 hover:bg-green-700 text-white text-center font-bold py-3 px-6 rounded-full mb-4 transition duration-300 ease-in-out"
            >
              Go to POS System
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
            >
              Sign Out
            </button>
          </>
        )}
        <button
          onClick={handleLanguageChange}
          className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
        >
          Switch Language
        </button>
      </div>
    </main>
  );
}