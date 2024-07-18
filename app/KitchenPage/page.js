"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useLanguage } from "../_utils/LanguageContext";
import KitchenOutput from "../Components/KitchenOutput";
// All code are assisted by Copilot, ChatGPT, Gemini and Claude3.5
const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [callOutInfo, setCallOutInfo] = useState(null);
  const { t } = useLanguage();
  const modalRef = useRef(null);
  const [urgentOrders, setUrgentOrders] = useState([]); // Track urgent orders

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore();
      const ordersRef = collection(db, "transactions");
      const q = query(ordersRef, where("done", "==", false));

      try {
        const querySnapshot = await getDocs(q);
        const newOrdersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders((prevOrders) => {
          // Merge new orders with existing ones, preserving elapsedTime
          const updatedOrders = newOrdersData.map((newOrder) => {
            const existingOrder = prevOrders.find(
              (order) => order.id === newOrder.id
            );
            return existingOrder
              ? { ...newOrder, elapsedTime: existingOrder.elapsedTime }
              : { ...newOrder, elapsedTime: 0 }; // New order, so elapsedTime is 0
          });

          // Prioritize and sort as before
          const sortedOrders = updatedOrders.sort((a, b) => {
            if (a.urgent !== b.urgent) {
              return a.urgent ? -1 : 1;
            } else {
              return (
                new Date(a.transaction_time) - new Date(b.transaction_time)
              );
            }
          });
          return sortedOrders;
        });

        setUrgentOrders(
          newOrdersData.filter((order) => order.urgent).map((order) => order.id)
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          elapsedTime: Math.floor(
            (Date.now() - new Date(order.transaction_time).getTime()) / 1000
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedOrder(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleOrderDone = async () => {
    if (selectedOrder) {
      const db = getFirestore();
      const orderRef = doc(db, "transactions", selectedOrder.id);

      try {
        await updateDoc(orderRef, { done: true });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== selectedOrder.id)
        );
        setSelectedOrder(null);
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  const handleUrgent = async (orderId) => {
    try {
      const db = getFirestore();
      const orderRef = doc(db, "transactions", orderId);

      const updatedUrgentOrders = urgentOrders.includes(orderId)
        ? urgentOrders.filter((id) => id !== orderId)
        : [orderId, ...urgentOrders];

      await updateDoc(orderRef, { urgent: !urgentOrders.includes(orderId) });
      setUrgentOrders(updatedUrgentOrders);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, urgent: !urgentOrders.includes(orderId) }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order urgency:", error);
    }
  };

  const handleHold = async (orderId) => {
    try {
      const db = getFirestore();
      const orderRef = doc(db, "transactions", orderId);

      const orderDoc = await getDoc(orderRef);
      const currentOnHoldStatus = orderDoc.data().onHold || false;

      await updateDoc(orderRef, { onHold: !currentOnHoldStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, onHold: !currentOnHoldStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleCallOut = (lang) => {
    if (selectedOrder) {
      setCallOutInfo({
        number: selectedOrder.order_id.slice(0, 3),
        lang: lang,
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const isLate = (elapsedTime) => elapsedTime >= 1800;

  const displayOrders = orders.filter((order) => !order.done);

  return (
    <main className="bg-gray-800 min-h-screen p-8">
      {" "}
      <h1 className="text-3xl font-bold text-white mb-8">
        Kitchen Orders <KitchenOutput callOutInfo={callOutInfo} />{" "}
      </h1>{" "}
      <div className="grid grid-cols-3 gap-6">
        {" "}
        {displayOrders.map((order) => (
          <div
            key={order.id}
            className={`p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-300
            ${
              order.onHold
                ? "bg-slate-900"
                : isLate(order.elapsedTime)
                ? "animate-pulse bg-red-900"
                : "bg-gray-700"
            }
            ${urgentOrders.includes(order.id) ? "urgent-order" : ""}
            `}
            onClick={() => handleOrderClick(order)}
          >
            {" "}
            <h2 className="text-xl font-semibold text-white mb-2">
              Order #{order.order_id.slice(0, 3)} {" "}
              {urgentOrders.includes(order.id) && (
                <span className="ml-2 text-gray-100">
                  <span className="animate-ping">🔥</span> Urgent Order{" "}
                  <span className="animate-ping">🔥</span>{" "}
                </span>
              )}{" "}
              {order.onHold && <span className="mr-2">🚫Hold🚫</span>}{" "}
            </h2>{" "}
            <ul className="text-gray-300 mb-4">
              {" "}
              {order.order_items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.item_name}{" "}
                </li>
              ))}{" "}
            </ul>{" "}
            <p
              className={`text-sm ${
                isLate(order.elapsedTime) ? "text-red-300" : "text-gray-400"
              }`}
            >
              Elapsed Time: {formatTime(order.elapsedTime)}{" "}
            </p>
            {/* Urgent/Hold Buttons */}{" "}
            <div className="flex justify-end mt-2 space-x-2">
              {" "}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleUrgent(order.id);
                }}
                className={`px-2 py-1 text-xs rounded ${
                  urgentOrders.includes(order.id)
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-yellow-800 hover:bg-yellow-700"
                }`}
              >
                {urgentOrders.includes(order.id) ? "Unpush" : "Push"}
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleHold(order.id);
                }}
                className={`px-2 py-1 text-xs rounded ${
                  order.onHold
                    ? "bg-gray-400  hover:bg-gray-700"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {order.onHold ? "Unhold" : "Hold"}
              </button>
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {" "}
          <div
            ref={modalRef}
            className="bg-gray-700 p-6 rounded-lg max-w-md w-full"
          >
            {" "}
            <h2 className="text-2xl font-bold text-white mb-4">
              Order #{selectedOrder.order_id.slice(0, 3)}{" "}
            </h2>{" "}
            <ul className="text-gray-300 mb-6">
              {" "}
              {selectedOrder.order_items.map((item, index) => (
                <li key={index} className="mb-2">
                  {item.quantity}x {item.item_name}{" "}
                </li>
              ))}{" "}
            </ul>{" "}
            <div className="flex space-x-4">
              {" "}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                onClick={handleOrderDone}
              >
                Done{" "}
              </button>{" "}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => handleCallOut("en")}
              >
                Call-out (English)  {" "}
              </button>{" "}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => handleCallOut("zh")}
              >
                叫餐 (Cantonese){" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </main>
  );
};

export default Kitchen;
