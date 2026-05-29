import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        
        {/* اللوجو الثابت في كل الصفحات - بنفس حجمه وشكله وبيرجع للرئيسية */}
        <a 
          href="/" 
          style={{
            position: 'fixed',
            top: '20px',
            right: '25px', /* مكانه الثابت فوق على اليمين */
            zIndex: 1000,
            fontSize: '32px', 
            fontWeight: 'bold',
            fontFamily: 'serif', 
            color: '#3f2e1e', 
            textDecoration: 'none',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
          className="hover:opacity-80 transition-opacity"
        >
          WEARIVO
        </a>
        
        {/* ستايل ذكي يفصل الموبايل عن الكمبيوتر تماماً ويمسح التداخل */}
        <style dangerouslySetInnerHTML={{__html: `
          /* ستايل الموبايل (الشاشات الصغيرة) */
          .floating-cart-wrapper {
            position: absolute !important;
            top: 20px;
            left: 75px; /* حركناها يمين شوية عشان تسيب زرار الداشبورد براحته على الشمال ومتاكلش الكلام */
            z-index: 999;
          }
          
          /* لو لسه قريبة من الداشبورد على الموبايل، الحل السحري ننزلها تحت على الشمال */
          @media (max-width: 767px) {
            .floating-cart-wrapper {
              position: fixed !important; /* تثبيت مريح أسفل الشاشة للموبايل */
              top: auto !important;
              bottom: 25px !important;
              left: 25px !important;
              background: #18181b; /* خلفية داكنة فخمة عشان تظهر واضحة */
              color: #ffffff !important;
              padding: 10px;
              border-radius: 50%; /* شكل دائرى مودرن */
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .floating-cart-wrapper a {
              color: #ffffff !important;
            }
            .floating-cart-wrapper span {
              display: none; /* إخفاء الكلمة على الموبايل عشان المساحة ونكتفي بالعربية */
            }
          }
          
          /* ستايل الكمبيوتر (الشاشات الكبيرة) - هيفضل زي ما هو بالظبط */
          @media (min-width: 768px) {
            .floating-cart-wrapper {
              position: fixed !important;
              top: 20px !important;
              right: 280px !important; /* متظبطة عشان تنزل جنب كلمة WEARIVO بالظبط */
              left: auto !important;
              bottom: auto !important;
              background: transparent !important;
            }
            .floating-cart-wrapper a {
              color: #18181b !important;
            }
            .floating-cart-wrapper span {
              display: block !important;
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

            {/* النص تحت الأيقونة (يظهر في الكمبيوتر فقط) */}
            <span>
              <p style={{ fontSize: '10px', fontWeight: '500', margin: 0, whiteSpace: 'nowrap' }}>
                سلة المشتريات
              </p>
            </span>
          </a>
        </div>

        {children}
      </body>
    </html>
  );
}
