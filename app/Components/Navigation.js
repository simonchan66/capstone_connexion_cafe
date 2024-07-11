"use client";
import Link from "next/link";
import { useLanguage } from "../_utils/LanguageContext";

const Navigation = () => {
  const { lang, setLang, t } = useLanguage();

  const handleLanguageChange = () => {
    const newLang = lang === "en" ? "zh" : "en";
    setLang(newLang);
    document.cookie = `language=${newLang}; path=/`;
  };

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">{t("home")}</Link>
        </li>
        <li>
          <Link href="/OrderPage">{t("order")}</Link>
        </li>
        <li>
          <Link href="/Editproduct">{t("editP")}</Link>
        </li>
        <li>
          <Link href="/KitchenPage">{t("kitchen")}</Link>
        </li>
        <li>
          <Link href="/AllStatsPage">{t("stats")}</Link>
        </li>
        <li>
          <Link href="/Feedback">{t("feedback")}</Link>
        </li>
        <li>
          <Link href="/FeedbackDash">{t("dashboard")}</Link>
        </li>

        <li>
          <button
            onClick={handleLanguageChange}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {lang === "en" ? "中文" : "English"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
