"use client";
import React, { useState } from "react";
import StarRating from "react-rating-stars-component";
import { MultiSelect } from "react-multi-select-component";

const RestaurantFeedbackForm = () => {
  const [formData, setFormData] = useState({
    overallRating: 0,
    vibeRating: 0,
    serviceRating: 0,
    productRating: 0,
    priceRating: 0,
    cleanlinessRating: 0,
    servingTime: "",
    favoriteItems: [],
    customerFeedback: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const ratingItems = ["Vibe", "Service", "Product", "Price", "Cleanliness"];

  const favouriteItemOptions = [
    { label: "Cappuccino", value: "Cappuccino" },
    { label: "Latte", value: "Latte" },
    { label: "Espresso", value: "Espresso" },
    { label: "Americano", value: "Americano" },
    { label: "Coffee", value: "Coffee" },
    { label: "Tea", value: "Tea" },
    { label: "Hot Chocolate", value: "Hot Chocolate" },
    { label: "HK Milk Tea", value: "HK Milk Tea" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.overallRating)
      newErrors.overallRating = "Please provide an overall rating.";
    if (
      formData.ratings &&
      Object.values(formData.ratings).filter((rating) => rating === 0).length >
        0
    ) {
      // Check if any specific ratings are 0
      newErrors.ratings = "Please rate all aspects of the restaurant.";
    }
    if (!formData.servingTime)
      newErrors.servingTime = "Please select a serving time.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Replace with your actual API submission logic (e.g., using fetch)
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          // ... reset form data here
        });
        setErrors({});
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Handle submission errors (e.g., show an error message to the user)
    }
  };

  const handleRatingChange = (item, newRating) => {
    setFormData((prev) => ({
      ...prev,
      [`${item.toLowerCase()}Rating`]: newRating,
    }));
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      {submitted ? (
        <div className="text-green-600">Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="overallRating"
            className="block text-gray-700 font-bold mb-2"
          >
            Overall Rating:
          </label>
          <StarRating
            name="overallRating"
            value={formData.overallRating}
            onChange={(newRating) => handleRatingChange("overall", newRating)}
            starCount={5}
            emptyStarColor="#ddd"
          />
          {errors.overallRating && (
            <p className="text-red-500 text-sm">{errors.overallRating}</p>
          )}

          {/* Specific Ratings */}
          <label className="block text-gray-700 font-bold mb-2">
            Rate the following:
          </label>
          <div className="space-y-2">
            {ratingItems.map((item) => (
              <div key={item} className="flex items-center">
                <label htmlFor={item} className="w-24">
                  {item}:
                </label>
                <StarRating
                  name={item}
                  value={formData[`${item.toLowerCase()}Rating`]}
                  onChange={(newRating) => handleRatingChange(item, newRating)}
                  starCount={5}
                  emptyStarColor="#ddd"
                />
              </div>
            ))}
            {errors.ratings && (
              <p className="text-red-500 text-sm">{errors.ratings}</p>
            )}
          </div>

          {/* Serving Time */}
          <label
            htmlFor="servingTime"
            className="block text-gray-700 font-bold mb-2"
          >
            Serving Time:
          </label>
          <select
            id="servingTime"
            className="w-full p-2 border rounded-md mb-4"
            value={formData.servingTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, servingTime: e.target.value }))
            }
          >
            <option value="">Select</option>
            <option value="0-5">0-5 mins</option>
            <option value="5-10">5-10 mins</option>
            <option value="10-15">10-15 mins</option>
            <option value="15-30">15-30 mins</option>
            <option value="30+">More than 30 mins</option>
          </select>
          {errors.servingTime && (
            <p className="text-red-500 text-sm">{errors.servingTime}</p>
          )}

          {/* Favourite Items */}
          <label className="block text-gray-700 font-bold mb-2">
            Favourite Items (select all that apply):
          </label>
          <MultiSelect
            options={favouriteItemOptions}
            value={formData.favoriteItems}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, favoriteItems: selected }))
            }
            labelledBy="Select"
            className="mb-4"
          />

          {/* Customer Feedback */}
          <label
            htmlFor="customerFeedback"
            className="block text-gray-700 font-bold mb-2"
          >
            Customer Feedback:
          </label>
          <textarea
            id="customerFeedback"
            className="w-full p-2 border rounded-md mb-4"
            value={formData.customerFeedback}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerFeedback: e.target.value,
              }))
            }
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default RestaurantFeedbackForm;
