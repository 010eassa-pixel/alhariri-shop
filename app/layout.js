import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        
        {/* زرار السلة الجديد - متثبت فوق على اليمين جنب كلمة WEARIVO بالظبط */}
        <a 
          href="/cart" 
          style={{
            position: 'fixed',
            top: '22px',       // نفس مستوى ارتفاع اللوجو فوق
            left: 'auto',      // إلغاء التثبيت على الشمال
            right: '150px',    // مسافة مناسبة عشان تظهر قبل كلمة WEARIVO بالظبط على اليمين
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            color: '#18181b',  // لون داكن فخم يليق بالبراند
            textDecoration: 'none',
            transition: 'opacity 0.2s'
          }}
          className="hover:opacity-70"
          aria-label="السلة"
        >
          {/* أيقونة السلة البسيطة والرايقة */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.8" 
            stroke="currentColor" 
            style={{ width: '24px', height: '24px' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </a>

        {children}
      </body>
    </html>
  );
}
