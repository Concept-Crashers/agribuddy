import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ─── Category config with BigHaat-style icons and subcategories ───────────────
const CATEGORIES = [
    { key: '', label: 'All Products', icon: 'LayoutGrid', color: 'from-slate-500 to-slate-600' },
    { key: 'seeds', label: 'Seeds', icon: 'Sprout', color: 'from-green-500 to-emerald-600',
      subcategories: ['Open Pollinated', 'Hybrid Seeds', 'Vegetable Seeds', 'Pasture/Forage'] },
    { key: 'crop_protection', label: 'Crop Protection', icon: 'ShieldAlert', color: 'from-red-500 to-rose-600',
      subcategories: ['Insecticides', 'Herbicides', 'Fungicides', 'Bio-Pesticides'] },
    { key: 'crop_nutrition', label: 'Crop Nutrition', icon: 'FlaskConical', color: 'from-blue-500 to-indigo-600',
      subcategories: ['Fertilizers (NPK)', 'Foliar Feeds', 'Soil Amendments', 'Micronutrients'] },
    { key: 'equipment', label: 'Equipment', icon: 'Wrench', color: 'from-orange-500 to-amber-600',
      subcategories: ['Hand Tools', 'Irrigation', 'Sprayers', 'Post-Harvest'] },
    { key: 'animal_husbandry', label: 'Animal Husbandry', icon: 'Beef', color: 'from-yellow-500 to-orange-500',
      subcategories: ['Animal Feeds', 'Veterinary Drugs', 'Vaccines', 'Supplements'] },
    { key: 'organic', label: 'Organic', icon: 'Leaf', color: 'from-teal-500 to-green-600',
      subcategories: ['Organic Fertilizers', 'Bio-Fungicides', 'Compost/Humus', 'Organic Pesticides'] },
    { key: 'services', label: 'Services', icon: 'Truck', color: 'from-purple-500 to-violet-600',
      subcategories: ['Soil Testing', 'Drone Spraying', 'Agronomist Visit', 'Land Preparation'] },
];

const UGANDAN_CROPS = ['Maize', 'Coffee', 'Beans', 'Banana (Matooke)', 'Cassava', 'Rice', 'Groundnuts', 'Tomato', 'Onion', 'Cabbage'];
const UGANDAN_PESTS = ['Fall Armyworm', 'Aphids', 'Root Rot', 'Coffee Wilt', 'Banana Weevil', 'Thrips', 'Leaf Spot', 'Blight'];

