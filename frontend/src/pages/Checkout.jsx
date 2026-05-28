import { useState } from 'react';
import axios from 'axios';
import { Search, Receipt } from 'lucide-react';

export default function Checkout() {
  const [orderId, setOrderId] = useState('');
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');

  const searchOrder = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setError('');
    setBill(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      if (res.data.length === 0) {
        setError('Order not found');
        return;
      }
      
      const orderData = res.data;
      const totalAmount = orderData.reduce((sum, item) => sum + item.subtotal, 0);
      
      setBill({
        orderId: orderData[0].id,
        tableNumber: orderData[0].table_number,
        status: orderData[0].status,
        items: orderData,
        total: totalAmount
      });
    } catch (error) {
      setError('Failed to fetch order details');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="text-center">
        <p className="text-sm tracking-[0.2em] text-gold uppercase mb-2 font-royal">Billing</p>
        <h2 className="text-4xl font-royal text-forest-dark">Checkout & Receipt</h2>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-cream-dark">
        <form onSubmit={searchOrder} className="flex gap-4 mb-10">
          <input 
            type="number" 
            min="1"
            placeholder="Enter Order ID" 
            value={orderId}
            onChange={(e) => setOrderId(Math.max(1, parseInt(e.target.value) || '').toString())}
            className="flex-1 bg-cream/50 border border-forest/10 rounded-2xl px-6 py-4 outline-none focus:border-gold focus:bg-cream transition-all text-forest-dark font-medium placeholder:text-forest-light/50 font-sans"
          />
          <button 
            type="submit"
            className="bg-forest hover:bg-forest-dark text-cream px-8 py-4 rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 transition-colors shadow-lg shadow-forest/20 font-royal"
          >
            <Search size={18} strokeWidth={2} /> Find
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-center font-medium mb-8 font-sans">
            {error}
          </div>
        )}

        {bill && (
          <div className="bg-cream p-10 rounded-2xl shadow-inner border border-forest/10 font-sans relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
               <Receipt size={250} />
            </div>

            <div className="text-center mb-10 border-b border-dashed border-forest/20 pb-10 relative z-10">
              <h3 className="text-3xl font-royal font-bold tracking-widest text-forest-dark uppercase mb-2">Regal Crest</h3>
              <p className="text-forest-light text-xs tracking-[0.2em] uppercase mb-6 font-royal">Premium Dining</p>
              
              <div className="inline-block bg-white px-6 py-2 rounded-full border border-forest/10">
                <p className="text-forest-dark font-semibold text-sm font-sans">Receipt #{bill.orderId} • Table {bill.tableNumber}</p>
              </div>
            </div>

            <div className="space-y-4 mb-10 relative z-10 font-sans">
              {bill.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm font-medium text-forest-dark border-b border-forest/5 pb-3 last:border-0">
                  <div>
                    <span className="text-gold mr-3">{item.quantity}x</span> <span>{item.name}</span>
                  </div>
                  <div className="font-royal">₹{item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-forest/20 pt-8 relative z-10 space-y-3">
              <div className="flex justify-between text-sm font-medium text-forest-light">
                <span>Subtotal</span>
                <span>₹{(bill.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-forest-light">
                <span>GST (5%)</span>
                <span>₹{((bill.total || 0) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-royal text-forest-dark font-bold pt-4 border-t border-forest/10">
                <span>Total Amount</span>
                <span className="text-gold">₹{((bill.total || 0) * 1.05).toFixed(2)}</span>
              </div>
              <div className="text-center mt-12 text-sm text-forest-light font-medium font-sans">
                <p className="uppercase tracking-wider text-xs mb-2">Status: {bill.status}</p>
                <p className="font-royal italic text-lg">Thank you for dining with us.</p>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="mt-10 w-full bg-forest-dark hover:bg-black text-cream py-4 rounded-xl font-bold tracking-widest uppercase text-xs transition-colors relative z-10 shadow-lg font-royal"
            >
              Print Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
