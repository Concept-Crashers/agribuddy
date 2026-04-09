import React from 'react';
import Icon from '../../../components/AppIcon';

const CropCalendar = () => {
  return (
    <div className="bg-white border text-left border-slate-100 rounded-2xl p-6 shadow-sm h-full flex flex-col min-h-[340px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Icon name="Calendar" size={20} className="text-[#40C074]" />
          Crop Calendar
        </h3>
        <button className="text-sm text-slate-600 font-bold hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
          <Icon name="ChevronLeft" size={16} />
          Feb - Mar 2026
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-6">

        {/* Maize Row */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-800">Maize (Hybrid)</span>
            <span className="text-[10px] font-bold text-[#40C074] bg-[#40C074]/10 px-2 py-0.5 rounded uppercase tracking-wider">Harvesting Stage</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-8 relative flex shadow-inner overflow-hidden flex-nowrap border-x border-dashed border-slate-300">
            {/* The diagonal striped empty background effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>

            {/* The active progress bar pill */}
            <div className="absolute right-[15%] w-[35%] h-full bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm z-10 border border-orange-300">
              Harvest Window
            </div>
          </div>
          <div className="flex justify-between px-1 mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Planting</span>
            <span className="pr-4">Growth</span>
            <span>Harvest</span>
          </div>
        </div>

        {/* Beans Row */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-800">Beans (Nambale)</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Vegetative Stage</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-8 relative flex shadow-inner overflow-hidden flex-nowrap border-x border-dashed border-slate-300">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>

            <div className="absolute left-[20%] w-[40%] h-full bg-[#40C074] rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm z-10 border border-[#40C074]">
              Weeding Needed
            </div>
          </div>
        </div>

        {/* Coffee Row */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-800">Coffee (Robusta)</span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">Flowering</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-8 relative flex shadow-inner flex-nowrap overflow-hidden border-x border-dashed border-slate-300">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>

            <div className="absolute left-[10%] w-[25%] h-full bg-purple-400/90 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm z-10 border border-purple-300">
              Flowering
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CropCalendar;