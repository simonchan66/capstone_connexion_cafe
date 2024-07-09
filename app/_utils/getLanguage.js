// app/libs/getLanguage.js
import { cookies } from "next/headers";
import languages from "./languages";

export default function getLanguage() {
  const nextCookies = cookies();
  const cookieLanguage = nextCookies.get("language")?.value;

  if (
    cookieLanguage &&
    languages.some((lang) => lang.code === cookieLanguage)
  ) {
    return cookieLanguage;
  }

  return languages[0].code; // Return the default language code
}
