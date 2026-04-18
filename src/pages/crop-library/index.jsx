import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CATEGORY_ICONS = {
    grain: 'Wheat',
    vegetable: 'Leaf',
    fruit: 'Apple',
    cash_crop: 'DollarSign',
    legume: 'Circle',
    root: 'ArrowDown',
    tuber: 'Database',
    herb: 'Flower',
    other: 'Package',
};

const CATEGORY_COLORS = {
    grain: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    vegetable: 'bg-green-100 text-green-800 border-green-200',
    fruit: 'bg-orange-100 text-orange-800 border-orange-200',
    cash_crop: 'bg-purple-100 text-purple-800 border-purple-200',
    legume: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    root: 'bg-amber-100 text-amber-800 border-amber-200',
    tuber: 'bg-red-100 text-red-800 border-red-200',
    herb: 'bg-teal-100 text-teal-800 border-teal-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const CropCard = ({ crop, onClick }) => (
    <div
        onClick={() => onClick(crop)}
        className="glass-card rounded-2xl p-5 cursor-pointer interactive-element hover:border-primary/40 hover:shadow-lg transition-all duration-200 group"
    >
        <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name={CATEGORY_ICONS[crop.category] || 'Leaf'} size={24} className="text-primary" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${CATEGORY_COLORS[crop.category] || CATEGORY_COLORS.other} capitalize`}>
                {crop.category?.replace('_', ' ')}
            </span>
        </div>
        <h3 className="font-bold text-lg text-foreground mb-1">{crop.name}</h3>
        {crop.localName && (
            <p className="text-xs text-muted-foreground italic mb-2">"{crop.localName}"</p>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{crop.description}</p>
        <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
                {crop.regions?.slice(0, 2).map(r => (
                    <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{r}</span>
                ))}
            </div>
            {crop.marketValue && (
                <span className="text-xs font-semibold text-success">{crop.marketValue}</span>
            )}
        </div>
    </div>
);

const SeverityBadge = ({ severity }) => {
    const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[severity] || map.low}`}>
            {severity}
        </span>
    );
};

const CropDetailModal = ({ crop, onClose }) => {
    if (!crop) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="gradient-primary rounded-t-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">{crop.name}</h2>
                            {crop.localName && <p className="opacity-80 italic mt-1">"{crop.localName}"</p>}
                            {crop.scientificName && <p className="opacity-60 text-sm mt-1">{crop.scientificName}</p>}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <Icon name="X" size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                    <p className="text-muted-foreground">{crop.description}</p>

                    {/* Growing Conditions */}
                    {crop.growingConditions && (
                        <section>
                            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <Icon name="Sun" size={18} className="text-primary" />
                                Growing Conditions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(crop.growingConditions).map(([k, v]) => v && (
                                    <div key={k} className="bg-muted rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground capitalize mb-1">{k}</p>
                                        <p className="text-sm font-medium text-foreground">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Planting Guide */}
                    {crop.plantingGuide && (
                        <section>
                            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <Icon name="Sprout" size={18} className="text-primary" />
                                Planting Guide
                            </h3>
                            <div className="space-y-2">
                                {Object.entries(crop.plantingGuide).map(([k, v]) => v && (
                                    <div key={k} className="flex gap-3">
                                        <span className="text-sm text-muted-foreground capitalize min-w-[100px]">{k}:</span>
                                        <span className="text-sm font-medium text-foreground">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Diseases */}
                    {crop.commonDiseases?.length > 0 && (
                        <section>
                            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <Icon name="Bug" size={18} className="text-error" />
                                Common Diseases
                            </h3>
                            <div className="space-y-3">
                                {crop.commonDiseases.map((d, i) => (
                                    <div key={i} className="border border-border rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-foreground">{d.name}</span>
                                            <SeverityBadge severity={d.severity} />
                                        </div>
                                        <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-0.5 mb-2">
                                            {d.symptoms?.map((s, j) => <li key={j}>{s}</li>)}
                                        </ul>
                                        {d.treatments?.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-semibold text-primary mb-1">Treatment:</p>
                                                {d.treatments.map((t, j) => (
                                                    <p key={j} className="text-xs text-muted-foreground">{t.name}: {t.instructions}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tips */}
                    {crop.tips?.length > 0 && (
                        <section>
                            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                <Icon name="Lightbulb" size={18} className="text-warning" />
                                Farmer Tips
                            </h3>
                            <ul className="space-y-2">
                                {crop.tips.map((t, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};


const CropLibrary = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [searchDebounce, setSearchDebounce] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setSearchDebounce(search), 400);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setSidebarExpanded(window.innerWidth >= 1024);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const fetchCrops = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchDebounce) params.append('q', searchDebounce);
            if (activeCategory) params.append('category', activeCategory);
            params.append('limit', '50');

            const res = await fetch(`${BACKEND_URL}/api/crops?${params}`);
            if (!res.ok) throw new Error('Failed to load crops');
            const data = await res.json();
            setCrops(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchDebounce, activeCategory]);

    useEffect(() => { fetchCrops(); }, [fetchCrops]);

    const categories = ['', 'grain', 'vegetable', 'fruit', 'cash_crop', 'legume', 'root', 'tuber'];

    return (
        <div className="min-h-screen bg-background">
            <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
            <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />

            <main className={`${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
                <div className="p-4 sm:p-6 space-y-6 max-w-8xl mx-auto">
                    {/* Title */}
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
                            <Icon name="BookOpen" size={28} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Crop Library</h1>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">Browse crop knowledge for Ugandan farmers</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-xl">
                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search crops..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat || 'all'}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    activeCategory === cat
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-card text-muted-foreground border-border hover:border-primary/40'
                                }`}
                            >
                                {cat ? cat.replace('_', ' ') : 'All'}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="glass-card rounded-2xl p-5 h-48 bg-muted/20" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="AlertCircle" size={40} className="text-error mx-auto mb-4" />
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchCrops} className="mt-4">Try Again</Button>
                        </div>
                    ) : crops.length === 0 ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="Search" size={40} className="text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No crops found. Try a different search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {crops.map(crop => (
                                <CropCard key={crop._id} crop={crop} onClick={setSelectedCrop} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedCrop && <CropDetailModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />}
        </div>
    );
};

export default CropLibrary;
