import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "קוגנט — קורס הבלוקצ'יין המקיף",
  description: "הקורס הפרקטי שיקח אותך מאפס להבנה עמוקה של הטכנולוגיה שמשנה את העולם הפיננסי",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900">{children}</body>
    </html>
  );
}
