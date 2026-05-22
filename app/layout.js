import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        
        {/* ستايل مخصص لحل مشكلة الموبايل والكمبيوتر معاً */}
        <style dangerouslySetInnerHTML={{__html: `
          /* ستايل الموبايل والشاشات الصغيرة */
          .floating-cart-wrapper {
            position: absolute !important; /* عشان تثبت في أول الصفحة ومتحركش مع السكرول */
            top: 15px;
            left: 20px; /* بعيد تماماً عن اللوجو والداشبورد على الموبايل */
            z-index: 999;
          }
          
          /* ستايل الكمبيوتر والشاشات الكبيرة (أكبر من 768 بكسل) */
          @media (min-width: 768px) {
            .floating-cart-wrapper {
              position: fixed !important; /* يرجع ثابت زي ما تحب في الكمبيوتر */
              top: 20px !important;
              right: 280px !important; /* مكانك المفضل اللي اخترته للكمبيوتر */
              left: auto !important;
            }
          }
        `}} />

        {/* زرار السلة */}
        <div className="floating-cart-wrapper">
          <a 
            href="/cart" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              color: '#18181b',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}
            className="hover:opacity-70"
            aria-label="سلة المشتريات"
          >
            {/* أيقونة عربية التسوق */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.8" 
              stroke="currentColor" 
              style={{ width: '24px', height: '24px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>

            {/* النص تحت الأيقونة */}
            <span style={{ fontSize: '10px', fontWeight: '500', whiteSpace: 'nowrap' }}>
              سلة المشتريات
            </span>
          </a>
        </div>

        {children}
      </body>
    </html>
  );
}
