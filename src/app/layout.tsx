import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";

// Adicionando a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Flowtech",
  description: "Soluções contábeis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          > */}
        <body
          className={`${inter.variable} antialiased`}
        >
          {children}
        </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
