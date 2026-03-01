import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CameraInterface from './components/CameraInterface';
import AnalysisResults from './components/AnalysisResults';
import DiagnosisHistory from './components/DiagnosisHistory';
import QuickTips from './components/QuickTips';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PlantDiseaseDetection = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [activeView, setActiveView] = useState('scanner');

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

  // Real AI analysis function using Gemini Vision
  const performAnalysis = async (imageBlob, imageUrl) => {
    setIsAnalyzing(true);
    setCapturedImage(imageUrl);

    try {
      // Convert blob to base64 data URL for Gemini API
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });

      if (imageBlob instanceof Blob) {
        reader.readAsDataURL(imageBlob);
      } else {
        // If it's already a File object
        reader.readAsDataURL(imageBlob);
      }

      const imageDataUrl = await base64Promise;

      // Import and call Gemini service
      const { analyzePlantDisease } = await import('../../services/geminiService');
      const result = await analyzePlantDisease(imageDataUrl);

      if (result.success) {
        setAnalysisResults(result.data);
      } else {
        // Use fallback data if analysis fails
        setAnalysisResults(result.fallback);
        console.error('Analysis failed:', result.error);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      // Fallback error state
      setAnalysisResults({
        disease: 'Analysis Error',
        cropType: 'Unknown',
        confidence: 0,
        description: 'An error occurred during analysis. Please check your internet connection and try again.',
        treatments: [],
        preventionTips: ['Ensure stable internet connection', 'Try uploading a clearer image', 'Contact support if issue persists'],
        severity: 'unknown',
        urgency: 'Please retry',
        additionalNotes: error.message || 'Unknown error occurred',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageCapture = (imageBlob, imageUrl) => {
    performAnalysis(imageBlob, imageUrl);
  };

  const handleNewScan = () => {
    setAnalysisResults(null);
    setCapturedImage(null);
    setActiveView('scanner');
  };

  const handleSelectDiagnosis = (diagnosis) => {
    console.log('Selected diagnosis:', diagnosis);
  };

  const viewOptions = [
    { id: 'scanner', label: 'Scanner', icon: 'Camera' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'tips', label: 'Tips', icon: 'Lightbulb' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} sidebarExpanded={sidebarExpanded} userRole="farmer" />
      <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} userRole="farmer" />
      <main className={`transition-all duration-300 ${isMobile ? 'ml-0 pb-20' : sidebarExpanded ? 'lg:ml-80' : 'lg:ml-16'} pt-16`}>
        <div className="p-4 sm:p-6 space-y-6 max-w-8xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20">
                <Icon name="Bug" size={28} className="text-primary pulse-subtle" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Plant Disease Detection</h1>
                <p className="text-muted-foreground text-sm sm:text-base font-medium mt-1">AI-powered crop health analysis</p>
              </div>
            </div>
            {analysisResults && (
              <Button onClick={handleNewScan} className="h-11 px-5 rounded-xl gradient-primary text-white shadow-hover interactive-element">
                <Icon name="Plus" size={18} className="mr-2" />
                <span className="font-semibold text-white">New Scan</span>
              </Button>
            )}
          </div>

          <div className="-mb-2">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
              {viewOptions?.map((option) => (
                <Button key={option?.id} variant={activeView === option?.id ? "default" : "ghost"} size="sm" onClick={() => setActiveView(option?.id)} className="flex-1 justify-center whitespace-nowrap"><Icon name={option?.icon} size={16} className="mr-2" />{option?.label}</Button>
              ))}
            </div>
          </div>

          {activeView === 'scanner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7"><CameraInterface onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} /></div>
              <div className="lg:col-span-5"><AnalysisResults results={analysisResults} isAnalyzing={isAnalyzing} capturedImage={capturedImage} /></div>
            </div>
          )}

          {activeView === 'history' && <div className="max-w-6xl mx-auto"><DiagnosisHistory onSelectDiagnosis={handleSelectDiagnosis} /></div>}
          {activeView === 'tips' && <div className="max-w-6xl mx-auto"><QuickTips /></div>}

          {activeView === 'scanner' && (
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-5 text-center interactive-element hover:border-primary/30 group">
                  <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon name="Scan" size={24} className="text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground leading-none mb-1">156</div>
                  <div className="text-sm font-medium text-muted-foreground">Total Scans</div>
                </div>
                <div className="glass-card rounded-2xl p-5 text-center interactive-element hover:border-success/30 group">
                  <div className="w-12 h-12 bg-success/15 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-success/20 transition-colors">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground leading-none mb-1">92%</div>
                  <div className="text-sm font-medium text-muted-foreground">Accuracy</div>
                </div>
                <div className="glass-card rounded-2xl p-5 text-center interactive-element hover:border-warning/30 group">
                  <div className="w-12 h-12 bg-warning/15 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-warning/20 transition-colors pulse-subtle">
                    <Icon name="Activity" size={24} className="text-warning" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground leading-none mb-1">23</div>
                  <div className="text-sm font-medium text-muted-foreground">Diseases</div>
                </div>
                <div className="glass-card rounded-2xl p-5 text-center interactive-element hover:border-accent/30 group">
                  <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                    <Icon name="TrendingUp" size={24} className="text-accent" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground leading-none mb-1">78%</div>
                  <div className="text-sm font-medium text-muted-foreground">Success</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="glass-card rounded-2xl border-error/20 p-5 sm:p-6 interactive-element hover:bg-error/5 hover:border-error/30 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-error rounded-l-2xl"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0 ml-2">
                  <div className="w-12 h-12 bg-error/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon name="AlertTriangle" size={24} className="text-error pulse-subtle" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Emergency Plant Health Support</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-1">For severe disease outbreaks or urgent assistance</p>
                  </div>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto ml-2 sm:ml-0">
                  <Button variant="outline" className="flex-1 h-11 rounded-lg border-border bg-white text-foreground hover:bg-muted font-bold transition-colors">
                    <Icon name="Phone" size={16} className="mr-2 text-primary" />Call
                  </Button>
                  <Button className="flex-1 h-11 rounded-lg bg-[#25D366] text-white hover:bg-[#128C7E] font-bold shadow-hover transition-colors">
                    <Icon name="MessageSquare" size={16} className="mr-2" />WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDiseaseDetection;