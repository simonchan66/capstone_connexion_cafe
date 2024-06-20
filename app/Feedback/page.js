"use client";

import RestaurantFeedbackForm from "../Components/RestaurantFeedbackForm";

export default function Home() {
  return (
    <main className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="bg-gray-800 text-3xl font-bold text-white mb-4">
        Customer Feedback
      </h1>
      <RestaurantFeedbackForm />
    </main>
  );
}
