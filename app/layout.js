"use client";

import { usePathname } from "next/navigation"; // عشان نقرأ مسار الصفحة الحالية
import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // فحص لو الصفحة تبع الأدمن عشان نخفي الزرار منها
  const isAdminPage = pathname && pathname.startsWith("/admin");

  return (
    <html lang="ar" dir="rtl">
      <body>
        
        {/* زرار السلة الصغير العائم - يظهر في كل الصفحات ما عدا الأدمن */}
        {!isAdminPage && (
          <a 
            href="/cart" 
            className="fixed top-4 left-4 z-50 flex items-center justify-center bg-stone-900/10 backdrop-blur-md hover:bg-stone-950/20 active:scale-95 transition-all duration-200 p-2.5 rounded-xl border border-stone-950/10 shadow-sm"
            aria-label="السلة"
          >
            {/* أيقونة السلة البسيطة الرايقة المناسبة للموبايل */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-5 h-5 text-stone-900"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </a>
        )}

        {children}
      </body>
    </html>
  );
}
