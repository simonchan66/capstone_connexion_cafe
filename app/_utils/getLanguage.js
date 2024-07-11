/*
 * Our group asked ChatGPT for language translation support.
 * (ChatGPT, private communication, July 2024).
 */
import { cookies } from "next/headers";
import languages from "./languages";

export default function getLanguage() {
  const nextCookies = cookies();
  // Get the language code from the cookie
  const cookieLanguage = nextCookies.get("language")?.value;

  // Check if the cookie language is valid
  if (
    cookieLanguage &&
    languages.some((lang) => lang.code === cookieLanguage)
  ) {
    return cookieLanguage;
  }

  return languages[0].code; // Return the default language code
}
