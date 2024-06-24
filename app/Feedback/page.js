"use client";

import RestaurantFeedbackForm from "../Components/RestaurantFeedbackForm";

export default function Home() {
  return (
    <main className="bg-gray-800 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="bg-gray-800 text-3xl font-bold text-white">
          Customer Feedback
        </h1>
      </div>
      <div className="w-full max-w-md">
        <RestaurantFeedbackForm />
      </div>
    </main>
  );
}
