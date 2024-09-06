"use client";

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import { useLanguage } from "../_utils/LanguageContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportPage = () => {
  const { user } = useUserAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    products: {},
    totalCash: 0,
    totalVoucher: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const fetchOrders = async (date) => {
    const db = getFirestore();
    const ordersRef = collection(db, "transactions");

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const querySnapshot = await getDocs(
        query(
          ordersRef,
          where("transaction_time", ">=", startOfDay.toISOString()),
          where("transaction_time", "<=", endOfDay.toISOString())
        )
      );

      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(ordersData);
      calculateSummary(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateSummary = (orders) => {
    const summary = {
      products: {},
      totalCash: 0,
      totalVoucher: 0,
      totalAmount: 0,
    };

    orders.forEach((order) => {
      order.order_items.forEach((item) => {
        if (summary.products[item.item_name]) {
          summary.products[item.item_name] += item.quantity;
        } else {
          summary.products[item.item_name] = item.quantity;
        }
      });

      summary.totalCash += order.cash_amount || 0;
      summary.totalVoucher += order.voucher_amount || 0;
      summary.totalAmount += order.total_amount || 0;
    });

    setSummary(summary);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTodayTransactions = () => {
    setSelectedDate(new Date());
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Report for ${selectedDate.toLocaleDateString()}`, 14, 22);

    // Add product table
    const productData = Object.entries(summary.products).map(([product, quantity]) => [product, quantity]);
    doc.autoTable({
      startY: 30,
      head: [['Product', 'Quantity']],
      body: productData,
    });

    // Add summary
    const summaryY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Summary", 14, summaryY);
    doc.setFontSize(12);
    doc.text(`Total Cash: $${summary.totalCash.toFixed(2)}`, 14, summaryY + 10);
    doc.text(`Total Voucher: $${summary.totalVoucher.toFixed(2)}`, 14, summaryY + 20);
    doc.text(`Total Amount: $${summary.totalAmount.toFixed(2)}`, 14, summaryY + 30);

    // Save the PDF
    doc.save(`report_${selectedDate.toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading) {
    return <div className="text-white text-xl">{t("loading")}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="bg-gray-800 py-4 px-6">
        <h1 className="text-2xl font-semibold">{t("stats")}</h1>
      </header>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
          <button
            onClick={handleTodayTransactions}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            {t("today")}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {t("reportFor")} {selectedDate.toLocaleDateString()}
            </h2>
            <button
              onClick={generatePDF}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
            >
              {t("generatePDF")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left">{t("product")}</th>
                  <th className="px-4 py-2 text-left">{t("quantity")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.products).map(([product, quantity]) => (
                  <tr key={product} className="border-b border-gray-700">
                    <td className="px-4 py-2">{product}</td>
                    <td className="px-4 py-2">{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t("totalCash")}</h3>
              <p>${summary.totalCash.toFixed(2)}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t("totalVoucher")}</h3>
              <p>${summary.totalVoucher.toFixed(2)}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{t("totalAmount")}</h3>
              <p>${summary.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;