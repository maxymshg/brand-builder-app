import React from 'react';
import { MediumDefinition, MediumGenerationResult, ProductDNA } from '../types';
import { X, CheckCircle2, Split, Sparkles, EyeOff } from 'lucide-react';

interface ConsistencyComparatorProps {
  medium: MediumDefinition;
  result: MediumGenerationResult;
  masterAnchorImage: string;
  product: ProductDNA;
  onClose: () => void;
}

export const ConsistencyComparator: React.FC<ConsistencyComparatorProps> = ({
  medium,
  result,
  masterAnchorImage,
  product,
  onClose,
}) => {
  return (
    <div
      id="comparator-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="comparator-modal-content"
        className="bg-[#0f0f0f] border border-white/20 w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
              <Split className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 font-['Syne',sans-serif]">
                CONSISTENCY INSPECTION MATRIX
                <span className="text-[10px] font-mono text-[#00FF41]">
                  · MASTER ANCHOR vs. {medium.name.toUpperCase()}
                </span>
              </h2>
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/40">VERIFY ZERO-HUMAN PRODUCT INVARIANCE ACROSS MEDIUMS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Canvas: Side by Side */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Master Anchor */}
            <div className="bg-[#0f0f0f] border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  01. MASTER STUDIO ANCHOR
                </span>
                <span className="text-[9px] text-white/40 font-mono uppercase">1:1 STUDIO PACKSHOT</span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-black border border-white/20">
                <img
                  src={masterAnchorImage}
                  alt="Master Anchor"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-white/40">BASELINE INVARIANT CONDITION</p>
            </div>

            {/* Right: Medium Generation */}
            <div className="bg-[#0f0f0f] border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00FF41]">
                  02. {medium.name.toUpperCase()}
                </span>
                <span className="text-[9px] text-[#00FF41] font-mono uppercase">{medium.aspectRatio} SCENE</span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-black border border-[#00FF41]/30 flex items-center justify-center">
                <img
                  src={result.imageUrl}
                  alt={`${medium.name} Shot`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-mono uppercase tracking-wider text-white/40">CONTEXTUAL STAGING VIA NANO-BANANA</p>
            </div>
          </div>

          {/* Consistency Audit Breakdown */}
          <div className="bg-[#0f0f0f] border border-white/10 p-5 space-y-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-white/10 pb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
              NANO-BANANA CONSISTENCY AUDIT CHECKLIST
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">FORM & SILHOUETTE</strong>
                  <span className="text-white/60 text-[11px]">{product.shapeSilhouette}</span>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">MATERIALS & TEXTURES</strong>
                  <span className="text-white/60 text-[11px]">{product.materials.join(', ')}</span>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">COLOR PALETTE</strong>
                  <span className="text-white/60 text-[11px]">
                    {product.primaryColor} / {product.accentColor}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">BRANDING MARK</strong>
                  <span className="text-white/60 text-[11px]">{product.brandingMark}</span>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">ZERO HUMANS RULE</strong>
                  <span className="text-white/60 text-[11px]">No people, faces, hands, or models</span>
                </div>
              </div>

              <div className="p-3 bg-black border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-[10px] uppercase font-black tracking-widest block">LIGHTING MATCH</strong>
                  <span className="text-white/60 text-[11px]">{medium.recommendedLighting}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
