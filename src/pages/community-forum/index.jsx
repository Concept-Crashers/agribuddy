import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CATEGORY_META = {
    disease: { label: 'Disease', icon: 'Bug', color: 'text-error bg-error/10' },
    soil: { label: 'Soil', icon: 'Mountain', color: 'text-amber-600 bg-amber-50' },
    weather: { label: 'Weather', icon: 'CloudSun', color: 'text-blue-600 bg-blue-50' },
    market: { label: 'Market', icon: 'TrendingUp', color: 'text-purple-600 bg-purple-50' },
    general: { label: 'General', icon: 'MessageCircle', color: 'text-gray-600 bg-gray-100' },
    success_story: { label: 'Success Story', icon: 'Star', color: 'text-yellow-600 bg-yellow-50' },
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' });

const PostCard = ({ post, onClick }) => {
    const meta = CATEGORY_META[post.category] || CATEGORY_META.general;
    return (
        <div onClick={() => onClick(post)} className="glass-card rounded-2xl p-5 cursor-pointer interactive-element hover:border-primary/40 transition-all">
            <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${meta.color}`}>
                    <Icon name={meta.icon} size={12} />
                    {meta.label}
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {post.isResolved && (
                        <span className="flex items-center gap-1 text-success font-semibold">
                            <Icon name="CheckCircle" size={12} />Resolved
                        </span>
                    )}
                    <span>{formatDate(post.createdAt)}</span>
                </div>
            </div>

            <h3 className="font-bold text-foreground mb-1 line-clamp-2">{post.title}</h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={10} className="text-primary" />
                </div>
                <span>{post.author?.name}</span>
                {post.author?.region && <><span>•</span><span>{post.author.region}</span></>}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full ${post.author?.role === 'expert' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                    {post.author?.role}
                </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Icon name="Eye" size={12} />{post.views}</span>
                <span className="flex items-center gap-1"><Icon name="Heart" size={12} />{post.likes}</span>
                <span className="flex items-center gap-1"><Icon name="MessageSquare" size={12} />{post.comments?.length || 0}</span>
            </div>
        </div>
    );
};

const PostDetailModal = ({ post: initialPost, onClose }) => {
    const [post, setPost] = useState(initialPost);
    const [comment, setComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!post) return null;

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() || !authorName.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/community/${post._id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author: { name: authorName, role: 'farmer' }, content: comment }),
            });
            const data = await res.json();
            if (data.success) {
                setPost(p => ({ ...p, comments: [...(p.comments || []), data.data] }));
                setComment('');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={e => e.stopPropagation()}>
                <div className="gradient-primary rounded-t-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                        <h2 className="text-xl font-bold flex-1 pr-4">{post.title}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg flex-shrink-0"><Icon name="X" size={20} /></button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 opacity-80 text-sm">
                        <span>{post.author?.name}</span>
                        <span>•</span>
                        <span>{post.author?.role}</span>
                        {post.author?.region && <><span>•</span><span>{post.author.region}</span></>}
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {/* Comments */}
                    <div>
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <Icon name="MessageSquare" size={18} className="text-primary" />
                            {post.comments?.length || 0} Replies
                        </h3>

                        <div className="space-y-3">
                            {post.comments?.map((c, i) => (
                                <div key={i} className={`rounded-xl p-4 border ${c.isExpertAnswer ? 'bg-primary/5 border-primary/30' : 'bg-muted border-border'}`}>
                                    {c.isExpertAnswer && (
                                        <span className="text-xs font-bold text-primary flex items-center gap-1 mb-2">
                                            <Icon name="Award" size={12} />Expert Answer
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <span className="font-semibold text-foreground">{c.author?.name}</span>
                                        <span>•</span>
                                        <span>{c.author?.role}</span>
                                        <span>•</span>
                                        <span>{formatDate(c.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-foreground">{c.content}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleComment} className="mt-4 space-y-3">
                            <input
                                required
                                value={authorName}
                                onChange={e => setAuthorName(e.target.value)}
                                placeholder="Your name"
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <textarea
                                required
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Share your advice or experience..."
                                rows={3}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            />
                            <Button type="submit" disabled={submitting}
                                className="gradient-primary text-white rounded-xl w-full h-10 font-semibold">
                                {submitting ? 'Posting...' : 'Post Reply'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewPostModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', content: '', authorName: '', authorRegion: '', category: 'general' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/community`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    content: form.content,
                    author: { name: form.authorName, role: 'farmer', region: form.authorRegion },
                    category: form.category,
                }),
            });
            if (!res.ok) throw new Error('Failed to post');
            onCreated?.();
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg my-8" onClick={e => e.stopPropagation()}>
                <div className="gradient-primary rounded-t-2xl p-6 text-white flex items-center justify-between">
                    <h2 className="text-xl font-bold">Ask a Question</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><Icon name="X" size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Your name *</label>
                            <input required value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Region</label>
                            <input value={form.authorRegion} onChange={e => setForm(f => ({ ...f, authorRegion: e.target.value }))}
                                placeholder="e.g. Central"
                                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Category</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title *</label>
                        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="What is your question?"
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Description *</label>
                        <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                            placeholder="Describe your situation in detail..."
                            rows={4}
                            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full gradient-primary text-white rounded-xl h-12 font-bold">
                        {submitting ? 'Posting...' : 'Post Question'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

const CommunityForum = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showNewPost, setShowNewPost] = useState(false);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');

    useEffect(() => {
        const h = setTimeout(() => setSearchDebounce(search), 400);
        return () => clearTimeout(h);
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

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchDebounce) params.append('q', searchDebounce);
            if (category) params.append('category', category);
            params.append('limit', '50');
            const res = await fetch(`${BACKEND_URL}/api/community?${params}`);
            const data = await res.json();
            setPosts(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchDebounce, category]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    return (
        <div className="min-h-screen bg-background">
            <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
            <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />

            <main className={`${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
                <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
                                <Icon name="Users" size={28} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Community Forum</h1>
                                <p className="text-muted-foreground text-sm mt-1">Ask questions &amp; share knowledge</p>
                            </div>
                        </div>
                        <Button onClick={() => setShowNewPost(true)} className="gradient-primary text-white rounded-xl h-11 px-5">
                            <Icon name="Plus" size={18} className="mr-2" />
                            <span className="hidden sm:inline font-semibold">Ask Question</span>
                        </Button>
                    </div>

                    <div className="relative">
                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search discussions..."
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setCategory('')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!category ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'}`}>
                            All
                        </button>
                        {Object.entries(CATEGORY_META).map(([k, v]) => (
                            <button key={k} onClick={() => setCategory(k)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === k ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'}`}>
                                {v.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-32 bg-muted/20" />)}
                        </div>
                    ) : error ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="AlertCircle" size={40} className="text-error mx-auto mb-4" />
                            <p className="text-muted-foreground">{error}</p>
                            <Button onClick={fetchPosts} className="mt-4">Try Again</Button>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <Icon name="MessageCircle" size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                            <p className="text-muted-foreground font-medium">No discussions yet</p>
                            <p className="text-sm text-muted-foreground mt-1">Be the first to ask a question!</p>
                            <Button onClick={() => setShowNewPost(true)} className="mt-4 gradient-primary text-white rounded-xl">Ask a Question</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts.map(post => <PostCard key={post._id} post={post} onClick={setSelectedPost} />)}
                        </div>
                    )}
                </div>
            </main>

            {selectedPost && <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
            {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} onCreated={fetchPosts} />}
        </div>
    );
};

export default CommunityForum;