// ─── Discount Badge ───────────────────────────────────────────────────────────
const DiscountBadge = ({ price, originalPrice }) => {
    if (!originalPrice || originalPrice <= price) return null;
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    return (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {pct}% OFF
        </span>
    );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onOrder }) => {
    const cat = CATEGORIES.find(c => c.key === product.category) || CATEGORIES[0];

    return (
        <div className="glass-card rounded-2xl overflow-hidden interactive-element hover:border-primary/40 hover:shadow-xl transition-all duration-200 group flex flex-col relative">
            {/* Discount Badge */}
            <DiscountBadge price={product.price} originalPrice={product.originalPrice} />

            {/* Image / Category Visual */}
            <div className={`h-40 bg-gradient-to-br ${cat.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-pattern" />
                <Icon name={cat.icon} size={52} className="text-white/80 group-hover:scale-110 transition-transform duration-200 drop-shadow-lg" />
            </div>

            <div className="p-4 flex flex-col flex-1">
                {/* Brand + Category pill */}
                <div className="flex items-center justify-between mb-1 gap-2">
                    {product.brand && (
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{product.brand}</span>
                    )}
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full capitalize ml-auto flex-shrink-0">
                        {cat.label}
                    </span>
                </div>

                <h3 className="font-bold text-foreground leading-snug mb-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {product.subcategory && (
                    <span className="text-xs text-muted-foreground mb-1">📦 {product.subcategory}</span>
                )}

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{product.description}</p>

                {/* Target Crops chips */}
                {product.targetCrops?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.targetCrops.slice(0, 3).map(crop => (
                            <span key={crop} className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                                🌾 {crop}
                            </span>
                        ))}
                    </div>
                )}

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={11}
                            className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted'} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{product.rating?.toFixed(1)} ({product.reviewCount})</span>
                </div>

                {/* Price row */}
                <div className="flex items-end justify-between mt-auto mb-3">
                    <div>
                        <div className="text-lg font-bold text-success">
                            UGX {product.price?.toLocaleString()}
                            <span className="text-xs font-normal text-muted-foreground ml-1">/{product.unit}</span>
                        </div>
                        {product.originalPrice > product.price && (
                            <div className="text-xs text-muted-foreground line-through">
                                UGX {product.originalPrice?.toLocaleString()}
                            </div>
                        )}
                    </div>
                    <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                    </span>
                </div>

                {/* Seller */}
                <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Icon name="MapPin" size={11} />
                    <span className="truncate">{product.seller?.name} · {product.seller?.location || product.seller?.region}</span>
                </div>

                <Button
                    onClick={() => onOrder(product)}
                    disabled={product.stock === 0}
                    className="mt-auto gradient-primary text-white rounded-xl h-10 font-semibold shadow-hover disabled:opacity-50 w-full"
                >
                    <Icon name="ShoppingCart" size={15} className="mr-2" />
                    Order Now
                </Button>
            </div>
        </div>
    );
};

// ─── Promo Carousel ───────────────────────────────────────────────────────────
const PromoCarousel = ({ deals }) => {
    const [activeIdx, setActiveIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setActiveIdx(i => (i + 1) % Math.max(1, deals.length)), 4000);
        return () => clearInterval(t);
    }, [deals.length]);

    if (!deals.length) return null;
    const d = deals[activeIdx];
    const pct = d.originalPrice ? Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100) : 0;
    const cat = CATEGORIES.find(c => c.key === d.category) || CATEGORIES[0];

    return (
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${cat.color} p-5 text-white`}>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
                <Icon name={cat.icon} size={100} className="text-white" />
            </div>
            <div className="flex items-center gap-3 mb-1">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔥 BEST PRICE TODAY
                </span>
                {pct > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{pct}% OFF</span>}
            </div>
            <h3 className="font-bold text-lg leading-snug max-w-xs">{d.name}</h3>
            {d.brand && <p className="text-sm opacity-75 mt-1">{d.brand}</p>}
            <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-extrabold">UGX {d.price?.toLocaleString()}</span>
                {d.originalPrice > d.price && (
                    <span className="line-through text-white/60 text-sm">UGX {d.originalPrice?.toLocaleString()}</span>
                )}
            </div>
            {/* Dots */}
            <div className="flex gap-1.5 mt-3">
                {deals.map((_, i) => (
                    <button key={i} onClick={() => setActiveIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === activeIdx ? 'bg-white w-4' : 'bg-white/40'}`} />
                ))}
            </div>
        </div>
    );
};

// ─── Context Sidebar ──────────────────────────────────────────────────────────
const ContextSidebar = ({ activeCrop, activePest, onCropSelect, onPestSelect, onClear }) => (
    <div className="space-y-5">
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <span>🌾</span> Shop by Crop
            </h3>
            <div className="space-y-1">
                {UGANDAN_CROPS.map(crop => (
                    <button key={crop} onClick={() => onCropSelect(crop)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            activeCrop === crop ? 'bg-primary/15 text-primary font-semibold border border-primary/30' : 'text-foreground hover:bg-muted'
                        }`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${activeCrop === crop ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        {crop}
                    </button>
                ))}
            </div>
        </div>
        <div className="border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <span>🐞</span> Shop by Pest
            </h3>
            <div className="space-y-1">
                {UGANDAN_PESTS.map(pest => (
                    <button key={pest} onClick={() => onPestSelect(pest)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                            activePest === pest ? 'bg-red-500/15 text-red-500 font-semibold border border-red-500/30' : 'text-foreground hover:bg-muted'
                        }`}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${activePest === pest ? 'bg-red-500' : 'bg-muted-foreground/30'}`} />
                        {pest}
                    </button>
                ))}
            </div>
        </div>
        {(activeCrop || activePest) && (
            <button onClick={onClear} className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <Icon name="X" size={13} /> Clear Filter
            </button>
        )}
    </div>
);

// ─── Order Modal ──────────────────────────────────────────────────────────────
const OrderModal = ({ product, onClose, onPlace }) => {
    const [form, setForm] = useState({
        buyerName: '', buyerPhone: '', quantity: 1,
        village: '', subCounty: '', district: '',
        paymentMethod: 'mobile_money', notes: '',
    });
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!product) return null;
    const total = form.quantity * product.price;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPlacing(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/marketplace/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerName: form.buyerName, buyerPhone: form.buyerPhone,
                    deliveryAddress: { village: form.village, subCounty: form.subCounty, district: form.district },
                    items: [{ product: product._id, productName: product.name, quantity: form.quantity, unitPrice: product.price }],
                    totalAmount: total, paymentMethod: form.paymentMethod, notes: form.notes,
                }),
            });
            if (!res.ok) throw new Error('Order failed');
            setSuccess(true);
            onPlace?.();
        } catch {
            alert('Failed to place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (success) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle" size={36} className="text-success" />
                </div>
                <h2 className="text-xl font-bold mb-2">Order Placed!</h2>
                <p className="text-muted-foreground mb-6">Your order for <strong>{product.name}</strong> has been submitted. The seller will contact you on <strong>{form.buyerPhone}</strong>.</p>
                <Button onClick={onClose} className="gradient-primary text-white rounded-xl w-full">Close</Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
                <div className="gradient-primary rounded-t-2xl p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Place Order</h2>
                        <p className="opacity-80 text-sm mt-1">{product.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><Icon name="X" size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1">Your Name *</label>
                            <input required value={form.buyerName} onChange={e => setForm(f => ({ ...f, buyerName: e.target.value }))}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1">Phone *</label>
                            <input required value={form.buyerPhone} onChange={e => setForm(f => ({ ...f, buyerPhone: e.target.value }))}
                                placeholder="07XX XXXXXX"
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Quantity ({product.unit})</label>
                        <input type="number" min="1" max={product.stock} value={form.quantity}
                            onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1">Village / LC1</label>
                            <input value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground block mb-1">District</label>
                            <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Payment Method</label>
                        <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="mobile_money">Mobile Money</option>
                            <option value="cash">Cash on Delivery</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
                        <span className="font-medium text-foreground">Total Amount</span>
                        <span className="text-xl font-bold text-success">{total?.toLocaleString()} UGX</span>
                    </div>
                    <Button type="submit" disabled={placing}
                        className="w-full gradient-primary text-white rounded-xl h-12 font-bold shadow-hover">
                        {placing ? <Icon name="Loader2" size={20} className="animate-spin mr-2" /> : <Icon name="ShoppingCart" size={20} className="mr-2" />}
                        {placing ? 'Placing Order...' : 'Confirm Order'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

// ─── Main Marketplace Page ────────────────────────────────────────────────────
const Marketplace = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const [category, setCategory] = useState('');
    const [activeCrop, setActiveCrop] = useState('');
    const [activePest, setActivePest] = useState('');
    const [orderProduct, setOrderProduct] = useState(null);
    const [contextOpen, setContextOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => setSearchDebounce(search), 400);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const fn = () => {
            setIsMobile(window.innerWidth < 768);
            setSidebarExpanded(window.innerWidth >= 1024);
        };
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchDebounce) params.append('q', searchDebounce);
            if (category) params.append('category', category);
            if (activeCrop) params.append('crop', activeCrop);
            if (activePest) params.append('pest', activePest);
            params.append('limit', '50');
            const res = await fetch(`${BACKEND_URL}/api/marketplace/products?${params}`);
            const data = await res.json();
            const allProducts = data.data || [];
            setProducts(allProducts);

            // Best deals = products with a discount, sorted by discount % descending
            const withDiscount = allProducts
                .filter(p => p.originalPrice && p.originalPrice > p.price)
                .sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice)
                .slice(0, 5);
            setDeals(withDiscount);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchDebounce, category, activeCrop, activePest]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleCropSelect = (crop) => {
        setActiveCrop(prev => prev === crop ? '' : crop);
        setActivePest('');
        setCategory('');
    };

    const handlePestSelect = (pest) => {
        setActivePest(prev => prev === pest ? '' : pest);
        setActiveCrop('');
        setCategory('');
    };

    const handleCategoryClick = (cat) => {
        setCategory(cat);
        setActiveCrop('');
        setActivePest('');
    };

    const activeLabel = activeCrop ? `🌾 ${activeCrop}` : activePest ? `🐞 ${activePest}` : null;

    return (
        <div className="min-h-screen bg-background">
            <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
            <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />

            <main className={`${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
                <div className="flex">
                    {/* ── Context Sidebar Panel ── */}
                    <aside className={`hidden xl:block w-60 flex-shrink-0 border-r border-border min-h-[calc(100vh-64px)] sticky top-16 overflow-y-auto p-5`}>
                        <ContextSidebar
                            activeCrop={activeCrop} activePest={activePest}
                            onCropSelect={handleCropSelect} onPestSelect={handlePestSelect}
                            onClear={() => { setActiveCrop(''); setActivePest(''); }}
                        />
                    </aside>

                    {/* ── Main Content ── */}
                    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
                                    <Icon name="ShoppingBag" size={28} className="text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Marketplace</h1>
                                    <p className="text-muted-foreground text-sm mt-1">Seeds, inputs, equipment & more</p>
                                </div>
                            </div>
                            {/* Mobile context filter toggle */}
                            <button onClick={() => setContextOpen(!contextOpen)}
                                className="xl:hidden flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:border-primary/40 transition-colors">
                                <Icon name="Filter" size={15} />
                                Filter
                            </button>
                        </div>

                        {/* Mobile Context Drawer */}
                        {contextOpen && (
                            <div className="xl:hidden glass-card rounded-2xl p-4 border border-border">
                                <ContextSidebar
                                    activeCrop={activeCrop} activePest={activePest}
                                    onCropSelect={handleCropSelect} onPestSelect={handlePestSelect}
                                    onClear={() => { setActiveCrop(''); setActivePest(''); setContextOpen(false); }}
                                />
                            </div>
                        )}

                        {/* Active Filter Pill */}
                        {activeLabel && (
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20 flex items-center gap-2">
                                    {activeLabel}
                                    <button onClick={() => { setActiveCrop(''); setActivePest(''); }}
                                        className="hover:text-primary/70"><Icon name="X" size={13} /></button>
                                </span>
                                <span className="text-muted-foreground text-sm">{products.length} products found</span>
                            </div>
                        )}

                        {/* Best Prices Today Carousel */}
                        {!activeLabel && <PromoCarousel deals={deals} />}

                        {/* Search */}
                        <div className="relative max-w-xl">
                            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search products, brands, crops..."
                                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat.key || 'all'} onClick={() => handleCategoryClick(cat.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                        category === cat.key && !activeCrop && !activePest
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                                    }`}>
                                    <Icon name={cat.icon} size={14} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-80 bg-muted/20" />)}
                            </div>
                        ) : error ? (
                            <div className="glass-card rounded-2xl p-8 text-center">
                                <Icon name="AlertCircle" size={40} className="text-error mx-auto mb-4" />
                                <p className="text-muted-foreground">{error}</p>
                                <Button onClick={fetchProducts} className="mt-4">Try Again</Button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="glass-card rounded-2xl p-12 text-center">
                                <Icon name="ShoppingBag" size={48} className="text-muted-foreground mx-auto mb-4 opacity-30" />
                                <p className="text-foreground font-bold text-lg">No products found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {activeLabel ? `No items tagged for "${activeLabel}"` : 'The marketplace is being populated. Check back soon!'}
                                </p>
                                {activeLabel && (
                                    <Button onClick={() => { setActiveCrop(''); setActivePest(''); }} className="mt-4">
                                        Clear Filter
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {products.map(p => <ProductCard key={p._id} product={p} onOrder={setOrderProduct} />)}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {orderProduct && (
                <OrderModal
                    product={orderProduct}
                    onClose={() => setOrderProduct(null)}
                    onPlace={fetchProducts}
                />
            )}
        </div>
    );
};

export default Marketplace;
