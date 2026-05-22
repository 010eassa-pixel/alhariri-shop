"use client";
import { useEffect, useState } from 'react';
import { db } from '../../firebase'; // مسار الفايربيز المظبوط في مشروعك
import { collection, addDoc } from 'firebase/firestore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حقول بيانات العميل طبقاً لتصميم البراند الخاص بك بالملي
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [governorate, setGovernorate] = useState('محافظة الجيزة');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const shippingCost = 65; // مصاريف الشحن الثابتة من الفاتورة بتاعتك

  // تحميل المنتجات من الـ LocalStorage الخاص بـ Wearivo
  useEffect(() => {
    const savedCart = localStorage.getItem('wearivo_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // دالة حذف منتج من السلة
  const removeFromCart = (indexToDelete) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToDelete);
    setCartItems(updatedCart);
    localStorage.setItem('wearivo_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated')); // تنبيه للـ Navbar
  };

  // حساب المبلغ الفرعي لكل المنتجات في السلة
  const subTotalPrice = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  // الإجمالي النهائي مع الشحن
  const finalTotalPrice = subTotalPrice + shippingCost;

  // دالة توليد رقم أوردر عشوائي فريد مكون من 6 أرقام
  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // دالة معالجة وإرسال طلب السلة بالكامل إلى الفايربيز للداشبورد
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!phone || !firstName || !address) {
      alert("برجاء ملء الحقول الأساسية (الاسم الأول، الجوال، العنوان) لتأكيد طلبك!");
      return;
    }

    setIsSubmitting(true);
    const orderNum = `WR-${generateOrderNumber()}`;

    try {
      const orderData = {
        orderNumber: orderNum,
        customer: {
          emailOrPhone,
          firstName,
          lastName,
          address,
          apartment,
          governorate,
          city,
          phone,
          paymentMethod: "الدفع عند الاستلام"
        },
        // هنا تعديل ذكي: بيبعت لستة المنتجات كاملة اللي في السلة للداشبورد
        productsList: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          size: item.size,
          quantity: item.quantity
        })),
        financials: {
          subTotal: subTotalPrice,
          shippingCost: shippingCost,
          totalPrice: finalTotalPrice
        },
        status: "pending", // معلق بانتظار المراجعة من الداشبورد عندك
        createdAt: new Date()
      };

      // حفظ الأوردر بالكامل داخل كولكشن orders ليظهر في الداشبورد
      await addDoc(collection(db, "orders"), orderData);
      
      // تفريغ السلة بعد نجاح العملية
      localStorage.removeItem('wearivo_cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cart-updated'));
      
      setOrderSuccessId(orderNum);
    } catch (error) {
      console.error("Error sending order to Firebase:", error);
      alert("حدث خطأ غير متوقع أثناء معالجة الطلب، يرجى المحاولة لاحقاً.");
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', direction: 'rtl', textAlign: 'center', color: '#64748b', fontSize: '16px' }}>
        جاري تحميل السلة...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '20px', 
      display: 'grid', 
      gridTemplateColumns: '1.2fr 1fr', 
      gap: '40px', 
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }} className="product-details-page">
      
      {/* النصف الأيمن: الفورم الكامل بتاعنا الأصلي بدون تشتيت */}
      {cartItems.length > 0 ? (
        <form onSubmit={handlePlaceOrder} style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: '#fff' }} className="modal-form-side">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 5px 0' }}>Wearivo - معلومات الشحن</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>برجاء إدخال بياناتك بدقة لضمان وصول الأوردر سريعاً.</p>
          </div>

          {/* معلومات الاتصال */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>معلومات الاتصال</h3>
            <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="رقم الجوال أو البريد الإلكتروني" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555', marginTop: '6px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> سجل لتصلك عروضنا الحصرية والجديدة
            </label>
          </div>

          {/* مجسم الـ Delivery */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>التوصيل (Delivery)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px' }}>
                <option>مصر</option>
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="الاسم الأول" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="الاسم العائلي" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الحي، اسم الشارع، رقم العمارة" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="شقة، جناح، إلخ. (اختياري)" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '10px' }} className="modal-city-row">
                <input type="text" placeholder="Postal code" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
                <select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setCity(e.target.value); }} style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px' }}>
                  <option value="محافظة القاهرة">محافظة القاهرة</option>
                  <option value="محافظة الجيزة">محافظة الجيزة</option>
                  <option value="محافظة الإسكندرية">محافظة الإسكندرية</option>
                  <option value="محافظة القليوبية">محافظة القليوبية</option>
                  <option value="محافظة الغربية">محافظة الغربية</option>
                </select>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="المدينة" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
              </div>

              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="جوال" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', textAlign: 'right' }} />
            </div>
          </div>

          {/* طريقة الشحن */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>طريقة الشحن</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#f0f5ff', fontSize: '14px', fontWeight: 'bold' }}>
              <span>شحن سريع للمحافظة</span>
              <span>EGP {shippingCost.toFixed(2)}</span>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>طريقة الدفع</h3>
            <p style={{ fontSize: '11px', color: '#667085', margin: '0 0 8px 0' }}>جميع المعاملات آمنة ومشفرة.</p>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', borderBottom: '1px solid #cbd5e1', backgroundColor: '#fafafa', color: '#98a2b3', fontSize: '14px', alignItems: 'center' }}>
                <span>💳 بطاقة الائتمان / Sympl / valU</span>
                <input type="radio" disabled />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', backgroundColor: '#f0f5ff', color: '#0f172a', fontSize: '14px', alignItems: 'center', fontWeight: 'bold' }}>
                <span>💵 الدفع عند الاستلام</span>
                <input type="radio" defaultChecked />
              </label>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
            {isSubmitting ? "جاري معالجة أوردر السلة..." : "أنقر لإتمام وتأكيد الطلب الآن"}
          </button>
        </form>
      ) : (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
          <span style={{ fontSize: '50px' }}>🛒</span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155', marginTop: '15px' }}>سلة المشتريات فارغة حالياً!</h2>
          <p style={{ color: '#64748b', marginTop: '8px' }}>تصفح المتجر وأضف منتجات لتتمكن من إتمام طلبك.</p>
        </div>
      )}

      {/* النصف الأيسر: ملخص الفاتورة الرمادي المستوحى من تصميمك، يضم كل منتجات السلة */}
      {cartItems.length > 0 && (
        <div style={{ padding: '30px', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content', position: 'sticky', top: '20px' }} className="modal-invoice-side">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 5px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>ملخص الفاتورة</h3>
          
          {/* لستة المنتجات ديناميكية جوه الفاتورة */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '350px', overflowY: 'auto', paddingLeft: '5px' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                <div style={{ position: 'relative', width: '65px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', flexShrink: 0 }}>
                  <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '-5px', left: '-5px', width: '20px', height: '20px', backgroundColor: '#718096', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>{item.quantity}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', margin: '0 0 4px 0' }}>{item.name}</h4>
                  <span style={{ fontSize: '12px', color: '#718096' }}>مقاس: {item.size}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d3748' }}>{(Number(item.price) * item.quantity).toFixed(2)} EGP</span>
                  <button type="button" onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>حذف</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4a5568', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>المبلغ الفرعي</span>
              <strong style={{ color: '#2d3748' }}>{subTotalPrice.toFixed(2)} EGP</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>الشحن</span>
              <strong style={{ color: '#2d3748' }}>{shippingCost.toFixed(2)} EGP</strong>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '5px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
              <span>الإجمالي</span>
              <span><span style={{ fontSize: '12px', color: '#718096', fontWeight: 'normal', marginLeft: '6px' }}>EGP</span>{finalTotalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* نافذة نجاح الطلب بالملي طبقاً لتصميمك */}
      {orderSuccessId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '440px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '50px' }}>🎉</span>
            <h2 style={{ color: '#10b981', marginTop: '10px', fontWeight: 'bold', fontSize: '22px' }}>تم استلام طلب السلة بنجاح!</h2>
            <p style={{ color: '#475569', margin: '12px 0', fontSize: '15px' }}>رقم الأوردر العشوائي الخاص بك هو:</p>
            <div style={{ fontSize: '25px', fontWeight: '900', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', letterSpacing: '2px', fontFamily: 'monospace' }}>{orderSuccessId}</div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '12px' }}>سيقوم فريق خدمة عملاء Wearivo بالتواصل معك هاتفياً لتأكيد الشحن فوراً.</p>
            <button onClick={() => setOrderSuccessId(null)} style={{ marginTop: '25px', backgroundColor: '#2563eb', color: '#fff', padding: '12px 35px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>إغلاق</button>
          </div>
        </div>
      )}

      {/* حقن التجاوبية (CSS Media Queries) للموبايل بدون المساس بالكمبيوتر */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .product-details-page {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
            padding: 15px !important;
            margin: 10px auto !important;
          }
          .modal-form-side {
            order: 2 !important; /* الفاتورة تظهر فوق والفورم تحتها في الموبايل لراحة العميل */
            padding: 5px !important;
          }
          .modal-invoice-side {
            order: 1 !important;
            position: relative !important;
            top: 0 !important;
            padding: 20px !important;
          }
          .modal-city-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>

    </div>
  );
}
