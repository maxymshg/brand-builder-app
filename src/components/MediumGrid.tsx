import React, { useState } from 'react';
import { MediumDefinition, MediumGenerationResult, ProductDNA } from '../types';
import { MEDIUM_DEFINITIONS } from '../data/mediums';
import { MediumCard } from './MediumCard';
import { Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface MediumGridProps {
  results: Record<string, MediumGenerationResult>;
  product: ProductDNA;
  masterAnchorImage?: string;
  onGenerateMedium: (mediumId: MediumDefinition['id']) => void;
  onOpenMockup: (medium: MediumDefinition) => void;
  onCompare: (medium: MediumDefinition) => void;
  onInspectPrompt: (medium: MediumDefinition) => void;
  generatingMediumIds: string[];
}

export const MediumGrid: React.FC<MediumGridProps> = ({
  results,
  product,
  masterAnchorImage,
  onGenerateMedium,
  onOpenMockup,
  onCompare,
  onInspectPrompt,
  generatingMediumIds,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'outdoor' | 'print' | 'digital' | 'retail'>('all');

  const filteredMediums = MEDIUM_DEFINITIONS.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.category === activeFilter;
  });

  const generatedCount = (Object.values(results) as MediumGenerationResult[]).filter(
    (r) => r.status === 'success' && r.imageUrl
  ).length;

  return (
    <div id="medium-grid-container" className="space-y-4">
      {/* Category Tabs & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0f0f0f] border border-white/10 p-4">
        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-white/40" />
            FILTER MEDIUM:
          </span>
          {(['all', 'outdoor', 'print', 'digital', 'retail'] as const).map((filter) => {
            const count =
              filter === 'all'
                ? MEDIUM_DEFINITIONS.length
                : MEDIUM_DEFINITIONS.filter((m) => m.category === filter).length;
            return (
              <button
                key={filter}
                id={`filter-tab-${filter}`}
                onClick={() => setActiveFilter(filter)}
                className={`text-[9px] px-3 py-1.5 uppercase font-bold tracking-widest transition-all ${
                  activeFilter === filter
                    ? 'bg-white text-black font-black'
                    : 'bg-black text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {filter} [{count}]
              </button>
            );
          })}
        </div>

        {/* Completion Counter */}
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00FF41]"></span>
            <strong className="text-white font-bold">{generatedCount}</strong> / {MEDIUM_DEFINITIONS.length} MEDIUMS SYNTHESIZED
          </span>
        </div>
      </div>

      {/* Grid of Medium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredMediums.map((medium) => (
          <MediumCard
            key={medium.id}
            medium={medium}
            result={results[medium.id]}
            product={product}
            masterAnchorImage={masterAnchorImage}
            onGenerate={onGenerateMedium}
            onOpenMockup={onOpenMockup}
            onCompare={onCompare}
            onInspectPrompt={onInspectPrompt}
            isGeneratingThis={generatingMediumIds.includes(medium.id)}
          />
        ))}
      </div>
    </div>
  );
};

