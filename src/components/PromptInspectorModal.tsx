import React, { useState } from 'react';
import { MediumDefinition, ProductDNA } from '../types';
import { X, Copy, Check, Sparkles, Code2, EyeOff } from 'lucide-react';

interface PromptInspectorModalProps {
  medium: MediumDefinition;
  product: ProductDNA;
  masterAnchorImage?: string;
  onClose: () => void;
  onSavePrompt?: (mediumId: string, updatedPrompt: string) => void;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  medium,
  product,
  masterAnchorImage,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const materialsStr = (product.materials || []).join(', ');

  const fullPromptText = `
[MODEL ENGINE]: Nano-Banana (gemini-3.1-flash-lite-image)
[ASPECT RATIO]: ${medium.aspectRatio}
[MULTIMODAL CONDITIONING]: ${masterAnchorImage ? 'ENABLED (Master Anchor Base64 injected as visual condition)' : 'Text-only Specification'}

--- PROMPT STAGING INSTRUCTION ---
Transform and place this EXACT product into the following specific advertising medium scenario:
${medium.defaultPromptStaging}

--- PRODUCT IDENTITY CONSISTENCY TOKENS ---
- Product Name: ${product.name}
- Category: ${product.category}
- Specific Form & Silhouette: ${product.shapeSilhouette}
- Exact Materials & Textures: ${materialsStr}
- Primary Color Tone: ${product.primaryColor}
- Accent Metallic/Finish: ${product.accentColor}
- Branding/Logo Badge: ${product.brandingMark}
- Campaign Tagline: "${product.tagline}"

--- MANDATORY NEGATIVE CONSTRAINT ---
- ABSOLUTELY NO PEOPLE, NO HUMAN BEINGS, NO FACES, NO BODIES, NO HANDS, NO FINGERS, NO SILHOUETTES, NO PEDESTRIANS, NO DRIVERS, NO COMMUTERS.
- INANIMATE PRODUCT OBJECT AND ARCHITECTURAL/ENVIRONMENTAL SCENERY ONLY.
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="prompt-inspector-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="prompt-inspector-modal-content"
        className="bg-[#0f0f0f] border border-white/20 w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 font-['Syne',sans-serif]">
                PROMPT & INVARIANT INSPECTOR
                <span className="text-[10px] font-mono text-[#00FF41]">· {medium.name.toUpperCase()}</span>
              </h2>
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/40">DIRECTIVES DISPATCHED TO NANO-BANANA ENGINE</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'COPIED' : 'COPY PROMPT'}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-black border border-[#00FF41]/40 text-[#00FF41] text-[10px] font-mono uppercase tracking-wider">
            <EyeOff className="w-4 h-4 shrink-0 text-[#00FF41]" />
            <span>
              <strong>ZERO HUMANS CONSTRAINT:</strong> HARD-CONSTRAINED AGAINST GENERATING PEOPLE, FACES, LIMBS, OR SILHOUETTES.
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-black text-white mb-2 uppercase tracking-widest">
              DISPATCHED NANO-BANANA PROMPT PAYLOAD
            </label>
            <pre className="w-full bg-[#0f0f0f] border border-white/10 p-4 text-xs font-mono text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {fullPromptText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

