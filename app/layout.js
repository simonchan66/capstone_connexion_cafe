import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./_utils/auth-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Connexion Cafe POS",
  description: "Made by Later gator group 2024",
};

export default async function RootLayout({ children }) {
  return (
    <AuthContextProvider>
    <html>

      <body className={inter.className}>{children}</body>


    </html>
    
    
    
    </AuthContextProvider>
  );
}