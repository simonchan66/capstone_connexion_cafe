"use client";
import Link from 'next/link';

const Navigation = () => {


  return (
    <nav>
      <ul>
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <Link href="/OrderPage">Order</Link>
        </li>
        <li>
          <Link href="/AllStatsPage">Stats</Link>
        </li>
        <li>
          <Link href="/Editproduct">Edit</Link>
        </li>
        <li>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            中文
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;