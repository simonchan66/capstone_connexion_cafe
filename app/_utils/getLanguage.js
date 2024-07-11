/*
 * Our group asked ChatGPT for language translation support.
 * (ChatGPT, private communication, July 2024).
 */
import { cookies } from "next/headers";
import supportedLanguages from "./supportedLanguages";

export default function getLanguage() {
  // Retrieving cookies from the request headers
  const nextCookies = cookies();
  // Attempting to get the value of the "language" cookie
  const cookieLanguage = nextCookies.get("language")?.value;

  // Checking if the cookieLanguage exists and is one of the supported languages
  if (
    cookieLanguage &&
    supportedLanguages.some((lang) => lang.code === cookieLanguage)
  ) {
    return cookieLanguage; // Returning the cookieLanguage if it is valid
  }

  return supportedLanguages[0].code; // Returning the default language code if the cookie is not set or is invalid
}
