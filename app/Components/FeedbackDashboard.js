"use client"
import React, { useState, useEffect, use } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ReactStars from "react-stars";
// assisted by Copilot and Claude 3 Opus
const FeedbackDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  // Fetch feedback data from Firestore
  useEffect(() => {
    const fetchFeedbackData = async () => {
      const db = getFirestore();
      const colRef = collection(db, "feedback");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map((doc) => doc.data());
      setFeedbackData(data);
    };

    fetchFeedbackData();
  }, []);
  // Calculate overall score
  const calculateOverallScore = () => {
    const totalScore = feedbackData.reduce((sum, feedback) => sum + feedback.overallRating, 0);
    const averageScore = totalScore / feedbackData.length;
    return Math.round((averageScore / 5) * 100);
  };

  const calculateCategoryPerformance = () => {
    const categories = ["Vibe", "Service", "Product", "Price", "Cleanliness"];
    const performanceData = categories.map((category) => {
      const totalScore = feedbackData.reduce((sum, feedback) => sum + feedback[`${category.toLowerCase()}Rating`], 0);
      const averageScore = totalScore / feedbackData.length;
      return { category, score: averageScore };
    });
    return performanceData;
  };

  const calculateServingTimeDistribution = () => {
    const servingTimeRanges = ["0-5", "5-10", "10-15", "15-30", "30+"];
    const distributionData = servingTimeRanges.map((range) => {
      const count = feedbackData.filter((feedback) => feedback.servingTime === range).length;
      return { range, count };
    });
    return distributionData;
  };

  const getTopFavoriteItems = (count) => {
    const favoriteItemsCount = {};
    feedbackData.forEach((feedback) => {
      feedback.favoriteItems.forEach((item) => {
        favoriteItemsCount[item] = (favoriteItemsCount[item] || 0) + 1;
      });
    });

    const sortedFavoriteItems = Object.entries(favoriteItemsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([item, count]) => ({ item, count }));

    return sortedFavoriteItems;
  };

  const getRecentFeedbacks = (count, type) => {
    const sortedFeedbacks = [...feedbackData].sort((a, b) => b.timestamp - a.timestamp);
    const filteredFeedbacks = sortedFeedbacks.filter((feedback) =>
      type === "positive" ? feedback.overallRating >= 3 : feedback.overallRating < 3
    );
    return filteredFeedbacks.slice(0, count);
  };
  return (
    <div className="containerdash mx-auto mt-8 p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Overall Score</h2>
          <div style={{ width: 120, height: 120, margin: "auto" }}>
            <CircularProgressbar
              value={calculateOverallScore()}
              text={`${calculateOverallScore()}%`}
              styles={buildStyles({
                textColor: "white",
                pathColor: "turquoise",
                trailColor: "gray",
              })}
            />
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Category Performance</h2>
          <div className="space-y-2">
            {calculateCategoryPerformance().map((item) => (
              <div key={item.category} className="flex items-center">
                <span className="text-white font-semibold w-24">{item.category}:</span>
                <ReactStars
                  count={5}
                  value={Math.round(item.score * 2) / 2}
                  size={20}
                  color1={"#FFFFFF"}
                  color2={"#FCD34D"}
                  edit={false}
                  half={true}
                />
                <span className="ml-2 text-white text-sm">({item.score.toFixed(2)})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Serving Time Distribution */}
        <div className="bg-gray-700 p-4 rounded shadow col-span-2 md:col-span-1">
          <h2 className="text-lg font-bold mb-2">Serving Time Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={calculateServingTimeDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Favorite Items */}
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Top Favorite Items</h2>
          <ol className="list-decimal list-inside">
            {getTopFavoriteItems(3).map((item) => (
              <li key={item.item} className="text-sm">
                {item.item} ({item.count})
              </li>
            ))}
          </ol>
        </div>

        {/* Recent Positive Feedbacks */}
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Recent Positive Feedbacks</h2>
          <ul className="list-disc list-inside">
            {getRecentFeedbacks(3, "positive").map((feedback, index) => (
              <li key={index} className="text-sm mb-1">
                {feedback.customerFeedback}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Negative Feedbacks */}
        <div className="bg-gray-700 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Recent Negative Feedbacks</h2>
          <ul className="list-disc list-inside">
            {getRecentFeedbacks(3, "negative").map((feedback, index) => (
              <li key={index} className="text-sm mb-1">
                {feedback.customerFeedback}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;