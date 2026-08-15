import React, { useRef } from 'react';
import { Camera, Lock, Unlock, Upload, Sparkles, RefreshCw, ZoomIn, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ProductDNA } from '../types';

interface MasterAnchorCardProps {
  product: ProductDNA;
  masterAnchorImage?: string;
  isAnchorLocked: boolean;
  onToggleLock: () => void;
  onGenerateAnchor: () => Promise<void>;
  onUploadAnchor: (imageDataUrl: string) => void;
  onInspectImage: (url: string, title: string) => void;
  isGenerating: boolean;
  selectedModel: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image';
}

export const MasterAnchorCard: React.FC<MasterAnchorCardProps> = ({
  product,
  masterAnchorImage,
  isAnchorLocked,
  onToggleLock,
  onGenerateAnchor,
  onUploadAnchor,
  onInspectImage,
  isGenerating,
  selectedModel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onUploadAnchor(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="master-anchor-card" className="bg-[#0f0f0f] border border-white/10 p-5 text-white space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 block">
              ANCHOR CONDITIONING
            </span>
            {masterAnchorImage && (
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30">
                ACTIVE
              </span>
            )}
          </div>
          <h2 className="text-base font-black tracking-tight uppercase text-white font-['Syne',sans-serif]">
            Master Product Anchor
          </h2>
        </div>

        {masterAnchorImage && (
          <button
            id="toggle-anchor-lock-btn"
            onClick={onToggleLock}
            className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 border transition-all ${
              isAnchorLocked
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/60 border-white/20 hover:text-white'
            }`}
            title={isAnchorLocked ? 'Anchor is locked for all medium generations' : 'Click to lock anchor image'}
          >
            {isAnchorLocked ? <Lock className="w-3 h-3 text-black" /> : <Unlock className="w-3 h-3" />}
            {isAnchorLocked ? 'LOCKED' : 'UNLOCKED'}
          </button>
        )}
      </div>

      {/* Anchor Image Display / Staging View */}
      <div className="relative aspect-square overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
        {masterAnchorImage ? (
          <>
            <img
              src={masterAnchorImage}
              alt={product.name || 'Master Product Anchor'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
              <button
                id="inspect-master-anchor-btn"
                onClick={() => onInspectImage(masterAnchorImage, `MASTER STUDIO ANCHOR: ${product.name.toUpperCase()}`)}
                className="px-3 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-white/90"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                Inspect
              </button>
              <button
                id="reupload-anchor-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 border border-white/40 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-white/10"
              >
                <Upload className="w-3.5 h-3.5" />
                Replace
              </button>
            </div>

            {/* Zero Humans Badge */}
            <div className="absolute bottom-3 left-3 bg-black/90 border border-white/20 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-[#00FF41] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41]"></span>
              INANIMATE PACKSHOT (1:1)
            </div>
          </>
        ) : (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto text-white/40">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white">No Master Anchor Yet</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40 max-w-[220px] mx-auto mt-1 leading-relaxed">
                Generate studio packshot with Nano-Banana or upload custom reference.
              </p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-3 p-4 z-10">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#00FF41] animate-spin" />
            <div className="text-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-white">SYNTHESIZING MASTER ANCHOR</p>
              <p className="text-[9px] font-mono text-[#00FF41] mt-1 tracking-wider">NANO-BANANA ENGINE</p>
            </div>
          </div>
        )}
      </div>

      {/* Consistency Lock & Stability Meter */}
      <div className="p-3 bg-black/50 border border-white/10 space-y-2">
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
          <span className="text-white/50">Geometry & Material Sync</span>
          <span className="text-[#00FF41] font-mono">
            {masterAnchorImage ? '96% Stable' : 'Pending Anchor'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#00FF41] transition-all duration-700"
            style={{ width: masterAnchorImage ? (isAnchorLocked ? '96%' : '75%') : '0%' }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="generate-master-anchor-btn"
          onClick={onGenerateAnchor}
          disabled={isGenerating}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-white/90 active:bg-white/80 disabled:opacity-40 text-black font-black text-[10px] uppercase tracking-widest py-3 transition-all"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {masterAnchorImage ? 'Regenerate' : 'Generate Anchor'}
        </button>

        <button
          id="upload-master-anchor-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest py-3 border border-white/20 transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-white/60" />
          Upload File
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Engine Status Line */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41]"></div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white">
            Engine: Operational
          </span>
        </div>
        <span className="text-[9px] font-mono text-white/40 uppercase">Zero Humans Protocol</span>
      </div>
    </div>
  );
};

