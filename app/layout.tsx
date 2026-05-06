import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Haifa Live — Vocalist · Songwriter · Stage",
  description:
    "Haifa Jordan — London soul, global stages. New release The Mood on Quantize Recordings. Bookings and live experience.",
  openGraph: {
    title: "Haifa Live",
    description: "When the lights drop, the voice takes over.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="font-body min-h-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
