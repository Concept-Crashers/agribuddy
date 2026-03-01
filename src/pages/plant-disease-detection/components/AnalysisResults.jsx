import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisResults = ({ results, isAnalyzing }) => {
  const navigate = useNavigate();

  if (isAnalyzing) {
    return (
      <div className="glass-card rounded-3xl border border-border/60 shadow-soft h-full flex flex-col justify-center items-center p-8 bg-white/40">
        <div className="w-20 h-20 relative mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <Icon name="ScanLine" size={28} className="absolute inset-0 m-auto text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Image...</h3>
        <p className="text-sm font-medium text-muted-foreground text-center max-w-[250px]">
          Identifying crop type, diseases, and generating treatment recommendations.
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="glass-card rounded-3xl border border-border/60 shadow-soft h-full min-h-[400px] flex flex-col justify-center items-center p-8 bg-white/40">
        <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border/50">
          <Icon name="SearchX" size={32} className="text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 text-center tracking-tight">No Analysis Yet</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-[240px] text-center">
          Upload or capture an image of a plant leaf to view AI scan results here.
        </p>
      </div>
    );
  }

  const getConfidenceLevel = (score) => {
    if (score >= 90) return { label: `High Confidence (${score}%)`, color: 'success', bg: 'bg-success' };
    if (score >= 70) return { label: `Medium Confidence (${score}%)`, color: 'warning', bg: 'bg-warning' };
    return { label: `Low Confidence (${score}%)`, color: 'error', bg: 'bg-error' };
  };

  const confidence = getConfidenceLevel(results?.confidence || 0);

  return (
    <div className="glass-card rounded-3xl border border-border/60 shadow-soft overflow-hidden flex flex-col h-full bg-white/40">
      {/* Header */}
      <div className="p-6 border-b border-border/60 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success mr-2 pulse-subtle"></span>
            <span className="text-xs font-bold text-success uppercase tracking-wider">Scan Complete</span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted hover:text-foreground h-8 w-8 transition-colors rounded-lg">
            <Icon name="MoreHorizontal" size={18} />
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight text-wrap tracking-wide">
          Detected: <span className="text-error">{results?.disease || 'Unknown Issue'}</span>
        </h2>
        <p className="text-sm font-medium text-muted-foreground">Crop: <span className="text-foreground">{results?.cropType || 'Unknown Plant'}</span></p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Confidence Score */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-foreground">Confidence Score</span>
            <span className={`text-sm font-bold text-${confidence.color}`}>{confidence.label}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${confidence.bg}`}
              style={{ width: `${results?.confidence || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center">
            <Icon name="ShieldCheck" size={18} className="mr-2 text-primary" />
            Recommended Actions
          </h3>
          <ul className="space-y-3">
            {results?.treatments && results.treatments.length > 0 ? (
              results.treatments.slice(0, 3).map((treatment, idx) => (
                <li key={idx} className="flex items-start bg-card/60 p-4 rounded-2xl border border-border/50 shadow-sm hover:border-border hover:shadow-organic-sm transition-all group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mr-3 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-foreground block mb-1">{treatment.name}</span>
                    <span className="text-xs text-muted-foreground font-medium leading-relaxed">{treatment.instructions || `${treatment.type} treatment recommended.`}</span>
                  </div>
                </li>
              ))
            ) : (
              // Fallbacks or prevention tips if no treatments
              results?.preventionTips?.slice(0, 3).map((tip, idx) => (
                <li key={idx} className="flex items-start bg-card/60 p-4 rounded-2xl border border-border/50 shadow-sm hover:border-border hover:shadow-organic-sm transition-all group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mr-3 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground leading-relaxed mt-1">{tip}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Description / Summary */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
            <Icon name="Info" size={14} /> Botany Note
          </h4>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            {results?.description || 'No detailed description available for this issue.'}
          </p>
        </div>
      </div>

      {/* Footer / AskBuddy Integration */}
      <div className="p-6 border-t border-border/60 bg-white/30 backdrop-blur-sm mt-auto">
        <Button
          className="w-full h-14 bg-card border-border hover:bg-white shadow-soft transition-all duration-300 interactive-element rounded-xl"
          variant="outline"
          onClick={() => navigate('/agri-assistant', { state: { initialQuery: `How do I treat ${results?.disease} on my ${results?.cropType}?` } })}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Icon name="Bot" size={16} className="text-primary" />
          </div>
          <span className="font-bold text-foreground text-sm">AskBuddy for more info</span>
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;