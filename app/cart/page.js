"use client";
import { useEffect, useState } from 'react';
import { db } from '../firebase'; // المسار متظبط بالنسبة لمجلد app/cart
import { collection, addDoc } from 'firebase/firestore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حقول بيانات العميل المقتبسة تماماً من فورم المنتج الخاص ببراند Wearivo
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [governorate, setGovernorate] = useState('محافظة الجيزة');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const shippingCost = 65; // مصاريف الشحن الثابتة المعتمدة للبراند

  // تحميل السلة من المتصفح عند فتح الصفحة
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('wearivo_cart')) || [];
    setCartItems(savedCart);
  }, []);

  // دالة تحديث كمية قطعة داخل السلة وحفظها
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) {
      // لو الكمية نزلت عن 1، بنحذف القطعة تلقائياً
      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
      localStorage.setItem('wearivo_cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cartItems];
      updatedCart[index].quantity = newQty;
      setCartItems(updatedCart);
      localStorage.setItem('wearivo_cart', JSON.stringify(updatedCart));
    }
    // تنبيه عداد الأيقونة العايمة ليتحدث فوراً
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // توليد رقم أوردر عشوائي فريد للبراند
  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // حساب المبالغ الإجمالية للسلة كاملة
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWithShipping = subtotal + (cartItems.length > 0 ? shippingCost : 0);

  // إرسال الأوردر المجمع لـ Firebase
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("حقيبة المشتريات فارغة حالياً!");
      return;
    }
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
        // سحب كل المنتجات اللي في السلة كمصفوفة مجمعة داخل الأوردر
        cartProducts: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          size: item.size,
          quantity: item.quantity
        })),
        financials: {
          subtotal: subtotal,
          shippingCost: shippingCost,
          totalPrice: totalWithShipping
        },
        status: "pending",
        createdAt: new Date()
      };

      // حفظ في الفايربيز
      await addDoc(collection(db, "orders"), orderData);
      
      // تفريغ السلة وتحديث المتصفح فوراً بعد النجاح الفوري
      localStorage.removeItem('wearivo_cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      setOrderSuccessId(orderNum);
    } catch (error) {
      console.error("Error sending bulk order:", error);
      alert("حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً.");
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '20px', 
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }} className="cart-page-container">
      
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '30px' }}>حقيبة المشتريات</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <span style={{ fontSize: '40px' }}>🛍️</span>
          <p style={{ fontSize: '18px', marginTop: '15px' }}>حقيبة المشتريات فارغة حالياً.</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 25px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>تصفح المنتجات</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }} className="cart-grid-layout">
          
          {/* النصف الأيمن: استمارة الشحن المتطابقة مع الهوية */}
          <form onSubmit={handlePlaceOrder} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }} className="cart-form-side">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 5px 0' }}>Wearivo - معلومات الشحن</h2>
            
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>معلومات الاتصال</h3>
              <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="رقم الجوال أو البريد الإلكتروني" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Delivery</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <select style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px' }}>
                  <option>مصر</option>
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="الاسم الأول" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="الاسم العائلي" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الحي، اسم الشارع، رقم العمارة" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
                <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="شقة، جناح، إلخ. (اختياري)" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '10px' }} className="form-city-row">
                  <input type="text" placeholder="Postal code" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
                  <select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setCity(e.target.value); }} style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px' }}>
                    <option value="محافظة القاهرة">محافظة القاهرة</option>
                    <option value="محافظة الجيزة">محافظة الجيزة</option>
                    <option value="محافظة الإسكندرية">محافظة الإسكندرية</option>
                    <option value="محافظة القليوبية">محافظة القليوبية</option>
                    <option value="محافظة الغربية">محافظة الغربية</option>
                  </select>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="المدينة" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="جوال" style={{ width: '100%', padding: '11px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', textAlign: 'right', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>طريقة الشحن</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid #2563eb', borderRadius: '6px', backgroundColor: '#f0f5ff', fontSize: '14px', fontWeight: 'bold' }}>
                <span>شحن موحد وثابت</span>
                <span>EGP {shippingCost.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>طريقة الدفع</h3>
              <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', backgroundColor: '#f0f5ff', color: '#0f172a', fontSize: '14px', alignItems: 'center', fontWeight: 'bold' }}>
                  <span>💵 الدفع عند الاستلام</span>
                  <input type="radio" defaultChecked />
                </label>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
              {isSubmitting ? "جاري تسجيل طلبك المجمع..." : "أنقر لإتمام الطلب"}
            </button>
          </form>

          {/* النصف الأيسر: عرض قطع السلة الحالية وفاتورتها */}
          <div style={{ padding: '30px', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }} className="cart-invoice-side">
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#2d3748' }}>ملخص المنتجات</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '350px', overflowY: 'auto', paddingLeft: '5px' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '65px', height: '85px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', flexShrink: 0 }}>
                    <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', margin: '0 0 4px 0' }}>{item.name}</h4>
                    <span style={{ fontSize: '12px', color: '#718096', display: 'block', marginBottom: '6px' }}>مقاس: {item.size}</span>
                    
                    {/* أزرار تعديل الكمية المرنة داخل كارت السلة */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff' }}>
                      <button type="button" onClick={() => updateQuantity(index, item.quantity + 1)} style={{ padding: '3px 8px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                      <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(index, item.quantity - 1)} style={{ padding: '3px 8px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    </div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d3748' }}>{(item.price * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4a5568' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>المبلغ الفرعي للمنتجات</span>
                <strong style={{ color: '#2d3748' }}>{subtotal.toFixed(2)} EGP</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>الشحن</span>
                <strong style={{ color: '#2d3748' }}>{shippingCost.toFixed(2)} EGP</strong>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '5px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                <span>الإجمالي</span>
                <span><span style={{ fontSize: '12px', color: '#718096', fontWeight: 'normal', marginLeft: '6px' }}>EGP</span>{totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* نافذة نجاح الطلب من الفايربيز للـ Wearivo */}
      {orderSuccessId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '440px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '50px' }}>🎉</span>
            <h2 style={{ color: '#10b981', marginTop: '10px', fontWeight: 'bold' }}>تم استلام طلبك بنجاح!</h2>
            <p style={{ color: '#475569', margin: '12px 0', fontSize: '15px' }}>رقم الأوردر العشوائي الموحد الخاص بك هو:</p>
            <div style={{ fontSize: '25px', fontWeight: '900', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '8px', letterSpacing: '2px', fontFamily: 'monospace' }}>{orderSuccessId}</div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '12px' }}>سيقوم فريق خدمة عملاء Wearivo بالتواصل معك هاتفياً لتأكيد الشحن فوراً.</p>
            <button onClick={() => setOrderSuccessId(null)} style={{ marginTop: '25px', backgroundColor: '#2563eb', color: '#fff', padding: '12px 35px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>إغلاق</button>
          </div>
        </div>
      )}

      {/* ميديا كويري لتوافق السلة مع الهواتف 100% */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .cart-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .cart-form-side {
            order: 2 !important;
            padding: 20px !important;
          }
          .cart-invoice-side {
            order: 1 !important;
            padding: 20px !important;
          }
          .form-city-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>

    </div>
  );
}
