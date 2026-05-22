import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر
import FloatingCart from "./FloatingCart"; // استيراد زرار السلة العائم الجديد

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* زرار السلة هيشتغل هنا في كل الصفحات بشكل آمن ومن غير ما يعطل الـ metadata */}
        <FloatingCart />
        
        {children}
      </body>
    </html>
  );
}
