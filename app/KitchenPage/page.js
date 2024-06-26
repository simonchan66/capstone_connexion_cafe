"use client";

import KitchenOutput from "../Components/KitchenOutput";

export default function Kitchen() {
  return (
    <main className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="bg-gray-800 text-3xl font-bold text-white mb-4">
        Kitchen My Friend
      </h1>
      <KitchenOutput />
    </main>
  );
}
