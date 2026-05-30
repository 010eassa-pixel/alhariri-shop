"use client";
import { useEffect, useState } from 'react';
// التعديل الصح للمسار: 3 خطوات لورا
import { db } from '../../../firebase'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function CategoryClient({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // لسه بنستخدم الـ loading كحالة داخلية

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "products"), 
      where("category", "==", categoryId.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
      setLoading(false); // أول ما الداتا تيجي التحميل بيخلص
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className="category-page-container">
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', textTransform: 'uppercase', letterSpacing: '4px', color: '#2c2c2c' }}>
          {categoryId} Collection
        </h1>
      </header>

      {/* شرط التحميل السحري: طول ما الصفحة بتجيب البيانات بيظهر الثلاث نقط */}
      {loading ? (
        <div className="loader-container">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>لا توجد قطع متوفرة في هذا القسم حالياً.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '30px' 
        }} className="products-grid">
          {products.map((product) => (
            <a key={product.id} href={`/product?id=${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card" style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ width: '100%', height: '350px', backgroundColor: '#f5f5f5', overflow: 'hidden' }} className="card-image-box">
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  )}
                </div>

                <div style={{ padding: '15px', textAlign: 'center' }} className="card-info-box">
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', color: '#333' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b7e6a' }}>
                    {product.price} EGP
                  </p>
                  
                  <div style={{
                    marginTop: '15px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#000',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }} className="card-btn">
                    عرض التفاصيل
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* الـ CSS التجاوبي لضبط المقاسات تلقائياً في الموبايل من غير لمس أو تغيير التصميم في الكمبيوتر */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .category-page-container {
            padding: 10px !important;
          }
          .category-page-container h1 {
            font-size: 22px !important;
            margin-bottom: 25px !important;
            letter-spacing: 2px !important;
          }
          /* عرض كارتين متناسقين ومنظمين جنب بعض في الموبايل */
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          /* تظبيط نسبة الارتفاع لبوكس الصورة ليكون مثالي في الشاشات الصغيرة ولا يتمدد بشكل عملاق */
          .card-image-box {
            height: 240px !important;
          }
          /* تنسيق مريح للنصوص والزراير في مساحة الموبايل */
          .card-info-box {
            padding: 10px !important;
          }
          .card-info-box h3 {
            font-size: 14px !important;
            margin-bottom: 4px !important;
          }
          .card-info-box p {
            font-size: 15px !important;
          }
          .card-btn {
            margin-top: 10px !important;
            padding: 8px !important;
            font-size: 12px !important;
          }
        }
      `}</style>

    </div>
  );
}
