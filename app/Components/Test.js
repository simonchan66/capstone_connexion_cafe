"use client";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useLanguage } from "../_utils/LanguageContext";

const Test = () => {
  const { t } = useLanguage();

  return (
    <div className="a">
      <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center top-0 z-10">
        <h1 className="text-3xl font-semibold">
          {t("translateFunctionDemonstration")}
        </h1>
      </header>
      <p></p>
      <div className="flex items-center space-x-4 text-3xl py-4">
        No English Translation:
        <p className="text-yellow-200"> {t("chineseOnly")}</p>
      </div>
      <div className="flex items-center space-x-4 text-3xl py-4">
        No Chinese Translation:
        <p className="text-yellow-200"> {t("englishOnly")}</p>
      </div>
      <div className="flex items-center space-x-4 text-3xl py-4">
        No Translation Available: <p className="text-yellow-200"> {t("no")}</p>
      </div>
    </div>
  );
};

export default Test;
