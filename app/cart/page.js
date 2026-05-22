'use client';
import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // مسار ملف الفايربيز بتاعك في المشروع
import { collection, addDoc } from 'firebase/firestore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('سلتك فارغة!');
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return alert('الرجاء ملء جميع البيانات لشحن الطلب');
    }

    setLoading(true);

    try {
      const orderData = {
        customer: customerInfo,
        items: cartItems,
        total: totalPrice,
        status: 'قيد الانتظار', // عشان تظهر في الداشبورد كطلب جديد
        createdAt: new Date().toISOString()
      };

      // هيرفع الأوردر في كولكشن اسمه orders عشان يظهر في لوحة التحكم علطول
      await addDoc(collection(db, 'orders'), orderData);

      // تفريغ السلة بعد نجاح الطلب
      localStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cart-updated'));
      setOrdered(true);
    } catch (error) {
      console.error("Error adding order: ", error);
      alert('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="text-center p-12" dir="rtl">
        <h2 className="text-2xl font-bold text-green-600 mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-600">سيتواصل معك فريق العمل قريباً لتأكيد الشحن.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
      {/* عرض المنتجات في السلة */}
      <div>
        <h1 className="text-2xl font-bold mb-4">سلة المشتريات</h1>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">السلة فارغة حالياً.</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">السعر: {item.price} ج.م | الكمية: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-medium">حذف</button>
              </div>
            ))}
            <div className="text-left font-bold text-lg pt-2">الإجمالي: {totalPrice} ج.م</div>
          </div>
        )}
      </div>

      {/* فورم بيانات العميل للداشبورد */}
      {cartItems.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">بيانات الشحن والتوصيل</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم بالكامل</label>
              <input type="text" required className="w-full p-2 border rounded" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <input type="tel" required className="w-full p-2 border rounded" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">العنوان بالتفصيل</label>
              <textarea required rows="3" className="w-full p-2 border rounded" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-black text-white p-3 rounded font-bold hover:bg-gray-800 transition">
              {loading ? 'جاري إرسال الطلب...' : 'تأكيد وشحن الطلب الآن'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
