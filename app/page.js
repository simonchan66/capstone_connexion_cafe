"use client";
import Link from "next/link";
import { useState } from "react";
import { useUserAuth } from "./_utils/auth-context";
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loader-spinner';

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut, signInWithEmailAndPassword } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleNFCLogin() {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/nfc_login');
      const data = await response.json();
  
      if (response.ok) {
        console.log('NFC login successful. UID:', data.uid, 'Username:', data.username, 'Role:', data.role);
        if (data.role === 'admin') {
          router.push('/AdminPage');
        } else {
          router.push('/Home');
        }
      } else {
        console.error('NFC login failed:', data.error);
      }
    } catch (error) {
      console.error('NFC login error:', error);
    }
    setLoading(false);
  }

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">

        {/* Loading Modal */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-lg flex flex-col items-center">
              <Oval
                height={80}
                width={80}
                color="#00a2fa"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#00a2fa"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
              <h2 className="text-2xl font-semibold mt-4">Waiting for NFC...</h2>
            </div>
          </div>
        )}



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
      <button
        onClick={handleNFCLogin}
        className="bg-orange-600 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out">

        NFC TAP TAP
      </button>
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
          className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
        >
          Switch Language
        </button>
      </div>
    </main>
  );
}