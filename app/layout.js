import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notefy",
  description: "Flashcard Generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLIC_KEY}>
      <html lang="en" className={inter.className}>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
    
  );
}
