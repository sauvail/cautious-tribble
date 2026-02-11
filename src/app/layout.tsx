import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StrongCoach - Workout & Training Management",
  description: "Connect with coaches and athletes to create, track, and share workout programs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
