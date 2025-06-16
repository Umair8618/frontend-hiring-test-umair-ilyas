import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ApolloWrapper from "@/components/clientComponents/ApolloWrapper";

// Avenir Fonts
const avenirBlack = localFont({
  src: "./fonts/AvenirLTStd-Black.otf",
  variable: "--font-avenir-black",
  weight: "900",
});

const avenirBook = localFont({
  src: "./fonts/AvenirLTStd-Book.otf",
  variable: "--font-avenir-book",
  weight: "400",
});
const avenirRoman = localFont({
  src: "./fonts/AvenirLTStd-Roman.otf",
  variable: "--font-avenir-roman",
  weight: "500",
});

export const metadata: Metadata = {
   title: "Turing Tech",
  description: "Turing Tech hiring test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${avenirBlack.variable} ${avenirBook.variable} ${avenirRoman.variable} antialiased`}
      >
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
