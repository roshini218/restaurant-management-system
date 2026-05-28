import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ClipboardList, Receipt, LayoutDashboard, Activity, Flower2 } from 'lucide-react';
import { useState } from 'react';

import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/menu', name: 'Menu' },
    { path: '/orders', name: 'Live Orders' },
    { path: '/checkout', name: 'Checkout' },
  ];

  return (
    <div className="min-h-screen bg-cream text-forest-dark font-sans relative overflow-hidden">
      {/* 4 Ornate Royal Corners with Flowers */}
      <div className="royal-corner corner-tl">
        <div className="royal-corner-inner"></div>
        <div className="royal-corner-outer"></div>
        <Flower2 size={24} className="absolute top-[-12px] left-[-12px] text-gold/80" strokeWidth={1.5} />
      </div>
      <div className="royal-corner corner-tr">
        <div className="royal-corner-inner"></div>
        <div className="royal-corner-outer"></div>
        <Flower2 size={24} className="absolute top-[-12px] right-[-12px] text-gold/80" strokeWidth={1.5} />
      </div>
      <div className="royal-corner corner-bl">
        <div className="royal-corner-inner"></div>
        <div className="royal-corner-outer"></div>
        <Flower2 size={24} className="absolute bottom-[-12px] left-[-12px] text-gold/80" strokeWidth={1.5} />
      </div>
      <div className="royal-corner corner-br">
        <div className="royal-corner-inner"></div>
        <div className="royal-corner-outer"></div>
        <Flower2 size={24} className="absolute bottom-[-12px] right-[-12px] text-gold/80" strokeWidth={1.5} />
      </div>

      {/* Background Gold Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-gold/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-gold/30 to-transparent blur-3xl"></div>

        {/* Decorative Gold Lines */}
        <div className="absolute top-0 left-[5%] w-[1px] h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent"></div>
        <div className="absolute top-0 right-[5%] w-[1px] h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent"></div>
      </div>

      {/* Top Header Background Image */}
      <div className="h-[40vh] bg-forest relative overflow-hidden rounded-b-[3rem] shadow-2xl z-10">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1587162253254-20a22ebbf117?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-forest/90"></div>

        {/* Floating Pill Nav */}
        <div className="absolute top-8 left-0 right-0 flex justify-center z-50">
          <nav className="glass rounded-full px-2 py-2 flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-2 rounded-full text-xs font-semibold transition-all duration-300 uppercase tracking-widest ${isActive
                    ? 'bg-forest-dark text-gold'
                    : 'text-forest-dark hover:bg-cream-dark'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pointer-events-none text-cream">
          <p className="text-xs tracking-[0.4em] uppercase mb-4 text-gold/80 font-medium font-royal">Est. 1998</p>
          <h1 className="text-6xl md:text-7xl font-royal flex items-center gap-4 tracking-wide font-light text-center px-4">
            <span className="italic text-gold">Regal</span> Crest
          </h1>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-cream/70 font-serif">Premium Golf & Dining</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
