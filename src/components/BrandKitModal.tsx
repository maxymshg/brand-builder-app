import React, { useState, useEffect } from 'react';
import { ProductDNA, MediumGenerationResult } from '../types';
import { MEDIUM_DEFINITIONS } from '../data/mediums';
import { X, Download, Copy, Check, Sparkles, BookOpen, Layers, EyeOff, Loader2 } from 'lucide-react';

interface BrandKitModalProps {
  product: ProductDNA;
  masterAnchorImage?: string;
  results: Record<string, MediumGenerationResult>;
  onClose: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  product,
  masterAnchorImage,
  results,
  onClose,
}) => {
  const [copyData, setCopyData] = useState<{
    billboardHeadline?: string;
    newspaperEditorial?: string;
    socialPostCaption?: string;
    magazinePullQuote?: string;
    transitAdText?: string;
  } | null>(null);
  const [isLoadingCopy, setIsLoadingCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCopy() {
      setIsLoadingCopy(true);
      try {
        const res = await fetch('/api/gemini/generate-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.copy) {
            setCopyData(data.copy);
            return;
          }
        }
      } catch (err) {
        console.warn('Notice fetching copy, applying editorial fallback:', err);
      } finally {
        setIsLoadingCopy(false);
      }

      // Default fallback copy if API was unreachable
      setCopyData({
        billboardHeadline: `${product?.name?.toUpperCase() || 'PRECISION'}. INVARIABLE LUXURY.`,
        newspaperEditorial: `In an era of disposable manufacturing, the ${product?.name || 'product'} establishes a new benchmark for structural purity and tactile craftsmanship. Every facet has been engineered for enduring permanence.`,
        socialPostCaption: `Architectural geometry meets zero-compromise finish. Explore the new monograph edition of ${product?.name || 'our latest design'}. #IndustrialDesign #Minimalism #ProductDNA`,
        magazinePullQuote: `"True luxury is not ornament, but the absolute invariance of form across every dimension."`,
        transitAdText: `NEXT GENERATION CRAFTSMANSHIP. AVAILABLE WORLDWIDE.`
      });
    }

    fetchCopy();
  }, [product]);

  const handleExportJSON = () => {
    const exportObject = {
      productDNA: product,
      masterAnchorImage,
      campaignMediums: (Object.entries(results) as [string, MediumGenerationResult][]).map(([mediumId, res]) => ({
        mediumId,
        mediumName: MEDIUM_DEFINITIONS.find((m) => m.id === mediumId)?.name,
        aspectRatio: res.aspectRatio,
        imageUrl: res.imageUrl,
        promptUsed: res.generatedPrompt,
      })),
      campaignCopy: copyData,
      exportedAt: new Date().toISOString(),
      modelEngine: 'Nano-Banana (gemini-3.1-flash-lite-image)',
      strictConstraint: 'Zero Humans in imagery',
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-brand-kit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyDNA = () => {
    const text = `
BRAND LOOKBOOK: ${product.name}
Category: ${product.category}
Tagline: "${product.tagline}"
Form & Silhouette: ${product.shapeSilhouette}
Materials: ${product.materials.join(', ')}
Palette: Primary ${product.primaryColor}, Accent ${product.accentColor}
Branding: ${product.brandingMark}
Aesthetic: ${product.aestheticMood}

CAMPAIGN COPY:
- Billboard Headline: ${copyData?.billboardHeadline || 'N/A'}
- Newspaper Editorial: ${copyData?.newspaperEditorial || 'N/A'}
- Social Caption: ${copyData?.socialPostCaption || 'N/A'}
- Magazine Quote: ${copyData?.magazinePullQuote || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="brand-kit-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="brand-kit-modal-content"
        className="bg-[#0f0f0f] border border-white/20 w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2 font-['Syne',sans-serif]">
                BRAND CAMPAIGN LOOKBOOK
                <span className="text-[10px] font-mono text-[#00FF41]">· {product.name.toUpperCase()}</span>
              </h2>
              <p className="text-[10px] uppercase font-mono tracking-widest text-white/40">CROSS-MEDIUM SPECIFICATION & COPY KIT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-brand-kit-summary"
              onClick={handleCopyDNA}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#00FF41]" /> : <Copy className="w-3 h-3" />}
              {copied ? 'COPIED SPECS' : 'COPY SPECS'}
            </button>

            <button
              id="download-brand-kit-json"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-white/90 text-black text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <Download className="w-3 h-3" />
              EXPORT JSON KIT
            </button>

            <button
              id="close-brand-kit-modal"
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white border border-white/10 hover:border-white/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black space-y-6">
          {/* Top Row: Product DNA Summary & Master Anchor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Master Anchor */}
            <div className="bg-[#0f0f0f] border border-white/10 p-4 space-y-3 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-white self-start">
                MASTER STUDIO ANCHOR
              </span>
              <div className="relative aspect-square w-full overflow-hidden bg-black border border-white/20">
                {masterAnchorImage ? (
                  <img
                    src={masterAnchorImage}
                    alt="Master Anchor"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] font-mono uppercase text-white/30">
                    NO ANCHOR GENERATED
                  </div>
                )}
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">BASELINE INVARIANT REFERENCE</span>
            </div>

            {/* Product Identity Overview */}
            <div className="md:col-span-2 bg-[#0f0f0f] border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white font-['Syne',sans-serif]">{product.name}</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#00FF41]">{product.category}</p>
                </div>
                <span className="text-xs italic text-white/60 font-serif">"{product.tagline}"</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-black border border-white/10">
                  <span className="text-white/40 block text-[9px] uppercase font-black tracking-widest mb-1">SILHOUETTE</span>
                  <span className="text-white text-xs">{product.shapeSilhouette}</span>
                </div>

                <div className="p-3 bg-black border border-white/10">
                  <span className="text-white/40 block text-[9px] uppercase font-black tracking-widest mb-1">MATERIALS</span>
                  <span className="text-white text-xs">{product.materials.join(', ')}</span>
                </div>

                <div className="p-3 bg-black border border-white/10">
                  <span className="text-white/40 block text-[9px] uppercase font-black tracking-widest mb-1">PALETTE</span>
                  <span className="text-white text-xs">
                    {product.primaryColor} · {product.accentColor}
                  </span>
                </div>

                <div className="p-3 bg-black border border-white/10">
                  <span className="text-white/40 block text-[9px] uppercase font-black tracking-widest mb-1">BRANDING MARK</span>
                  <span className="text-white text-xs">{product.brandingMark}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Campaign Copy Matrix */}
          <div className="bg-[#0f0f0f] border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                CROSS-MEDIUM COPYWRITING MATRIX
              </h3>
              {isLoadingCopy && (
                <span className="text-[10px] font-mono text-[#00FF41] flex items-center gap-1 uppercase">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  SYNTHESIZING COPY...
                </span>
              )}
            </div>

            {copyData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-mono font-bold block">
                    BILLBOARD HEADLINE
                  </span>
                  <p className="text-base font-black text-white uppercase tracking-tight font-['Syne',sans-serif]">{copyData.billboardHeadline}</p>
                </div>

                <div className="p-3.5 bg-black border border-white/10 space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-mono font-bold block">
                    MAGAZINE EDITORIAL PULL QUOTE
                  </span>
                  <p className="text-xs italic text-white/90 font-serif leading-relaxed">"{copyData.magazinePullQuote}"</p>
                </div>

                <div className="p-3.5 bg-black border border-white/10 space-y-1 md:col-span-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-mono font-bold block">
                    NEWSPAPER JOURNALISTIC EXCERPT
                  </span>
                  <p className="text-xs text-white/80 font-serif leading-relaxed">
                    {copyData.newspaperEditorial}
                  </p>
                </div>

                <div className="p-3.5 bg-black border border-white/10 space-y-1 md:col-span-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#00FF41] font-mono font-bold block">
                    SOCIAL MEDIA LAUNCH CAPTION
                  </span>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    {copyData.socialPostCaption}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-[10px] font-mono uppercase text-white/30">
                SYNTHESIZING TAILORED CAMPAIGN COPY...
              </div>
            )}
          </div>

          {/* Gallery of Visualized Mediums */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-white" />
              SYNTHESIZED CAMPAIGN ASSETS
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {MEDIUM_DEFINITIONS.map((medium) => {
                const res = results[medium.id];
                return (
                  <div
                    key={medium.id}
                    className="bg-[#0f0f0f] border border-white/10 p-3 space-y-2 flex flex-col justify-between"
                  >
                    <div className="relative aspect-square bg-black overflow-hidden border border-white/10 flex items-center justify-center">
                      {res?.imageUrl ? (
                        <img
                          src={res.imageUrl}
                          alt={medium.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-[9px] font-mono uppercase text-white/30">PENDING</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-wide truncate">{medium.name}</h4>
                      <span className="text-[9px] font-mono text-white/40 uppercase">{medium.aspectRatio}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

