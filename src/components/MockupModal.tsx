import React, { useState } from 'react';
import { MediumDefinition, MediumGenerationResult, ProductDNA } from '../types';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sun,
  Moon,
  Sparkles,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  EyeOff,
} from 'lucide-react';

interface MockupModalProps {
  medium: MediumDefinition;
  result: MediumGenerationResult;
  product: ProductDNA;
  onClose: () => void;
}

export const MockupModal: React.FC<MockupModalProps> = ({
  medium,
  result,
  product,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isHalftoneInk, setIsHalftoneInk] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const copyPromptOrDetails = () => {
    if (result.imageUrl) {
      navigator.clipboard.writeText(result.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${medium.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      id="mockup-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="mockup-modal-content"
        className="bg-[#0f0f0f] border border-white/20 w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-white text-black font-mono font-black text-[10px] uppercase">
              {medium.aspectRatio}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 font-['Syne',sans-serif]">
                {medium.name}
                <span className="text-[10px] font-bold text-white/50">· {product.name.toUpperCase()}</span>
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-white/40">{medium.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Contextual control toggles */}
            {medium.mockupFrameType === 'billboard' && (
              <button
                id="toggle-billboard-lighting"
                onClick={() => setIsNightMode(!isNightMode)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent text-white text-[10px] font-black uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-colors"
              >
                {isNightMode ? <Sun className="w-3 h-3 text-[#00FF41]" /> : <Moon className="w-3 h-3 text-white" />}
                {isNightMode ? 'DAYLIGHT' : 'SPOTLIGHT'}
              </button>
            )}

            {medium.mockupFrameType === 'newspaper' && (
              <button
                id="toggle-newspaper-ink"
                onClick={() => setIsHalftoneInk(!isHalftoneInk)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                  isHalftoneInk
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-white/20 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {isHalftoneInk ? 'NEWSPRINT GRAIN' : 'CLEAN PRESS'}
              </button>
            )}

            <button
              id="download-mockup-image"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-white/90 text-black text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>

            <button
              id="close-mockup-modal"
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Interactive Medium Stage */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black flex items-center justify-center min-h-[420px]">
          {/* 1. BILLBOARD MOCKUP */}
          {medium.mockupFrameType === 'billboard' && (
            <div
              className={`w-full max-w-4xl p-6 transition-colors duration-500 flex flex-col items-center justify-center ${
                isNightMode
                  ? 'bg-black'
                  : 'bg-neutral-900'
              }`}
            >
              {/* Spotlights */}
              <div className="flex justify-around w-full max-w-2xl mb-2 px-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 ${
                        isNightMode ? 'bg-[#00FF41] shadow-[0_0_15px_#00FF41]' : 'bg-neutral-600'
                      }`}
                    />
                    <div className="w-0.5 h-3 bg-neutral-700" />
                  </div>
                ))}
              </div>

              {/* Billboard Canvas Frame */}
              <div className="relative w-full max-w-3xl border-2 border-white/20 bg-black shadow-2xl overflow-hidden">
                <img
                  src={result.imageUrl}
                  alt={`${product.name} Billboard`}
                  className="w-full h-auto object-cover max-h-[500px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-black/90 border border-white/20 px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  {product.name.toUpperCase()}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/90 border border-white/20 px-2.5 py-1 text-[9px] font-mono text-[#00FF41] uppercase">
                  {product.tagline}
                </div>
              </div>

              {/* Billboard Pillars / Steel Structure */}
              <div className="flex justify-between w-full max-w-xl px-12 mt-1">
                <div className="w-3 h-16 bg-neutral-800 border-x border-neutral-700" />
                <div className="w-3 h-16 bg-neutral-800 border-x border-neutral-700" />
              </div>
            </div>
          )}

          {/* 2. NEWSPAPER BROADSHEET MOCKUP */}
          {medium.mockupFrameType === 'newspaper' && (
            <div className="w-full max-w-2xl bg-[#E8E4D9] text-[#1E1C1A] shadow-2xl p-6 sm:p-8 font-serif border border-[#D5CFC0]">
              {/* Newspaper Masthead */}
              <div className="border-b-2 border-double border-[#1E1C1A] pb-3 mb-4 text-center">
                <div className="flex justify-between items-center text-[10px] uppercase font-sans tracking-widest text-[#5A564F] mb-1">
                  <span>VOL. CXXIV NO. 48,201</span>
                  <span>THE GLOBAL DESIGN CHRONICLE</span>
                  <span>PRICE TWO SHILLINGS</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase">
                  THE INDUSTRIAL DISPATCH
                </h1>
                <div className="flex justify-between items-center text-[10px] font-sans border-t border-[#1E1C1A] pt-1 mt-1 text-[#5A564F]">
                  <span>SPECIAL COMMERCIAL INSERT</span>
                  <span>WORLDWIDE EXCLUSIVE FEATURE</span>
                </div>
              </div>

              {/* Advertisement Centerpiece */}
              <div className="border-2 border-[#1E1C1A] p-4 bg-[#F0EDE4] mb-4">
                <div className="flex items-center justify-between mb-2 border-b border-[#1E1C1A] pb-1 font-sans">
                  <span className="text-xs font-bold uppercase tracking-wider">{product.name}</span>
                  <span className="text-[11px] italic font-serif">"{product.tagline}"</span>
                </div>

                <div
                  className={`relative overflow-hidden border border-[#1E1C1A] ${
                    isHalftoneInk ? 'contrast-125 saturate-50' : ''
                  }`}
                >
                  <img
                    src={result.imageUrl}
                    alt={`${product.name} Newspaper Ad`}
                    className="w-full h-auto object-cover max-h-[420px]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 text-xs leading-relaxed font-serif text-[#2B2925]">
                  <div>
                    <p className="first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1">
                      Crafted from {product.materials.join(', ')}, the new {product.name} redefines {product.category.toLowerCase()} through relentless pursuit of material purity.
                    </p>
                  </div>
                  <div>
                    <p>
                      Every silhouette contour was sculpted to evoke {product.aestheticMood.toLowerCase()}. An essential acquisition for discerning purists worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Newspaper Footer */}
              <div className="text-center font-sans text-[10px] text-[#6A665E] uppercase tracking-widest border-t border-[#1E1C1A] pt-2">
                Published & Distributed Worldwide · Available at Selected Flagship Galleries
              </div>
            </div>
          )}

          {/* 3. SOCIAL MEDIA FEED MOCKUP */}
          {medium.mockupFrameType === 'social' && (
            <div className="w-full max-w-sm bg-[#0f0f0f] border border-white/20 overflow-hidden shadow-2xl">
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between bg-black border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-white text-black flex items-center justify-center font-black text-xs uppercase">
                    {product.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {product.name.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-[#00FF41] text-[10px]">●</span>
                    </div>
                    <span className="text-[9px] text-white/40 uppercase tracking-widest">OFFICIAL CAMPAIGN</span>
                  </div>
                </div>
                <button className="text-white/40 hover:text-white font-mono">···</button>
              </div>

              {/* Main Square Image */}
              <div className="relative aspect-square bg-black">
                <img
                  src={result.imageUrl}
                  alt={`${product.name} Social Post`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Engagement Icons */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`transition-colors ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white/60 hover:text-rose-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button className="text-white/60 hover:text-white">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="text-white/60 hover:text-white">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  {isLiked ? '1,843 LIKES' : '1,842 LIKES'}
                </div>

                {/* Caption */}
                <div className="text-[11px] text-white/80 space-y-1">
                  <p>
                    <span className="font-bold text-white mr-1.5 uppercase">
                      {product.name}
                    </span>
                    {product.tagline}. Staged in {product.primaryColor}.
                  </p>
                  <p className="text-[#00FF41] font-mono text-[9px] uppercase tracking-wider">
                    #{product.name.replace(/\s+/g, '')} #{product.category.replace(/[^a-zA-Z]/g, '')} #IndustrialDesign
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. MAGAZINE SPREAD / TRANSIT / STOREFRONT / SUBWAY / PACKAGING */}
          {medium.mockupFrameType !== 'billboard' &&
            medium.mockupFrameType !== 'newspaper' &&
            medium.mockupFrameType !== 'social' && (
              <div className="w-full max-w-3xl bg-[#0f0f0f] border border-white/10 p-4 flex flex-col items-center">
                <div className="relative w-full overflow-hidden border border-white/20 bg-black">
                  <img
                    src={result.imageUrl}
                    alt={`${product.name} on ${medium.name}`}
                    className="w-full h-auto object-cover max-h-[550px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/90 border border-white/20 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-white">
                    <span className="text-[#00FF41] font-bold">{product.name.toUpperCase()}</span> — {medium.name.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-black border-t border-white/10 flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-white/50">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#00FF41]">
              <EyeOff className="w-3 h-3" />
              ZERO HUMANS ENFORCED
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyPromptOrDetails}
              className="inline-flex items-center gap-1 text-white hover:text-[#00FF41] transition-colors font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'COPIED LINK' : 'COPY ASSET LINK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

