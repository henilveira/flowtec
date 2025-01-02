import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";

// Adicionando a fonte Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Formulário de abertura - flowtec",
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
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
