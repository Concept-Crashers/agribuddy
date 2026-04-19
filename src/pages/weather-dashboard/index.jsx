import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const WeatherDashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole] = useState('farmer');
  const { t } = useLanguage();

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

  const forecast = [
    { day: 'Mon', date: '18 Sep', icon: 'CloudSun', high: 28, low: 19 },
    { day: 'Tue', date: '19 Sep', icon: 'CloudRain', high: 24, low: 17 },
    { day: 'Wed', date: '20 Sep', icon: 'Cloud', high: 25, low: 18 },
    { day: 'Thu', date: '21 Sep', icon: 'Sun', high: 29, low: 20 },
    { day: 'Fri', date: '22 Sep', icon: 'CloudLightning', high: 23, low: 16 },
    { day: 'Sat', date: '23 Sep', icon: 'CloudSun', high: 27, low: 19 },
    { day: 'Sun', date: '24 Sep', icon: 'Sun', high: 30, low: 21 }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
        userRole={userRole}
      />
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole={userRole}
        weatherAlerts={0}
      />
      <main className={`pt-16 pb-20 lg:pb-6 ${isMobile ? 'ml-0' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'
        }`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-8xl mx-auto">

          <div className="mb-2">
            <h1 className="text-3xl font-bold text-foreground mb-1">{t('weather', 'Weather & Irrigation')}</h1>
            <p className="text-muted-foreground text-sm font-medium">
              {t('weather_overview', 'Hyperlocal forecasts and actionable watering insights for Wakiso District.')}
            </p>
          </div>

          {/* TOP SECTION: Current Weather (60%) & Irrigation (40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Current Weather Widget */}
            <div className="lg:col-span-3 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-organic-md relative overflow-hidden flex flex-col justify-between">

              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <Icon name="Sun" size={160} className="text-warning mix-blend-multiply" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{t('weather', 'Current Weather')}</h2>
                  <p className="text-sm font-medium text-primary">Wakiso District, Uganda</p>

                  <div className="mt-6 flex items-center">
                    <Icon name="CloudSun" size={64} className="text-warning drop-shadow-md mr-6" />
                    <div>
                      <span className="text-6xl font-black text-foreground drop-shadow-sm tracking-tighter">24°</span>
                      <span className="text-2xl text-muted-foreground font-semibold uppercase ml-1">C</span>
                    </div>
                  </div>
                  <p className="font-semibold text-lg text-foreground mt-2">Partly Cloudy</p>
                </div>

                <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/50 shadow-sm flex flex-col gap-3 min-w-[140px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Droplets" size={16} />
                      <span className="text-xs font-semibold">{t('humidity', 'Humidity')}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Wind" size={16} />
                      <span className="text-xs font-semibold">Wind</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">12km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="CloudRain" size={16} />
                      <span className="text-xs font-semibold">{t('rainfall', 'Rain')}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">30%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Irrigation Recommendation */}
            <div className="lg:col-span-2 bg-blue-50 border border-blue-100/60 rounded-2xl p-6 shadow-organic-sm flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 bg-blue-200/40 w-32 h-32 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Droplets" size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">{t('recommended_activities', 'Irrigation Recommendation')}</h2>
                <p className="text-blue-800/80 font-medium mb-4 leading-relaxed">
                  Optimal time to water crops today is between <span className="font-bold text-blue-700">4:00 PM - 6:00 PM</span> to minimize evaporation and maximize absorption.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Log Irrigation
                </Button>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: 7-Day Forecast */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">{t('forecast_7d', '7-Day Forecast')}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {forecast.map((day, idx) => (
                <div key={idx} className="bg-card border border-border min-w-[120px] rounded-2xl p-5 flex flex-col items-center justify-between shadow-sm hover:shadow-organic-sm hover:border-primary/30 transition-all cursor-pointer group">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{day.day}</span>
                  <span className="text-xs font-medium text-muted-foreground mb-4">{day.date}</span>

                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-primary/5 rounded-full flex items-center justify-center transition-colors mb-4 text-slate-600 group-hover:text-primary">
                    <Icon name={day.icon} size={24} />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-foreground">{day.high}°</span>
                    <span className="font-medium text-muted-foreground">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM SECTION: Seasonal Insights */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">{t('seasonal_calendar', 'Seasonal Insights')}</h2>
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-organic-sm relative">
              <div className="flex items-center gap-3 mb-6 block lg:flex content-start">
                <div className="p-2 bg-success/10 rounded-lg text-success"><Icon name="Leaf" size={20} /></div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">First Rain Season (March-May)</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-tight">Ideal planting windows for Central Uganda</p>
                </div>
              </div>

              <div className="relative mt-8 pt-8 border-t border-border">
                {/* Timeline base */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full relative">

                  {/* Maize Window */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-[35%] h-1.5 bg-warning rounded-full">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-warning text-white text-xs font-bold px-3 py-1 rounded-md shadow flex items-center gap-1 whitespace-nowrap">
                      <Icon name="Wheat" size={12} /> Maize Preparation & Planting
                    </div>
                  </div>

                  {/* Beans Window */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-[30%] h-1.5 bg-primary rounded-full">
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-md shadow flex items-center gap-1 whitespace-nowrap">
                      <Icon name="Sprout" size={12} /> Beans Intercropping
                    </div>
                  </div>

                  {/* Month Markers */}
                  <div className="absolute -bottom-8 left-0 w-full flex justify-between px-2 text-xs font-bold text-muted-foreground">
                    <span>Feb</span>
                    <span>March</span>
                    <span>April</span>
                    <span>May</span>
                    <span>June</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WeatherDashboard;