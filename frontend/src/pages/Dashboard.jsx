import { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingUp, Receipt, Activity } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_revenue: 0, total_bills: 0 });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchLogs();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/summary');
      setSummary(res.data);
    } catch (error) {
      console.error('Failed to fetch summary');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch logs');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center">
        <p className="text-sm tracking-[0.2em] text-gold uppercase mb-2 font-royal">Overview</p>
        <h2 className="text-4xl font-royal text-forest-dark">Business Performance</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-dark flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-forest/5 text-forest rounded-2xl">
            <IndianRupee size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-forest-light font-semibold mb-1">Total Revenue</p>
            <p className="text-3xl font-royal text-forest-dark">₹{(summary.total_revenue || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-dark flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-forest/5 text-forest rounded-2xl relative">
            <Receipt size={32} strokeWidth={1.5} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-forest mt-1">₹</div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-forest-light font-semibold mb-1">Total Bills Generated</p>
            <p className="text-3xl font-royal text-forest-dark">{summary.total_bills || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-cream-dark flex items-center gap-6 hover:shadow-md transition-shadow">
          <div className="p-4 bg-gold/10 text-gold rounded-2xl">
            <TrendingUp size={32} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-forest-light font-semibold mb-1">Avg. Order Value</p>
            <p className="text-3xl font-royal text-forest-dark">
              ₹{(summary.total_bills > 0 ? (summary.total_revenue / summary.total_bills) : 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* System Logs Section */}
      <div className="bg-forest-dark text-cream p-10 rounded-[2.5rem] mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-forest/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <Activity className="text-gold" strokeWidth={1.5} />
            <h3 className="text-2xl font-royal">Live System Logs</h3>
          </div>
          <button onClick={fetchLogs} className="text-xs uppercase tracking-wider font-semibold bg-white/10 px-5 py-2.5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm font-royal">
            Refresh
          </button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 relative z-10 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="mt-1">
                <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${log.event === 'Order Placed' ? 'bg-gold shadow-gold/50' : 'bg-cream shadow-cream/50'}`}></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg font-royal mb-1 tracking-wide">{log.event}</p>
                <p className="text-sm text-cream/70 font-sans leading-relaxed">{log.details}</p>
              </div>
              <div className="text-xs font-medium text-cream/50 tracking-wider font-sans">
                {new Date(log.timestamp.replace(' ', 'T')).toLocaleTimeString('en-IN')}
              </div>
            </div>
          ))}
          {logs.length === 0 && <p className="text-cream/50 text-center py-8 font-royal italic text-lg">No logs found.</p>}
        </div>
      </div>
    </div>
  );
}
