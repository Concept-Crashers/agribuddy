import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, TrendingDown, RefreshCw, Filter, 
    Search, Download, MapPin, Calendar, ExternalLink,
    AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useLanguage } from '../../context/LanguageContext';

const MarketPrices = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSource, setSelectedSource] = useState('All');
    const [isSyncing, setIsSyncing] = useState(false);
    const { t } = useLanguage();

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/market-prices');
            setPrices(response.data.data);
        } catch (error) {
            console.error('Error fetching market prices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await axios.post('http://localhost:3001/api/market-prices/sync');
            await fetchPrices();
        } catch (error) {
            console.error('Error syncing prices:', error);
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const filteredPrices = prices.filter(p => {
        const matchesSearch = p.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSource = selectedSource === 'All' || p.source === selectedSource;
        return matchesSearch && matchesSource;
    });

    const sources = ['All', ...new Set(prices.map(p => p.source))];

    // Mock data for the trend chart (using current prices as end points)
    const chartData = [
        { name: 'Jan', price: 950 },
        { name: 'Feb', price: 1050 },
        { name: 'Mar', price: 1000 },
        { name: 'Apr', price: 1100 },
        { name: 'May', price: filteredPrices.find(p => p.cropName === 'Maize')?.price || 1200 },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            <Header
                onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
                sidebarExpanded={sidebarExpanded}
                userRole="farmer"
            />
            <Sidebar
                isExpanded={sidebarExpanded}
                onToggle={() => setSidebarExpanded(!sidebarExpanded)}
                userRole="farmer"
            />

            <main className={`transition-all duration-300 pt-20 pb-12 ${sidebarExpanded ? 'lg:ml-80' : 'lg:ml-20'}`}>
                <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2"
                            >
                                {t('market_pulse', 'Agri Market Insights')}
                            </motion.h1>
                            <p className="text-slate-500 font-medium">{t('market_trends', 'Real-time agricultural commodity prices across Uganda & East Africa.')}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all
                                    ${isSyncing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}
                                `}
                            >
                                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                {isSyncing ? t('loading', 'Syncing...') : t('save', 'Sync Now')}
                            </motion.button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all">
                                <Download className="w-4 h-4" />
                                {t('view_all', 'Export')}
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Maize (Avg)', value: '1,125 UGX', trend: '+2.4%', up: true },
                            { label: 'Beans (Avg)', value: '3,500 UGX', trend: '-1.2%', up: false },
                            { label: 'Coffee (Robusta)', value: '8,500 UGX', trend: '+5.0%', up: true },
                            { label: 'Sorghum', value: '1,800 UGX', trend: '0.0%', up: null }
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                    {stat.up !== null && (
                                        <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${stat.up ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                            {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Main Chart Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Price Dynamics</h2>
                                    <p className="text-slate-400 text-sm">Maize price trends in Kampala (5 months)</p>
                                </div>
                                <select className="bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500">
                                    <option>Kampala</option>
                                    <option>Gulu</option>
                                    <option>Mbarara</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94A3B8', fontWeight: 600, fontSize: 12 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke="#10b981" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorPrice)" 
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Market Pulse / Feed */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/20 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-emerald-300 mb-6 bg-emerald-800/50 w-fit px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Market Pulse
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Supply Outlook: Q2 2026</h2>
                                <p className="text-emerald-100/80 leading-relaxed mb-6">
                                    Maize harvests in Western Uganda are expected to be 15% higher this season, likely stabilizing prices by mid-June. Demand from regional markets remains strong.
                                </p>
                                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group">
                                    View Full Report
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-800/30 rounded-full blur-3xl"></div>
                        </motion.div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder={t('search', 'Search commodities or districts...')}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all outline-none text-slate-600 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {sources.map(source => (
                                <button 
                                    key={source}
                                    onClick={() => setSelectedSource(source)}
                                    className={`whitespace-nowrap px-6 py-3.5 rounded-2xl font-bold text-sm transition-all
                                        ${selectedSource === source 
                                            ? 'bg-slate-900 text-white shadow-lg' 
                                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}
                                    `}
                                >
                                    {source}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Commodity</th>
                                        <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Market / Location</th>
                                        <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Source</th>
                                        <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Price (UGX/kg)</th>
                                        <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">24h Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {loading ? (
                                            [1,2,3,4,5].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan="5" className="px-8 py-6 bg-slate-50/20"></td>
                                                </tr>
                                            ))
                                        ) : filteredPrices.map((item, i) => (
                                            <motion.tr 
                                                key={item._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-emerald-50/30 transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.cropName}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                        <MapPin className="w-4 h-4 text-slate-300" />
                                                        {item.location}
                                                        {item.district && <span className="text-slate-300 ml-1">• {item.district}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                        ${item.source === 'RATIN' ? 'bg-amber-100 text-amber-700' : 
                                                          item.source === 'AMIS' ? 'bg-blue-100 text-blue-700' : 
                                                          'bg-emerald-100 text-emerald-700'}
                                                    `}>
                                                        {item.source}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="font-mono font-bold text-lg text-slate-900">
                                                        {item.price.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className={`inline-flex items-center gap-1 font-bold text-sm ${item.trend > 0 ? 'text-emerald-600' : item.trend < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                                        {item.trend > 0 ? <TrendingUp className="w-4 h-4" /> : item.trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                                                        {item.trend === 0 ? '-' : `${Math.abs(item.trend).toFixed(1)}%`}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredPrices.length === 0 && !loading && (
                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching data found</h3>
                                <p className="text-slate-400 max-w-sm">Try adjusting your search terms or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MarketPrices;
