import React from 'react';
import { Sparkles, Layers, Download, RefreshCw, Wand2, Activity } from 'lucide-react';
import { PRESET_BRANDS } from '../data/presets';
import { PresetBrand } from '../types';

interface HeaderProps {
  onSelectPreset: (preset: PresetBrand) => void;
  onGenerateAll: () => void;
  onOpenBrandKit: () => void;
  isGeneratingAny: boolean;
  selectedModel: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image';
  onChangeModel: (model: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onGenerateAll,
  onOpenBrandKit,
  isGeneratingAny,
  selectedModel,
  onChangeModel,
}) => {
  return (
    <header id="main-header" className="bg-[#0a0a0a] text-white border-b border-white/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Title & Engine Badge */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter leading-none uppercase font-['Syne',sans-serif]">
                Brand Builder
              </h1>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-white/5 text-[#00FF41] border border-[#00FF41]/40 rounded-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                Nano-Banana
              </span>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold mt-1">
              Cross-Medium Product Visualization · Gemini 2.5 Flash
            </p>
          </div>

          {/* Model Status and Indicator */}
          <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-white/40 font-bold tracking-widest">Image Engine</span>
              <span className="text-xs font-mono text-[#00FF41] uppercase tracking-wider font-bold">
                Nano-Banana Engine
              </span>
            </div>
          </div>
        </div>

        {/* Presets & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          {/* Preset Dropdown */}
          <div className="relative flex items-center">
            <select
              id="preset-brand-selector"
              onChange={(e) => {
                const preset = PRESET_BRANDS.find((p) => p.id === e.target.value);
                if (preset) onSelectPreset(preset);
              }}
              defaultValue=""
              className="bg-[#141414] text-white text-[10px] uppercase font-bold tracking-widest border border-white/20 px-3 py-2.5 focus:outline-none focus:border-white cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="" disabled className="bg-neutral-900 text-white/50">
                LOAD PRESET ARCHETYPE...
              </option>
              {PRESET_BRANDS.map((p) => (
                <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                  {p.name.toUpperCase()} ({p.category.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Export Brand Kit */}
          <button
            id="open-brand-kit-btn"
            onClick={onOpenBrandKit}
            className="inline-flex items-center gap-1.5 bg-transparent hover:bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest px-3.5 py-2.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-white/70" />
            Brand Kit Lookbook
          </button>

          {/* Batch Generate Button */}
          <button
            id="batch-generate-all-btn"
            onClick={onGenerateAll}
            disabled={isGeneratingAny}
            className="inline-flex items-center gap-2 bg-white hover:bg-white/90 active:bg-white/80 disabled:opacity-50 text-black text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition-all shadow-sm"
          >
            {isGeneratingAny ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Imagining Across Mediums...
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5" />
                Generate All Mediums
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

