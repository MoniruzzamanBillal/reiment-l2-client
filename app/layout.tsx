import { AuthBootstrap } from "@/components/providers/AuthBootstrap";
import QueryClientWrapper from "@/providers/QueryClientWrapper";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reiment - Your Ultimate Shopping Destination",
  description: "Quality products from various vendors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <AuthBootstrap />
            {children}
          </ThemeProvider>
        </QueryClientWrapper>

        <Toaster closeButton position="top-right" />
      </body>
    </html>
  );
}
