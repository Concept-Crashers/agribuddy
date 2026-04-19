import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({
  isExpanded = true,
  onToggle,
  userRole = 'farmer',
  weatherAlerts = 0
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const getInitials = (name) => {
    if (!name) return 'AG';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    {
      label: t('dashboard', 'Dashboard'),
      path: '/farmer-dashboard',
      icon: 'LayoutDashboard',
      roles: ['farmer', 'ngo', 'government'],
      description: 'Overview and quick actions'
    },
    {
      label: t('market_prices', 'Market Prices'),
      path: '/market-prices',
      icon: 'TrendingUp',
      roles: ['farmer', 'ngo', 'government'],
      description: 'Live Ugandan crop prices'
    },
    {
      label: t('marketplace', 'Marketplace'),
      path: '/marketplace',
      icon: 'ShoppingBag',
      roles: ['farmer', 'ngo'],
      description: 'Buy seeds, tools & supplies'
    },
    {
      label: t('community', 'Community'),
      path: '/community-forum',
      icon: 'Users',
      roles: ['farmer', 'ngo'],
      description: 'Ask questions & share tips'
    },
    {
      label: t('crop_management', 'Crop Management'),
      path: '/crop-management',
      icon: 'Wheat',
      roles: ['farmer', 'ngo'],
      description: 'Plan and track your crops'
    },
    {
      label: t('livestock', 'Livestock'),
      path: '/livestock-management',
      icon: 'Cow',
      roles: ['farmer', 'ngo'],
      description: 'Manage your animals'
    },
    {
      label: t('disease_detection', 'Disease Detection'),
      path: '/plant-disease-detection',
      icon: 'Bug',
      roles: ['farmer', 'ngo'],
      description: 'AI-powered plant diagnosis'
    },
    {
      label: t('crop_library', 'Crop Library'),
      path: '/crop-library',
      icon: 'BookOpen',
      roles: ['farmer', 'ngo'],
      description: 'Browse crop knowledge base'
    },
    {
      label: t('ask_buddy', 'AskBuddy AI'),
      path: '/agri-assistant',
      icon: 'Bot',
      roles: ['farmer', 'ngo'],
      description: 'AI agricultural advisor'
    },
    {
      label: t('weather', 'Weather'),
      path: '/weather-dashboard',
      icon: 'CloudSun',
      roles: ['farmer', 'ngo', 'government'],
      description: 'Forecasts and advisories',
      badge: weatherAlerts > 0 ? weatherAlerts : null
    }
  ];

  const filteredItems = navigationItems?.filter(item =>
    item?.roles?.includes(userRole)
  );

  const Logo = () => (
    <div className={`flex items-center ${isExpanded ? 'space-x-3 px-6' : 'justify-center px-4'} py-4`}>
      <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-soft grow-on-hover">
        <Icon name="Leaf" size={24} color="white" strokeWidth={2.5} />
      </div>
      {isExpanded && (
        <div className="flex flex-col text-secondary-foreground">
          <span className="text-xl font-semibold">AgriBuddy</span>
          <span className="text-sm font-medium opacity-80">Uganda</span>
        </div>
      )}
    </div>
  );

  const NavigationItem = ({ item }) => {
    const isActive = location?.pathname === item?.path;

    return (
      <div className="relative group">
        <Button
          variant="ghost"
          className={`w-full justify-start h-12 px-4 rounded-xl interactive-element ${isActive
            ? 'gradient-primary text-white shadow-soft font-medium'
            : 'text-secondary-foreground/70 hover:text-white hover:bg-white/10'
            } ${!isExpanded ? 'px-3' : ''}`}
          onClick={() => navigate(item?.path)}
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="relative">
              <Icon
                name={item?.icon}
                size={20}
                className={isActive ? 'text-primary-foreground' : ''}
              />
              {item?.badge && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-warning text-warning-foreground text-xs font-medium rounded-full flex items-center justify-center z-10">
                  {item?.badge}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="flex flex-col items-start text-left">
                <span className="font-medium text-sm leading-tight">{item?.label}</span>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-primary-foreground/80' : 'opacity-70'
                  }`}>
                  {item?.description}
                </span>
              </div>
            )}
          </div>
        </Button>
        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-organic-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="font-medium text-sm text-popover-foreground">{item?.label}</span>
              <span className="text-xs text-muted-foreground">{item?.description}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-lg text-secondary-foreground border-t border-white/10 shadow-hover pb-safe">
        <nav className="flex items-center justify-around px-2 py-2">
          {filteredItems?.slice(0, 5)?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <Button
                key={item?.path}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 px-3 py-2 min-h-[48px] ${isActive
                  ? 'text-primary' : 'text-secondary-foreground/70 hover:text-secondary-foreground'
                  }`}
                onClick={() => navigate(item?.path)}
              >
                <div className="relative">
                  <Icon name={item?.icon} size={18} />
                  {item?.badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"></span>
                  )}
                </div>
                <span className="text-xs font-medium">{item?.label?.split(' ')?.[0]}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-secondary bg-gradient-to-b from-secondary to-[#022c22] text-secondary-foreground shadow-hover border-r border-white/5 z-40 ${isExpanded ? 'w-80' : 'w-16'
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary-foreground/10">
          <Logo />
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="mr-4 hover:bg-white/10 text-secondary-foreground"
            >
              <Icon name="ChevronLeft" size={18} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className={`${isExpanded ? 'px-3' : 'px-2'} space-y-1`}>
            {filteredItems?.map((item) => (
              <NavigationItem key={item?.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-secondary-foreground/10 p-4 ${!isExpanded ? 'px-2' : ''}`}>
          {!isExpanded ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="w-full hover:bg-white/10 text-secondary-foreground"
            >
              <Icon name="ChevronRight" size={18} />
            </Button>
          ) : (
            <div className="flex items-center space-x-3 py-2 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center font-bold text-white shadow-soft ring-2 ring-white/20 flex-shrink-0">
                {getInitials(user?.fullName)}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-bold text-white tracking-wide">{user?.fullName || "Agribuddy User"}</span>
                <span className="text-xs text-white/70 font-medium">Premium Plan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;