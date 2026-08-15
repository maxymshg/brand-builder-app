import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Layers, RefreshCw, Cpu, Check, Terminal, EyeOff, Lightbulb, Zap } from 'lucide-react';
import { ProductDNA } from '../types';

interface ProductDescriptionInputProps {
  onSynthesizeAndGenerateMaster: (description: string) => Promise<void>;
  onSynthesizeAllMediums: (description: string) => Promise<void>;
  onExtractDNAOnly: (description: string) => Promise<void>;
  isProcessing: boolean;
  processingStep?: string;
  selectedVisualModel: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image';
  onChangeVisualModel: (model: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image') => void;
  currentProduct: ProductDNA;
}

const INSPIRATION_PROMPTS = [
  {
    title: 'Kinetic Sapphire Chronometer',
    category: 'Horology / Luxury',
    desc: 'A minimal automatic watch with a brushed raw titanium case, deep obsidian dial with raised gold indices, and a sapphire crystal open exhibition caseback resting on black volcanic sand.',
  },
  {
    title: 'Matte Charcoal Espresso Machine',
    category: 'Industrial / Appliance',
    desc: 'A sculptural brutalist espresso machine made of matte dark graphite cast aluminum with knurled champagne brass steam dials and a carved raw basalt stone drip tray.',
  },
  {
    title: 'Amber Ribbed Glass Cold Brew',
    category: 'Beverage / Craft',
    desc: 'An artisanal cold brew concentrate in a cylindrical heavy-base amber fluted glass bottle with a debossed black wax dipped neck seal and textured eggshell paper typography label.',
  },
  {
    title: 'Smoked Obsidian Botanical Perfume',
    category: 'Fragrance / Luxury',
    desc: 'A monolithic square extrait de parfum bottle in translucent smoked obsidian glass with a heavyweight raw milled brass magnetic cap and debossed serif insignia near the base.',
  },
  {
    title: 'Brutalist Ceramic Wireless Earbuds',
    category: 'Audio / Tech',
    desc: 'Architectural wireless earbuds with sandblasted matte porcelain ceramic housings, micro-perforated acoustic gold grilles, and a magnetic charging dock carved from solid gray travertine.',
  },
  {
    title: 'Raw Basalt Table Luminaire',
    category: 'Home / Lighting',
    desc: 'A sculptural minimalist desk lamp featuring a cylinder of hand-chiseled dark basalt stone paired with an ultra-thin cantilevered brushed brass arm emitting warm indirect 2700K ambient light.',
  },
];

export const ProductDescriptionInput: React.FC<ProductDescriptionInputProps> = ({
  onSynthesizeAndGenerateMaster,
  onSynthesizeAllMediums,
  onExtractDNAOnly,
  isProcessing,
  processingStep,
  selectedVisualModel,
  onChangeVisualModel,
  currentProduct,
}) => {
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleApplyInspiration = (promptDesc: string) => {
    setDescription(promptDesc);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (description.trim() && !isProcessing) {
        onSynthesizeAndGenerateMaster(description);
      }
    }
  };

