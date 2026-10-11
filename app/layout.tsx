import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "GrandCare EHR & Ops Suite | Hệ Thống Quản Lý Bệnh Viện",
  description: "Hệ thống quản lý bệnh viện cao cấp chuẩn HL7 FHIR R4. Quản lý bệnh nhân, hồ sơ EHR, kho dược, bác sĩ và cấp cứu 115.",
  keywords: "EHR, bệnh viện, HL7, FHIR, quản lý bệnh nhân, hệ thống y tế",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} bg-surface text-on-surface antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 pl-72">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
