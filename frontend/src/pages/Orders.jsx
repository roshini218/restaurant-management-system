import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling for real-time feel
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  };

  const completeOrder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/complete`);
      fetchOrders();
    } catch (error) {
      alert('Failed to complete order');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-forest/10 pb-6">
        <div>
          <p className="text-sm tracking-[0.2em] text-gold uppercase mb-2 font-royal">Live Status</p>
          <h2 className="text-4xl font-royal text-forest-dark">Kitchen Queue</h2>
        </div>
        <div className="flex items-center gap-3 bg-white border border-forest/10 text-forest-dark px-5 py-3 rounded-full font-medium shadow-sm font-sans">
          <Clock size={20} className="text-gold animate-pulse" />
          <span className="tracking-wide">{orders.length} Active Orders</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-dark flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-gold-light"></div>
            
            <div className="flex justify-between items-start mb-6 pt-2">
              <div>
                <h3 className="text-2xl font-royal text-forest-dark">Table {order.table_number}</h3>
                <p className="text-xs text-forest-light tracking-wide uppercase mt-1 font-sans">Order #{order.id} • {new Date(order.created_at.replace(' ', 'T')).toLocaleTimeString('en-IN')}</p>
              </div>
              <span className="px-4 py-1.5 bg-forest/5 text-forest-dark border border-forest/10 text-xs font-bold rounded-full uppercase tracking-wider font-sans">
                {order.status}
              </span>
            </div>

            <div className="flex-1 mb-8">
              <p className="font-royal text-xl text-forest-dark">Total: <span className="text-gold font-bold">₹{(order.total || 0).toFixed(2)}</span></p>
            </div>

            <button 
              onClick={() => completeOrder(order.id)}
              className="mt-auto w-full bg-forest hover:bg-forest-dark text-cream font-bold tracking-widest uppercase text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-royal"
            >
              <CheckCircle2 size={18} strokeWidth={2} /> Mark Ready
            </button>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full py-24 text-center text-forest-light/60 bg-white/50 rounded-[2rem] border border-dashed border-forest/20">
            <CheckCircle2 size={56} className="mx-auto mb-6 opacity-40 text-forest" strokeWidth={1} />
            <p className="text-2xl font-royal text-forest-dark mb-2">No pending orders</p>
            <p className="font-medium tracking-wide font-sans">The kitchen is clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
