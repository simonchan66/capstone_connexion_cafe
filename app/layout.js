import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";
import { LanguageProvider } from "./_utils/LanguageContext";
import Language from "./_utils/Language";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Connexion Cafe POS",
  description: "Made by Later gator group 2024",
};

export default async function RootLayout({ children }) {
  const lang = await Language();
  return (
    <AuthContextProvider>
      <html lang={lang}>
        <LanguageProvider lang={lang}>
          <body className={inter.className}>{children}</body>
        </LanguageProvider>
      </html>
    </AuthContextProvider>
  );
}
