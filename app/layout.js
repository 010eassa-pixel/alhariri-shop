import "./globals.css"; // السطر ده هو اللي هيخلي الألوان تظهر

export const metadata = {
  title: 'Wearivo',
  description: 'متجر ملابس ويريفو - بساطة وأناقة',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        
        {/* كلمة السلة هتظهر فوق على الشمال بخط بسيط جداً وبتودي لصفحة السلة */}
        <a 
          href="/cart" 
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 999,
            color: '#18181b', // لون داكن يليق بالخلفية البيج
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none',
            background: 'rgba(0,0,0,0.05)',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          السلة
        </a>

        {children}
      </body>
    </html>
  );
}