  return (
    <section
      id="product-description-command-bar"
      className="bg-[#0f0f0f] border-2 border-white/20 p-5 sm:p-6 text-white space-y-5 shadow-2xl relative overflow-hidden"
    >
      {/* Top Banner / Model Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00FF41] font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              PRODUCT REASONING & VISUAL SYNTHESIS
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-white/10 text-white border border-white/20 uppercase">
              PROMPT-TO-MEDIUM
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-['Syne',sans-serif] mt-1">
            Product Description Command Center
          </h2>
          <p className="text-xs text-white/50 font-normal">
            Enter any product concept. Gemini Flash extracts the Product DNA and Nano-Banana synthesizes commercial imagery.
          </p>
        </div>

        {/* Multi-Model Configuration Pills */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          {/* Reasoning Model Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black border border-white/20 text-[9px] font-mono uppercase">
            <Cpu className="w-3 h-3 text-[#00FF41]" />
            <span className="text-white/40 font-bold">DNA Engine:</span>
            <span className="text-[#00FF41] font-bold">Gemini Flash (Free Tier)</span>
          </div>

          {/* Visual Model Selector */}
          <div className="flex items-center bg-black border border-white/20 px-2.5 py-1.5 text-[9px] font-mono uppercase">
            <span className="text-white/40 font-bold mr-1.5">Visual Engine:</span>
            <span className="text-white font-bold">Nano-Banana (Flash Lite Image)</span>
          </div>
        </div>
      </div>

      {/* Main Textarea Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="product-description-textarea"
            className="text-[10px] uppercase font-black tracking-widest text-white/70 flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#00FF41]" />
            Natural Language Product Concept & Staging Description
          </label>
          <span className="text-[9px] font-mono text-white/40 uppercase">
            Press <kbd className="px-1 py-0.5 bg-white/10 text-white border border-white/20">Cmd/Ctrl + Enter</kbd> to Generate
          </span>
        </div>

        <div className="relative">
          <textarea
            id="product-description-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder='Describe your product in natural language... e.g. "A minimalist sculptural espresso machine made of matte dark graphite aluminum with knurled champagne brass dials, standing on a raw basalt block with soft directional daylight. High luxury, zero human figures."'
            className="w-full bg-black border-2 border-white/20 focus:border-[#00FF41] p-4 text-xs sm:text-sm font-sans text-white placeholder-white/25 focus:outline-none transition-colors leading-relaxed selection:bg-[#00FF41] selection:text-black resize-y"
          />

          {description && (
            <button
              type="button"
              onClick={() => setDescription('')}
              className="absolute top-3 right-3 text-[9px] font-mono text-white/40 hover:text-white uppercase bg-white/5 hover:bg-white/10 px-2 py-1 border border-white/10 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Inspiration Prompts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-[#00FF41]" />
            Quick Archetype Inspirations (Click to load):
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] font-mono uppercase text-white/40 hover:text-white"
          >
            {isExpanded ? 'Hide Ideas [-]' : 'Show Ideas [+]'}
          </button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {INSPIRATION_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyInspiration(item.desc)}
                disabled={isProcessing}
                className="text-left p-2.5 bg-black/60 hover:bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-white group-hover:text-[#00FF41] truncate">
                    {item.title}
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-[10px] text-white/50 line-clamp-2 leading-tight">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Processing Pipeline Feedback Bar */}
      {isProcessing && (
        <div
          id="processing-status-bar"
          className="p-4 bg-black border border-[#00FF41]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/20 border-t-[#00FF41] animate-spin shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF41] block">
                PROCESSING PIPELINE IN FLIGHT
              </span>
              <span className="text-xs text-white/80 font-mono">
                {processingStep || 'Synthesizing Product DNA with Gemini Flash & generating visuals with Nano-Banana...'}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-white/40 uppercase">
            Model: {selectedVisualModel}
          </span>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/60">
            Zero-Humans Constraint Active
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Action 1: Extract DNA Schema Only */}
          <button
            id="extract-dna-only-btn"
            type="button"
            onClick={() => {
              const text = description.trim() || `${currentProduct.name} ${currentProduct.shapeSilhouette}`;
              onExtractDNAOnly(text);
            }}
            disabled={isProcessing}
            className="px-3.5 py-2.5 bg-transparent hover:bg-white/10 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-40"
            title="Use Gemini Flash to parse product specifications into structured DNA tokens"
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-white/60" />
              Parse DNA Only
            </span>
          </button>

          {/* Action 2: Synthesize Master Visual Packshot (Primary) */}
          <button
            id="synthesize-master-btn"
            type="button"
            onClick={() => {
              const text = description.trim() || `${currentProduct.name} - ${currentProduct.shapeSilhouette} ${currentProduct.materials.join(' ')}`;
              onSynthesizeAndGenerateMaster(text);
            }}
            disabled={isProcessing}
            className="px-4 py-2.5 bg-white hover:bg-white/90 active:bg-white/80 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-40 flex items-center gap-2"
            title="Extract Product DNA with Gemini Flash + Generate Master Studio Anchor with Nano-Banana"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Synthesizing Visuals...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Generate Master Visual
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Action 3: Synthesize All Campaign Mediums (Full Cross-Medium Imagination) */}
          <button
            id="synthesize-all-mediums-btn"
            type="button"
            onClick={() => {
              const text = description.trim() || `${currentProduct.name} - ${currentProduct.shapeSilhouette} ${currentProduct.materials.join(' ')}`;
              onSynthesizeAllMediums(text);
            }}
            disabled={isProcessing}
            className="px-4 py-2.5 bg-[#00FF41] hover:bg-[#00FF41]/90 active:bg-[#00FF41]/80 text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-40 flex items-center gap-2"
            title="Synthesize Product DNA, Master Anchor, and render across all outdoor, print, digital & transit mediums"
          >
            <Layers className="w-3.5 h-3.5 text-black" />
            Generate All 6 Mediums
          </button>
        </div>
      </div>
    </section>
  );
};
