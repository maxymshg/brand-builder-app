/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductDNA, MediumDefinition, MediumGenerationResult, PresetBrand } from './types';
import { PRESET_BRANDS } from './data/presets';
import { MEDIUM_DEFINITIONS } from './data/mediums';
import { Header } from './components/Header';
import { ProductDescriptionInput } from './components/ProductDescriptionInput';
import { ProductForm } from './components/ProductForm';
import { MasterAnchorCard } from './components/MasterAnchorCard';
import { MediumGrid } from './components/MediumGrid';
import { MockupModal } from './components/MockupModal';
import { ConsistencyComparator } from './components/ConsistencyComparator';
import { BrandKitModal } from './components/BrandKitModal';
import { PromptInspectorModal } from './components/PromptInspectorModal';
import { AlertCircle, CheckCircle2, Sparkles, X, Info } from 'lucide-react';

export default function App() {
  const [product, setProduct] = useState<ProductDNA>(PRESET_BRANDS[0].product);
  const [masterAnchorImage, setMasterAnchorImage] = useState<string | undefined>(undefined);
  const [isAnchorLocked, setIsAnchorLocked] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image'>('gemini-3.1-flash-lite-image');

  // Generation status per medium
  const [results, setResults] = useState<Record<string, MediumGenerationResult>>({});
  const [generatingMediumIds, setGeneratingMediumIds] = useState<string[]>([]);
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);
  const [isHarmonizingDNA, setIsHarmonizingDNA] = useState(false);
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | undefined>(undefined);

  // Active Modals
  const [activeMockupMedium, setActiveMockupMedium] = useState<MediumDefinition | null>(null);
  const [activeComparatorMedium, setActiveComparatorMedium] = useState<MediumDefinition | null>(null);
  const [activePromptMedium, setActivePromptMedium] = useState<MediumDefinition | null>(null);
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);
  const [inspectedImage, setInspectedImage] = useState<{ url: string; title: string } | null>(null);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Resilient API call helper with automatic retry for network fluctuations or restarts
  const safeApiPost = async (url: string, body: any): Promise<any> => {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errText = await res.text();
          try {
            return JSON.parse(errText);
          } catch {
            throw new Error(`Server returned status ${res.status}`);
          }
        }
        return await res.json();
      } catch (err: any) {
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 600));
        } else {
          console.warn(`safeApiPost note for ${url}:`, err);
          return { success: false, error: err?.message || 'Network request failed' };
        }
      }
    }
    return { success: false, error: 'Request timeout' };
  };

  // Handle Preset Switching
  const handleSelectPreset = (preset: PresetBrand) => {
    setProduct(preset.product);
    setMasterAnchorImage(undefined);
    setResults({});
    showToast(`Loaded "${preset.name}" preset. Generate a Master Anchor or imagine mediums directly.`, 'info');
  };

  // 1. Harmonize / Extract DNA with Gemini Flash
  const handleHarmonizeDNA = async () => {
    setIsHarmonizingDNA(true);
    try {
      const data = await safeApiPost('/api/gemini/generate-dna', {
        prompt: `Enhance and polish the product design DNA for: ${product.name}, ${product.category}, ${product.tagline}`,
        existingProduct: product,
      });

      if (data.success && data.product) {
        setProduct(data.product);
        showToast('Product DNA enhanced and harmonized with Gemini Flash!', 'success');
      } else {
        showToast(data.error || 'DNA harmonized with studio specifications', 'info');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error communicating with AI backend', 'error');
    } finally {
      setIsHarmonizingDNA(false);
    }
  };

  // 1b. Parse DNA Only from Natural Language Description using Gemini Flash
  const handleExtractDNAOnly = async (description: string) => {
    if (!description.trim()) {
      showToast('Please enter a product description first.', 'error');
      return;
    }
    setIsProcessingPrompt(true);
    setProcessingStep('Extracting Product DNA tokens with Gemini Flash...');
    try {
      const data = await safeApiPost('/api/gemini/generate-dna', {
        prompt: description,
        existingProduct: product,
      });

      if (data.success && data.product) {
        setProduct(data.product);
        showToast(`Parsed Product DNA for "${data.product.name}" with Gemini Flash!`, 'success');
      } else {
        showToast(data.error || 'Failed to extract DNA tokens', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error communicating with Gemini Flash', 'error');
    } finally {
      setIsProcessingPrompt(false);
      setProcessingStep(undefined);
    }
  };

  // 2. Generate Master Product Anchor Shot using Nano-Banana
  const handleGenerateMasterAnchor = async () => {
    setIsGeneratingMaster(true);
    try {
      const data = await safeApiPost('/api/gemini/generate-master-anchor', {
        product,
        model: selectedModel,
      });

      if (data.success && data.imageUrl) {
        setMasterAnchorImage(data.imageUrl);
        setIsAnchorLocked(true);
        if (data.isFallback) {
          showToast(data.quotaNotice || 'Generated High-Fidelity Studio Anchor Asset matching Product DNA', 'info');
        } else {
          showToast('Master Product Anchor generated with Nano-Banana! Ready across all mediums.', 'success');
        }
      } else {
        showToast(data.error || 'Failed to generate master anchor image', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error generating master anchor', 'error');
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // 2b. Synthesize Product DNA + Master Visual Anchor directly from Description
  const handleSynthesizeAndGenerateMaster = async (description: string) => {
    if (!description.trim()) {
      showToast('Please enter a product description to synthesize.', 'error');
      return;
    }

    setIsProcessingPrompt(true);
    setProcessingStep('1/2: Parsing description & extracting Product DNA with Gemini Flash...');

    try {
      // Step 1: Extract DNA
      const dnaData = await safeApiPost('/api/gemini/generate-dna', {
        prompt: description,
        existingProduct: product,
      });

      let updatedProduct = product;
      if (dnaData.success && dnaData.product) {
        updatedProduct = dnaData.product;
        setProduct(updatedProduct);
      }

      // Step 2: Generate Master Visual Anchor with Nano-Banana
      setProcessingStep(`2/2: Synthesizing Master Packshot for "${updatedProduct.name}" with Nano-Banana...`);
      const anchorData = await safeApiPost('/api/gemini/generate-master-anchor', {
        product: updatedProduct,
        model: selectedModel,
      });

      if (anchorData.success && anchorData.imageUrl) {
        setMasterAnchorImage(anchorData.imageUrl);
        setIsAnchorLocked(true);
        if (anchorData.isFallback) {
          showToast(anchorData.quotaNotice || `Synthesized "${updatedProduct.name}" Studio Visual Asset!`, 'info');
        } else {
          showToast(`Synthesized "${updatedProduct.name}" Master Visual with Nano-Banana!`, 'success');
        }
      } else {
        showToast(anchorData.error || 'DNA parsed. Ready to generate anchor or mediums.', 'info');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error synthesizing product visuals', 'error');
    } finally {
      setIsProcessingPrompt(false);
      setProcessingStep(undefined);
    }
  };

  // 3. Generate a single medium shot using Nano-Banana
  const handleGenerateMedium = async (mediumId: MediumDefinition['id'], productOverride?: ProductDNA, anchorOverride?: string) => {
    const mediumDef = MEDIUM_DEFINITIONS.find((m) => m.id === mediumId);
    if (!mediumDef) return;

    const prod = productOverride || product;
    const anchorImg = anchorOverride !== undefined ? anchorOverride : (isAnchorLocked ? masterAnchorImage : undefined);

    setGeneratingMediumIds((prev) => [...prev, mediumId]);
    setResults((prev) => ({
      ...prev,
      [mediumId]: {
        mediumId,
        status: 'generating',
        aspectRatio: mediumDef.aspectRatio,
      },
    }));

    try {
      const data = await safeApiPost('/api/gemini/generate-medium', {
        mediumId,
        product: prod,
        masterAnchorImage: anchorImg,
        customStagingPrompt: mediumDef.defaultPromptStaging,
        aspectRatio: mediumDef.aspectRatio,
        model: selectedModel,
      });

      if (data.success && data.imageUrl) {
        setResults((prev) => ({
          ...prev,
          [mediumId]: {
            mediumId,
            status: 'success',
            imageUrl: data.imageUrl,
            generatedPrompt: data.promptUsed,
            aspectRatio: mediumDef.aspectRatio,
            timestamp: Date.now(),
          },
        }));
        if (data.isFallback) {
          showToast(`Rendered ${mediumDef.name} Staging Asset!`, 'info');
        } else {
          showToast(`Rendered ${mediumDef.name} with Nano-Banana!`, 'success');
        }
      } else {
        setResults((prev) => ({
          ...prev,
          [mediumId]: {
            mediumId,
            status: 'error',
            errorMessage: data.error,
            aspectRatio: mediumDef.aspectRatio,
          },
        }));
        showToast(data.error || `Failed to generate image for ${mediumDef.name}`, 'error');
      }
    } catch (err: any) {
      console.error(err);
      setResults((prev) => ({
        ...prev,
        [mediumId]: {
          mediumId,
          status: 'error',
          errorMessage: err.message,
          aspectRatio: mediumDef.aspectRatio,
        },
      }));
      showToast(`Error rendering ${mediumDef.name}`, 'error');
    } finally {
      setGeneratingMediumIds((prev) => prev.filter((id) => id !== mediumId));
    }
  };

  // 4. Batch Generate All Mediums
  const handleGenerateAll = async () => {
    // If no master anchor exists, optionally generate master anchor first for unified consistency
    let currentAnchor = masterAnchorImage;
    if (!currentAnchor) {
      setIsGeneratingMaster(true);
      try {
        const anchorData = await safeApiPost('/api/gemini/generate-master-anchor', {
          product,
          model: selectedModel,
        });
        if (anchorData.success && anchorData.imageUrl) {
          currentAnchor = anchorData.imageUrl;
          setMasterAnchorImage(currentAnchor);
          setIsAnchorLocked(true);
        }
      } catch (e) {
        console.error('Failed auto master anchor:', e);
      } finally {
        setIsGeneratingMaster(false);
      }
    }

    // Launch generations sequentially across mediums
    for (const med of MEDIUM_DEFINITIONS) {
      await handleGenerateMedium(med.id, product, currentAnchor);
    }
    showToast('All campaign mediums generated across outdoor, print, digital, and retail!', 'success');
  };

  // 4b. Synthesize All Mediums Directly from Description
  const handleSynthesizeAllMediums = async (description: string) => {
    if (!description.trim()) {
      showToast('Please enter a product description to synthesize.', 'error');
      return;
    }

    setIsProcessingPrompt(true);
    setProcessingStep('1/3: Extracting Product DNA with Gemini Flash...');

    try {
      // Step 1: Extract DNA
      const dnaRes = await fetch('/api/gemini/generate-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      });

      const dnaData = await dnaRes.json();
      let updatedProduct = product;
      if (dnaData.success && dnaData.product) {
        updatedProduct = dnaData.product;
        setProduct(updatedProduct);
      }

      // Step 2: Master Anchor
      setProcessingStep(`2/3: Synthesizing Master Packshot with Nano-Banana (${selectedModel})...`);
      let currentAnchor: string | undefined = undefined;
      const anchorRes = await fetch('/api/gemini/generate-master-anchor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: updatedProduct, model: selectedModel }),
      });
      const anchorData = await anchorRes.json();
      if (anchorData.success && anchorData.imageUrl) {
        currentAnchor = anchorData.imageUrl;
        setMasterAnchorImage(currentAnchor);
        setIsAnchorLocked(true);
      }

      // Step 3: All Mediums
      setProcessingStep('3/3: Rendering cross-medium campaign visuals with Nano-Banana...');
      for (const med of MEDIUM_DEFINITIONS) {
        await handleGenerateMedium(med.id, updatedProduct, currentAnchor);
      }

      showToast(`Campaign for "${updatedProduct.name}" synthesized across all mediums!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error generating full campaign from description', 'error');
    } finally {
      setIsProcessingPrompt(false);
      setProcessingStep(undefined);
    }
  };

  const isGeneratingAny = generatingMediumIds.length > 0 || isGeneratingMaster || isProcessingPrompt;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-[#00FF41] selection:text-black">
      {/* Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onGenerateAll={handleGenerateAll}
        onOpenBrandKit={() => setIsBrandKitOpen(true)}
        isGeneratingAny={isGeneratingAny}
        selectedModel={selectedModel}
        onChangeModel={setSelectedModel}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Dedicated Product Description Input Command Bar */}
        <ProductDescriptionInput
          onSynthesizeAndGenerateMaster={handleSynthesizeAndGenerateMaster}
          onSynthesizeAllMediums={handleSynthesizeAllMediums}
          onExtractDNAOnly={handleExtractDNAOnly}
          isProcessing={isProcessingPrompt}
          processingStep={processingStep}
          selectedVisualModel={selectedModel}
          onChangeVisualModel={setSelectedModel}
          currentProduct={product}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product DNA Configurator & Master Anchor */}
          <div className="lg:col-span-4 space-y-6">
            {/* Master Anchor Card */}
            <MasterAnchorCard
              product={product}
              masterAnchorImage={masterAnchorImage}
              isAnchorLocked={isAnchorLocked}
              onToggleLock={() => setIsAnchorLocked(!isAnchorLocked)}
              onGenerateAnchor={handleGenerateMasterAnchor}
              onUploadAnchor={(dataUrl) => {
                setMasterAnchorImage(dataUrl);
                setIsAnchorLocked(true);
                showToast('UPLOADED CUSTOM MASTER ANCHOR IMAGE', 'success');
              }}
              onInspectImage={(url, title) => setInspectedImage({ url, title })}
              isGenerating={isGeneratingMaster}
              selectedModel={selectedModel}
            />

            {/* Product DNA Editor */}
            <ProductForm
              product={product}
              onChange={setProduct}
              onHarmonizeWithAI={handleHarmonizeDNA}
              isHarmonizing={isHarmonizingDNA}
            />
          </div>

          {/* Right Column: Multi-Medium Visualization Canvas */}
          <div className="lg:col-span-8 space-y-6">
            <MediumGrid
              results={results}
              product={product}
              masterAnchorImage={masterAnchorImage}
              onGenerateMedium={handleGenerateMedium}
              onOpenMockup={(medium) => setActiveMockupMedium(medium)}
              onCompare={(medium) => setActiveComparatorMedium(medium)}
              onInspectPrompt={(medium) => setActivePromptMedium(medium)}
              generatingMediumIds={generatingMediumIds}
            />
          </div>
        </div>
      </main>

      {/* Ticker / Status Bar from Bold Typography Theme */}
      <footer className="bg-white text-black py-1.5 px-4 flex flex-wrap items-center justify-between text-[9px] font-black tracking-[0.2em] uppercase border-t border-black select-none">
        <span>STATUS: SYSTEM ACTIVE</span>
        <span className="hidden sm:inline">GEMINI FLASH + NANO-BANANA PIPELINE</span>
        <span className="hidden md:inline">INANIMATE CONSISTENCY PROTOCOL</span>
        <span>ZERO HUMANS ENFORCED</span>
      </footer>

      {/* Modals */}
      {activeMockupMedium && results[activeMockupMedium.id]?.imageUrl && (
        <MockupModal
          medium={activeMockupMedium}
          result={results[activeMockupMedium.id]}
          product={product}
          onClose={() => setActiveMockupMedium(null)}
        />
      )}

      {activeComparatorMedium &&
        masterAnchorImage &&
        results[activeComparatorMedium.id]?.imageUrl && (
          <ConsistencyComparator
            medium={activeComparatorMedium}
            result={results[activeComparatorMedium.id]}
            masterAnchorImage={masterAnchorImage}
            product={product}
            onClose={() => setActiveComparatorMedium(null)}
          />
        )}

      {activePromptMedium && (
        <PromptInspectorModal
          medium={activePromptMedium}
          product={product}
          masterAnchorImage={masterAnchorImage}
          onClose={() => setActivePromptMedium(null)}
        />
      )}

      {isBrandKitOpen && (
        <BrandKitModal
          product={product}
          masterAnchorImage={masterAnchorImage}
          results={results}
          onClose={() => setIsBrandKitOpen(false)}
        />
      )}

      {/* Full-Screen Image Lightbox */}
      {inspectedImage && (
        <div
          id="image-lightbox-overlay"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setInspectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-[#0f0f0f] border border-white/20 p-3 flex flex-col">
            <div className="p-2 flex items-center justify-between border-b border-white/10 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">{inspectedImage.title}</span>
              <button
                onClick={() => setInspectedImage(null)}
                className="p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={inspectedImage.url}
              alt={inspectedImage.title}
              className="max-h-[80vh] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div
          id="global-toast-banner"
          className={`fixed bottom-8 right-5 z-50 px-4 py-3 border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-black text-[#00FF41] border-[#00FF41]/40'
              : toast.type === 'error'
              ? 'bg-black text-rose-400 border-rose-600/60'
              : 'bg-black text-white border-white/30'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Sparkles className="w-4 h-4 text-white" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-white/40 hover:text-white ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

