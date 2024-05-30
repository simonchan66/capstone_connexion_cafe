"use client";
import Link from "next/link";

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
          <button>中文</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
