"use client";

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useUserAuth } from "../_utils/auth-context";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FeedbackPage = () => {

  return (
    <div className="order-page"> This is Feedback page
    </div>
  );
};

export default FeedbackPage;
