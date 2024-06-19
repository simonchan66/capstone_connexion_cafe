"use client";

import RestaurantFeedbackForm from "./RestaurantFeedbackForm";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Customer Feedback
      </h1>
      <RestaurantFeedbackForm />
    </main>
  );
}
