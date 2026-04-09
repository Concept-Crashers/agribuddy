import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CropCalendar from './components/CropCalendar';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const largeScreen = window.innerWidth >= 1024;
      setIsMobile(mobile);
      setSidebarExpanded(largeScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={handleToggleSidebar}
        userRole="farmer"
        weatherAlerts={0}
      />
      <main className={`flex-1 transition-all duration-300 pb-20 lg:pb-6 ${isMobile ? 'ml-0' : sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'} min-h-screen`}>
        <div className="p-4 sm:p-6 lg:px-8 lg:py-8 max-w-7xl mx-auto space-y-6">

          {/* Top Header Row (Search & Actions) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1 flex items-center gap-2 tracking-tight">
                Good Morning, Moses <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🌤️</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Monday, 24 Feb 2026
              </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-none sm:w-64 group">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search crops, markets..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <button className="w-11 h-11 rounded-xl border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-white transition-all relative flex-shrink-0 shadow-soft interactive-element">
                <Icon name="Bell" size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-white pulse-subtle"></span>
              </button>

              <Button className="h-11 px-5 rounded-xl gradient-primary text-white text-sm font-semibold whitespace-nowrap hidden sm:flex shadow-hover interactive-element">
                <Icon name="Plus" size={18} className="mr-2" />
                New Crop Cycle
              </Button>
            </div>
          </div>

          {/* ROW 1: Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Card 1: Weather */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between interactive-element group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Weather (Kampala)</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform">
                  <Icon name="CloudSun" size={24} />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-4xl leading-none font-bold text-foreground">24°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 tracking-wide">Humid</span>
                <span className="text-xs text-muted-foreground font-semibold leading-tight">Chance of rain:<br />40%</span>
              </div>
            </div>

            {/* Card 2: Maize Price */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer interactive-element group" onClick={() => navigate('/market-prices')}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Maize Price</span>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform">
                  <Icon name="Banknote" size={24} />
                </div>
              </div>
              <div className="mb-4 flex items-end gap-1">
                <span className="text-4xl leading-none font-bold text-foreground">1,200</span>
                <span className="text-sm text-muted-foreground font-bold mb-1">UGX/kg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 tracking-wide">
                  <Icon name="TrendingUp" size={14} /> +5%
                </span>
                <span className="text-xs text-muted-foreground font-semibold">vs yesterday</span>
              </div>
            </div>

            {/* Card 3: Active Alerts */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer interactive-element group" onClick={() => navigate('/weather-dashboard')}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-destructive transition-colors">Active Alerts</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform pulse-subtle">
                  <Icon name="AlertTriangle" size={24} />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-4xl leading-none font-bold text-foreground">2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 tracking-wide uppercase">Urgent</span>
                <span className="text-xs text-muted-foreground font-semibold leading-tight">Pest warnings<br />nearby</span>
              </div>
            </div>

            {/* Card 4: AskBuddy Queries */}
            <div className="glass-card rounded-2xl p-5 flex flex-col justify-between cursor-pointer interactive-element group" onClick={() => navigate('/agri-assistant')}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-purple-500 transition-colors">AskBuddy Queries</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform">
                  <Icon name="Hexagon" fill="currentColor" size={28} className="opacity-80 absolute" />
                  <Icon name="Sparkles" size={14} className="relative text-white" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-4xl leading-none font-bold text-foreground">12</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-700 tracking-wide uppercase">New</span>
                <span className="text-xs text-muted-foreground font-semibold leading-tight">Answered<br />today</span>
              </div>
            </div>

          </div>

          {/* ROW 2: Crop Calendar & Market Pulse */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
            <div className="lg:col-span-7 xl:col-span-8">
              <CropCalendar />
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="glass-card text-center rounded-2xl p-6 h-full flex flex-col min-h-[340px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} className="text-primary" />
                    Market Pulse
                  </h3>
                  <button className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 font-bold hover:bg-muted hover:text-foreground transition-all">Last 7 Days</button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border-b border-l border-border relative mt-4">
                  {/* Mock Chart Area */}

                  {/* Lines mapping the chart */}
                  <div className="w-full flex justify-between absolute h-full top-0 left-0">
                    <div className="w-full border-b border-dashed border-border h-1/4"></div>
                  </div>
                  <div className="w-full flex justify-between absolute h-full top-1/4 left-0">
                    <div className="w-full border-b border-dashed border-border h-1/4"></div>
                  </div>
                  <div className="w-full flex justify-between absolute h-full top-2/4 left-0">
                    <div className="w-full border-b border-dashed border-border h-1/4"></div>
                  </div>

                  <div className="absolute bottom-4 right-4 gradient-primary text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-soft z-10 animate-bounce" style={{ animationDuration: '2s' }}>1200</div>
                  <div className="absolute -bottom-8 w-full flex justify-between px-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span className="text-foreground font-black">Fri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: Alerts & Community Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 pb-10">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="Bug" size={24} className="text-destructive pulse-subtle" />
                  Recent Disease Alerts
                </h3>
                <button className="text-sm text-primary font-bold hover:underline tracking-wide hover:text-secondary transition-colors">View All</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-border hover:bg-white/50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-sm group-hover:scale-105 transition-transform">
                    <Icon name="Bug" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground text-sm">Fall Armyworm</h4>
                      <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-md uppercase tracking-widest">HIGH RISK</span>
                    </div>
                    <div className="flex justify-between mt-1 items-center">
                      <p className="text-xs text-muted-foreground font-semibold">Affecting: Maize Field B</p>
                      <span className="text-[10px] text-muted-foreground font-semibold">Today, 10:00 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-border hover:bg-white/50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0 text-yellow-600 shadow-sm group-hover:scale-105 transition-transform">
                    <Icon name="Leaf" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground text-sm">Coffee Rust</h4>
                      <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-md uppercase tracking-widest">MODERATE</span>
                    </div>
                    <div className="flex justify-between mt-1 items-center">
                      <p className="text-xs text-muted-foreground font-semibold">Affecting: Robusta Plot</p>
                      <span className="text-[10px] text-muted-foreground font-semibold">Yesterday</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-2 hover:bg-white/50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                    <Icon name="Droplets" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground text-sm">Water Stress Warning</h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md uppercase tracking-widest">MONITOR</span>
                    </div>
                    <div className="flex justify-between mt-1 items-center">
                      <p className="text-xs text-muted-foreground font-semibold">Affecting: Beans (Nambale)</p>
                      <span className="text-[10px] text-muted-foreground font-semibold">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                  Community Tips
                </h3>
                <button className="text-sm text-primary font-bold hover:underline tracking-wide hover:text-secondary transition-colors">Go to Forum</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-border bg-card shadow-sm relative interactive-element cursor-pointer group hover:border-primary/30">
                  <div className="flex gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-bold text-sm shadow-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">JD</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-foreground">John Doe <span className="text-muted-foreground font-medium ml-1 text-xs">• 2h ago</span></span>
                        <div className="flex text-yellow-400 gap-0.5"><Icon name="Star" size={14} fill="currentColor" /><Icon name="Star" size={14} fill="currentColor" /><Icon name="Star" size={14} fill="currentColor" /></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">Found that intercropping beans with maize helped reduce pests significantly this season. Highly recommend trying it!</p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1 rounded-md -ml-2"><Icon name="ThumbsUp" size={16} /> 12</div>
                    <div className="flex items-center gap-1.5 hover:text-primary transition-colors hover:bg-primary/5 px-2 py-1 rounded-md"><Icon name="CornerUpLeft" size={16} /> Reply</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border bg-card/60 interactive-element cursor-pointer hover:bg-card transition-colors">
                  <div className="flex gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">MK</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-foreground">Mary K. <span className="text-muted-foreground font-medium ml-1 text-xs">• 5h ago</span></span>
                        <div className="flex text-yellow-400 gap-0.5"><Icon name="Star" size={14} fill="currentColor" /><Icon name="Star" size={14} fill="currentColor" /></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">Watering early morning retains moisture better for coffee plants.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;