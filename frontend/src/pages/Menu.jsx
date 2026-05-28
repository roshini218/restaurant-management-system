import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, ShoppingCart, Send } from 'lucide-react';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('1');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(res.data);
    } catch (error) {
      console.error('Failed to fetch menu');
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(c => c.id === itemId);
    if (!existing) return;
    
    if (existing.quantity > 1) {
      setCart(cart.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c.id !== itemId));
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    try {
      await axios.post('http://localhost:5000/api/orders', {
        table_number: parseInt(tableNumber),
        items: cart.map(c => ({ menu_item_id: c.id, quantity: c.quantity }))
      });
      setCart([]);
      alert('Order placed successfully!');
    } catch (error) {
      alert('Failed to place order');
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const categories = [...new Set(menuItems.map(m => m.category))];

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
      {/* Menu List */}
      <div className="flex-1 space-y-12">
        <header>
          <p className="text-sm tracking-[0.2em] text-gold uppercase mb-2 font-royal">Our Offerings</p>
          <h2 className="text-4xl font-royal text-forest-dark">Dining Menu</h2>
        </header>

        {categories.map(cat => (
          <div key={cat} className="space-y-6">
            <h3 className="text-2xl font-royal text-forest-dark border-b border-forest/10 pb-4">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.filter(m => m.category === cat).map(item => {
                const cartItem = cart.find(c => c.id === item.id);
                return (
                  <div key={item.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-cream-dark flex justify-between items-center group hover:shadow-md transition-all duration-300">
                    <div>
                      <h4 className="font-royal text-lg font-semibold text-forest-dark mb-1 group-hover:text-gold transition-colors">{item.name}</h4>
                      <p className="text-forest-light font-medium font-sans">₹{item.price.toFixed(2)}</p>
                    </div>
                    
                    {cartItem ? (
                      <div className="flex items-center gap-3 bg-forest text-cream rounded-full px-2 py-1 shadow-md animate-in zoom-in duration-200">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="font-bold min-w-[1.2rem] text-center font-sans">{cartItem.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-3 rounded-full bg-cream hover:bg-forest hover:text-cream text-forest transition-colors shadow-sm"
                      >
                        <Plus size={20} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96">
        <div className="bg-forest-dark text-cream p-8 rounded-[2rem] sticky top-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
            <ShoppingCart className="text-gold" strokeWidth={1.5} />
            <h3 className="text-2xl font-royal">Current Order</h3>
          </div>

          <div className="mb-8">
            <label className="block text-xs uppercase tracking-wider text-cream/70 mb-2 font-royal">Table Number</label>
            <input 
              type="number" 
              min="1"
              value={tableNumber} 
              onChange={e => setTableNumber(Math.max(1, parseInt(e.target.value) || 1).toString())}
              className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-gold transition-colors text-cream font-medium font-sans"
            />
          </div>

          <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm font-medium border-b border-white/5 pb-3 last:border-0 font-sans">
                <div className="text-cream/90">
                  <span className="text-gold mr-2">{item.quantity}x</span> {item.name}
                </div>
                <div className="font-royal">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            {cart.length === 0 && <p className="text-cream/50 text-sm font-royal italic text-center py-4">Your order is empty</p>}
          </div>

          <div className="border-t border-white/10 pt-6 mb-8 space-y-3">
            <div className="flex justify-between items-center text-sm font-sans text-cream/70">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-sans text-cream/70">
              <span>GST (5%)</span>
              <span>₹{(total * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-royal pt-2 border-t border-white/5">
              <span className="text-cream/80">Grand Total</span>
              <span className="text-gold font-semibold">₹{(total * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={placeOrder}
            disabled={cart.length === 0}
            className="w-full bg-gold hover:bg-gold-light text-forest-dark font-bold tracking-wider uppercase text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20 font-royal"
          >
            <Send size={18} strokeWidth={2} /> Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
