import React from 'react';
import {
  MediumDefinition,
  MediumGenerationResult,
  ProductDNA,
} from '../types';
import {
  Tv,
  Newspaper,
  Smartphone,
  BookOpen,
  Compass,
  Sparkles,
  Package,
  Train,
  Maximize2,
  RefreshCw,
  Split,
  Code2,
  Download,
  AlertCircle,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

interface MediumCardProps {
  medium: MediumDefinition;
  result?: MediumGenerationResult;
  product: ProductDNA;
  masterAnchorImage?: string;
  onGenerate: (mediumId: MediumDefinition['id']) => void;
  onOpenMockup: (medium: MediumDefinition) => void;
  onCompare: (medium: MediumDefinition) => void;
  onInspectPrompt: (medium: MediumDefinition) => void;
  isGeneratingThis: boolean;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv className="w-3.5 h-3.5" />,
  Newspaper: <Newspaper className="w-3.5 h-3.5" />,
  Smartphone: <Smartphone className="w-3.5 h-3.5" />,
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Compass: <Compass className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Package: <Package className="w-3.5 h-3.5" />,
  Train: <Train className="w-3.5 h-3.5" />,
};

export const MediumCard: React.FC<MediumCardProps> = ({
  medium,
  result,
  product,
  masterAnchorImage,
  onGenerate,
  onOpenMockup,
  onCompare,
  onInspectPrompt,
  isGeneratingThis,
}) => {
  const hasImage = !!result?.imageUrl;
  const isError = result?.status === 'error';

  const downloadImage = () => {
    if (!result?.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${medium.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Determine container aspect ratio class
  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div
      id={`medium-card-${medium.id}`}
      className="bg-[#0f0f0f] border border-white/10 text-white flex flex-col justify-between hover:border-white/30 transition-all group"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-white/10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black border border-white/20 flex items-center justify-center text-white">
            {ICONS_MAP[medium.iconName] || <Tv className="w-3.5 h-3.5" />}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white font-['Syne',sans-serif]">
              {medium.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/70 font-bold">
                {medium.aspectRatio}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">
                {medium.category}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div>
          {hasImage && (
            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#00FF41] bg-[#00FF41]/10 border border-[#00FF41]/30 px-2 py-0.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41]"></span>
              RENDERED
            </span>
          )}
          {isError && (
            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 uppercase">
              <AlertCircle className="w-3 h-3" />
              FAILED
            </span>
          )}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="p-4 flex-1 flex flex-col justify-center">
        <div
          className={`relative w-full ${getAspectClass(
            medium.aspectRatio
          )} overflow-hidden bg-black border border-white/10 flex items-center justify-center`}
        >
          {hasImage ? (
            <>
              <img
                src={result?.imageUrl}
                alt={`${product.name} across ${medium.name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />

              {/* Overlay Hover Actions */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <button
                  id={`open-mockup-${medium.id}`}
                  onClick={() => onOpenMockup(medium)}
                  className="w-full max-w-[170px] inline-flex items-center justify-center gap-1.5 bg-white hover:bg-white/90 text-black font-black text-[10px] uppercase tracking-widest py-2 shadow transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Interactive Mockup
                </button>

                <div className="flex items-center gap-2 w-full max-w-[170px]">
                  {masterAnchorImage && (
                    <button
                      id={`compare-${medium.id}`}
                      onClick={() => onCompare(medium)}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-transparent hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest py-2 border border-white/30 transition-colors"
                      title="Compare side-by-side with Master Product Anchor"
                    >
                      <Split className="w-3.5 h-3.5" />
                      Compare
                    </button>
                  )}

                  <button
                    id={`download-${medium.id}`}
                    onClick={downloadImage}
                    className="p-2 bg-transparent hover:bg-white/10 text-white border border-white/30 transition-colors"
                    title="Download high-resolution image"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Zero Humans guarantee watermark */}
              <div className="absolute bottom-2 left-2 pointer-events-none bg-black/90 border border-white/20 text-[9px] font-mono uppercase tracking-widest text-[#00FF41] px-2 py-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#00FF41]"></span>
                ZERO HUMANS
              </div>
            </>
          ) : (
            <div className="text-center p-4 space-y-2">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center mx-auto text-white/30">
                {ICONS_MAP[medium.iconName] || <Tv className="w-3.5 h-3.5" />}
              </div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 max-w-[200px] leading-relaxed">
                {medium.description}
              </p>
            </div>
          )}

          {/* Loading Shimmer / Spinner */}
          {isGeneratingThis && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2.5 p-4 z-10">
              <div className="w-8 h-8 border-2 border-white/20 border-t-[#00FF41] animate-spin" />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">
                  IMAGINING ON {medium.name.toUpperCase()}
                </p>
                <p className="text-[9px] font-mono text-[#00FF41] mt-0.5">NANO-BANANA PIPELINE</p>
              </div>
            </div>
          )}
        </div>

        {/* Medium Environmental Details */}
        <div className="mt-2.5 text-[10px] uppercase tracking-wider text-white/40 line-clamp-1">
          <span className="text-white/60 font-bold">Setting:</span> {medium.environmentDescription}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between gap-2">
        <button
          id={`inspect-prompt-${medium.id}`}
          onClick={() => onInspectPrompt(medium)}
          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          title="Inspect and edit Nano-Banana generation prompt"
        >
          <Code2 className="w-3.5 h-3.5" />
          Prompt
        </button>

        <button
          id={`generate-btn-${medium.id}`}
          onClick={() => onGenerate(medium.id)}
          disabled={isGeneratingThis}
          className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3.5 py-2 transition-all ${
            hasImage
              ? 'bg-transparent text-white border border-white/20 hover:bg-white/10'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {isGeneratingThis ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : hasImage ? (
            <RefreshCw className="w-3 h-3" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {hasImage ? 'Regenerate' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

