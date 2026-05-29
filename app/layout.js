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
            zIndex: 1000,
            fontWeight: 'bold',
            fontFamily: 'serif', 
            color: '#3f2e1e', 
            textDecoration: 'none',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
          className="responsive-logo hover:opacity-80 transition-opacity"
        >
          WEARIVO
        </a>
        
        {/* ستايل ذكي يفصل الموبايل عن الكمبيوتر تماماً ويمسح التداخل */}
        <style dangerouslySetInnerHTML={{__html: `
          /* === ستايل الموبايل (الشاشات الصغيرة) === */
          .responsive-logo {
            right: 25px !important;
            font-size: 20px !important; /* رجع للحجم القديم والناعم على التليفون */
          }

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
          
          /* === ستايل الكمبيوتر (الشاشات الكبيرة) === */
          @media (min-width: 768px) {
            .responsive-logo {
              right: 40px !important; /* ترحيل بسيط ومريح على الشاشات الكبيرة */
              font-size: 32px !important; /* يفضل بالحجم الكبير والفخم على الكمبيوتر */
            }

            .floating-cart-wrapper {
              position: fixed !important;
              top: 20px !important;
              right: 320px !important; /* ترحيل السلة للشمال شوية عشان تبعد تماماً عن الكلمة الكبيرة */
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
              xmlns="http://www.
