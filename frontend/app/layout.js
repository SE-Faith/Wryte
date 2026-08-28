import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const OutfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const OutfitMono = Outfit({
  variable: "--font-outfit-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Wryte",
  description: "A modern blog app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${OutfitSans.variable} ${OutfitMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

