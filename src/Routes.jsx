import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PlantDiseaseDetection from './pages/plant-disease-detection';
import LoginPage from './pages/login';
import FarmerDashboard from './pages/farmer-dashboard';
import LivestockManagement from './pages/livestock-management';
import CropManagement from './pages/crop-management';
import WeatherDashboard from './pages/weather-dashboard';
import AgriAssistant from './pages/agri-assistant';
import MarketPrices from './pages/market-prices';
import CropLibrary from './pages/crop-library';
import Marketplace from './pages/marketplace';
import CommunityForum from './pages/community-forum';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<CropManagement />} />
          <Route path="/plant-disease-detection" element={<PlantDiseaseDetection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/livestock-management" element={<LivestockManagement />} />
          <Route path="/crop-management" element={<CropManagement />} />
          <Route path="/weather-dashboard" element={<WeatherDashboard />} />
          <Route path="/agri-assistant" element={<AgriAssistant />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/crop-library" element={<CropLibrary />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/community-forum" element={<CommunityForum />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
