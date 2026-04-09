import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CATEGORY_ICONS = {
    seeds: 'Sprout',
    fertilisers: 'FlaskConical',
    pesticides: 'ShieldAlert',
    tools: 'Wrench',
    feeds: 'Package',
    other: 'Box',
};

const ProductCard = ({ product, onOrder }) => (
    <div className="glass-card rounded-2xl overflow-hidden interactive-element hover:border-primary/40 hover:shadow-lg transition-all duration-200 group flex flex-col">
        {/* Image placeholder */}
        <div className="h-40 bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center">
            <Icon name={CATEGORY_ICONS[product.category] || 'Box'} size={40} className="text-primary/40 group-hover:scale-110 transition-transform" />
        </div>

        <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-foreground leading-tight">{product.name}</h3>
                <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full capitalize ml-2 flex-shrink-0">
                    {product.category}
                </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{product.description}</p>

            <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < Math.round(product.rating) ? 'text-warning fill-warning' : 'text-muted'}
                    />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div>
                    <span className="text-lg font-bold text-success">
                        {product.price?.toLocaleString()} UGX
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
                </div>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
            </div>

            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Icon name="MapPin" size={12} />
                {product.seller?.location || product.seller?.region}
            </div>

            <Button
                onClick={() => onOrder(product)}
                disabled={product.stock === 0}
                className="mt-3 gradient-primary text-white rounded-xl h-10 font-semibold shadow-hover disabled:opacity-50"
            >
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                Order Now
            </Button>
        </div>
    </div>
);

const OrderModal = ({ product, onClose, onPlace }) => {
    const [form, setForm] = useState({
        buyerName: '',
        buyerPhone: '',
        quantity: 1,
        village: '',
        subCounty: '',
        district: '',
        paymentMethod: 'mobile_money',
        notes: '',
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
                    buyerName: form.buyerName,
                    buyerPhone: form.buyerPhone,
                    deliveryAddress: { village: form.village, subCounty: form.subCounty, district: form.district },
                    items: [{ product: product._id, productName: product.name, quantity: form.quantity, unitPrice: product.price }],
                    totalAmount: total,
                    paymentMethod: form.paymentMethod,
                    notes: form.notes,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
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

const Marketplace = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const [category, setCategory] = useState('');
    const [orderProduct, setOrderProduct] = useState(null);

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
            params.append('limit', '50');
            const res = await fetch(`${BACKEND_URL}/api/marketplace/products?${params}`);
            const data = await res.json();
            setProducts(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchDebounce, category]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const categories = ['', 'seeds', 'fertilisers', 'pesticides', 'tools', 'feeds', 'other'];

    return (
        <div className="min-h-screen bg-background">
            <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
            <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />

            <main className={`transition-all duration-300 ${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
                <div className="p-4 sm:p-6 space-y-6 max-w-8xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
                            <Icon name="ShoppingBag" size={28} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Marketplace</h1>
                            <p className="text-muted-foreground text-sm mt-1">Seeds, fertilisers, tools &amp; more</p>
                        </div>
                    </div>

                    <div className="relative max-w-xl">
                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button key={cat || 'all'} onClick={() => setCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
                                    category === cat ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                                }`}>
                                {cat || 'All'}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />)}
                        </div>
                    ) : error ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="AlertCircle" size={40} className="text-error mx-auto mb-4" />
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchProducts} className="mt-4">Try Again</Button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="ShoppingBag" size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                            <p className="text-muted-foreground font-medium">No products found</p>
                            <p className="text-sm text-muted-foreground mt-1">The marketplace is being populated. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map(p => <ProductCard key={p._id} product={p} onOrder={setOrderProduct} />)}
                        </div>
                    )}
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
