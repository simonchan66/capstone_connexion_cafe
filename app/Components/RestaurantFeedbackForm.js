"use client";
import React, { useState, useEffect, useRef } from "react";
import StarRating from "react-rating-stars-component";
import { MultiSelect } from "react-multi-select-component";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const RestaurantFeedbackForm = () => {
  const moodOptions = ["😍", "😆", "😊", "😑", "☹️", "😠", "🤮"];
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

  const [browserInfo, setBrowserInfo] = useState("");
  const emojiButtonsRef = useRef([]);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setBrowserInfo(userAgent);

    if (emojiButtonsRef.current && emojiButtonsRef.current.length > 0) {
      emojiButtonsRef.current.forEach((button) => {
        if (button && button.ariaLabel === `Mood: ${selectedEmoji}`) {
        }
      });
    }
  }, [selectedEmoji]);

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
  const db = getFirestore();
  const colRef = collection(db, "feedback");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedback_time = new Date().getTime(); // Store the timestamp
    // Perform validation assisted with copilot
    let newErrors = {};

    if (formData.overallRating === 0) {
      newErrors.overallRating = "Please provide an overall rating.";
    }
    // Check if any specific ratings are empty
    const emptyRatings = ratingItems.filter(
      (item) => formData[`${item.toLowerCase()}Rating`] === 0
    );

    if (emptyRatings.length > 0) {
      newErrors.ratings = "Please rate all the specific items.";
    }
    // Check if serving time is empty
    if (formData.servingTime === "") {
      newErrors.servingTime = "Please select a serving time.";
    }
    // Check if favorite items are empty
    if (formData.favoriteItems.length === 0) {
      newErrors.favoriteItems = "Please select at least one favorite item.";
    }

    // Check if a mood emoji is selected
    if (!selectedEmoji) {
      newErrors.mood = "Please select a mood emoji.";
    }

    // If there are errors, set the state and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addDoc(colRef, {
        overallRating: formData.overallRating,
        vibeRating: formData.vibeRating,
        serviceRating: formData.serviceRating,
        productRating: formData.productRating,
        priceRating: formData.priceRating,
        cleanlinessRating: formData.cleanlinessRating,
        servingTime: formData.servingTime,
        favoriteItems: formData.favoriteItems.map((item) => item.value),
        customerFeedback: formData.customerFeedback,
        feedback_time: feedback_time, // Store the timestamp instead of the formatted string
        browserInfo: browserInfo, // Add browser information to the feedback data
        mood: selectedEmoji,
      });

      setSubmitted(true);
      setFormData({
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
      setErrors({});
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleRatingChange = (item, newRating) => {
    setFormData((prev) => ({
      ...prev,
      [`${item.toLowerCase()}Rating`]: newRating,
    }));
  };
  return (
    <div className="container mx-auto mt-10 p-6 bg-gray-800 text-white rounded-md shadow-md items-center justify-center">
      {submitted ? (
        <div className="text-green-400">Thank you for your feedback!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="overallRating"
            className="block text-gray-300 font-bold mb-2"
          >
            Overall Rating:
          </label>
          <StarRating
            name="overallRating"
            value={formData.overallRating}
            onChange={(newRating) => handleRatingChange("overall", newRating)}
            starCount={5}
            emptyStarColor="#4B5563"
            fullStarColor="#FCD34D"
          />
          {errors.overallRating && (
            <p className="text-red-500 text-sm">{errors.overallRating}</p>
          )}

          {/* Specific Ratings */}
          <label className="block text-gray-300 font-bold mb-2">
            Rate the following:
          </label>
          <div className="space-y-2">
            {ratingItems.map((item) => (
              <div key={item} className="flex items-center">
                <label htmlFor={item} className="w-24 text-gray-300">
                  {item}:
                </label>
                <StarRating
                  name={item}
                  value={formData[`${item.toLowerCase()}Rating`]}
                  onChange={(newRating) => handleRatingChange(item, newRating)}
                  starCount={5}
                  emptyStarColor="#4B5563"
                  fullStarColor="#FCD34D"
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
            className="block text-gray-300 font-bold mb-2"
          >
            Serving Time:
          </label>
          <select
            id="servingTime"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md mb-4"
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
          <label className="block text-gray-300 font-bold mb-2">
            Favourite Items (select all that apply):
          </label>

          <MultiSelect
            options={favouriteItemOptions}
            value={formData.favoriteItems}
            onChange={(selected) =>
              setFormData((prev) => ({ ...prev, favoriteItems: selected }))
            }
            labelledBy="Select"
            className="bg-gray-700 mb-4 text-black"
            itemRenderer={(option) => (
              <div className="bg-gray-700 p-2 rounded text-white">
                {option.label}
              </div>
            )}
          />
          {/* Customer Feedback */}
          <label
            htmlFor="customerFeedback"
            className="block  text-gray-300 font-bold mb-2"
          >
            Customer Feedback:
          </label>
          <textarea
            id="customerFeedback"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md mb-4"
            value={formData.customerFeedback}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerFeedback: e.target.value,
              }))
            }
          />
          {/* Mood Selection */}
          <label className="block text-gray-300 font-bold mb-2" htmlFor="mood">
            Choose an emoji that best represents your experience:
          </label>
          <div className="flex space-x-4 mb-4" id="mood">
            {moodOptions.map((emoji, index) => (
              <button
                key={emoji}
                type="button"
                ref={(el) => {
                  if (el) {
                    emojiButtonsRef.current.push(el);
                  }
                }}
                onClick={() => setSelectedEmoji(emoji)}
                aria-label={`Mood: ${emoji}`}
                className={`text-4xl p-2 rounded-full transition duration-300
              ${
                selectedEmoji === emoji
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {errors.mood && <p className="text-red-500 text-sm">{errors.mood}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-4 w-full sm:w-auto"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default RestaurantFeedbackForm;
