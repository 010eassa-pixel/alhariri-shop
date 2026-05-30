import "./globals.css"; 

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" style={{ backgroundColor: '#f5ebe0' }}>
      <body style={{ backgroundColor: '#f5ebe0' }}>
        
        {/* اللوجو الثابت علوياً */}
        <a 
          href="/" 
          style={{
            position: 'absolute', 
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
        
        {/* الستايل الذكي الموحد - يشمل اللوجو، السلة، الكروت، وحركة الـ Loading */}
        <style dangerouslySetInnerHTML={{__html: `
          html, body {
            background-color: #f5ebe0 !important;
          }

          body {
            padding-top: 95px !important; 
          }

          .responsive-logo {
            right: 25px !important;
            font-size: 20px !important;
          }

          .floating-cart-wrapper {
            position: absolute !important;
            top: 20px;
            left: 75px;
            z-index: 999;
          }

          /* ستايل كروت المنتجات التلقائي والاحترافي */
          .product-grid {
            display: grid;
            gap: 20px;
            padding: 20px;
          }

          .product-card {
            background: #ffffff;
            border-radius: 0px; 
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @media (min-width: 768px) {
            .product-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 12px 24px rgba(63, 46, 30, 0.08);
            }
          }

          .product-card img {
            width: 100%;
            height: auto;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
          }

          .product-card:hover img {
            transform: scale(1.02);
          }

          .product-title {
            font-size: 15px;
            font-weight: 600;
            color: #18181b;
            margin: 14px 10px 6px 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .product-price {
            font-size: 14px;
            font-weight: 500;
            color: #71717a;
            margin: 0 10px 14px 10px;
          }

          .product-btn {
            background: #18181b;
            color: #ffffff !important;
            padding: 10px 24px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 0px;
            text-decoration: none;
            transition: background 0.2s, opacity 0.2s;
            margin-top: auto;
            width: calc(100% - 30px);
            text-transform: uppercase;
          }

          .product-btn:hover {
            background: #27272a;
          }

          /* ستايل حركة الثلاث نقط للتحميل */
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            width: 100%;
          }

          .loading-dots {
            display: flex;
            gap: 6px;
          }

          .loading-dots div {
            width: 10px;
            height: 10px;
            background-color: #3f2e1e; 
            border-radius: 50%;
            animation: bounce 0.6s infinite alternate;
          }

          .loading-dots div:nth-child(2) {
            animation-delay: 0.2s;
          }

          .loading-dots div:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes bounce {
            from {
              transform: translateY(0);
              opacity: 0.4;
            }
            to {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
          
          @media (max-width: 767px) {
            body {
              padding-top: 85px !important; 
            }

            .product-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px;
              padding: 12px;
            }

            .product-title {
              font-size: 13px;
              margin: 10px 5px 4px 5px;
            }

            .product-price {
              font-size: 12px;
              margin: 0 5px 10px 5px;
            }

            .product-btn {
              padding: 8px 12px;
              font-size: 11px;
              width: calc(100% - 16px);
            }

            .floating-cart-wrapper {
              position: fixed !important; 
              top: auto !important;
              bottom: 25px !important;
              left: 25px !important;
              background: #18181b; 
              color: #ffffff !important;
              padding: 10px;
              border-radius: 50%; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .floating-cart-wrapper a {
              color: #ffffff !important;
            }
            .floating-cart-wrapper span {
              display: none; 
            }
          }
          
          @media (min-width: 768px) {
            .product-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 24px;
              padding: 40px;
            }

            .responsive-logo {
              right: 40px !important;
              font-size: 32px !important;
            }

            .floating-cart-wrapper {
              position: fixed !important;
              top: 20px !important;
              right: 320px !important; 
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
