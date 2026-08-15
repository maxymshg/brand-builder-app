import React, { useState } from 'react';
import { ProductDNA } from '../types';
import { Sparkles, Plus, X, Tag, Palette, Box, Type, Compass, EyeOff, Loader2, FileText } from 'lucide-react';

interface ProductFormProps {
  product: ProductDNA;
  onChange: (updated: ProductDNA) => void;
  onHarmonizeWithAI: () => Promise<void>;
  isHarmonizing: boolean;
}

const COMMON_MATERIALS = [
  'Unglazed ceramic',
  'Brushed brass',
  'Anodized titanium',
  'Ribbed fluted glass',
  'Smoked crystal',
  'Raw travertine stone',
  'Vegetable-tanned leather',
  'Sandblasted steel',
  'Walnut hardwood',
  'Debossed foil paper',
  'Matte rubberized silicone',
  'Frosted acrylic'
];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onHarmonizeWithAI,
  isHarmonizing,
}) => {
  const [newMaterial, setNewMaterial] = useState('');

  const handleAddMaterial = (mat: string) => {
    const trimmed = mat.trim();
    if (trimmed && !product.materials.includes(trimmed)) {
      onChange({
        ...product,
        materials: [...product.materials, trimmed],
      });
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    const updated = [...product.materials];
    updated.splice(index, 1);
    onChange({ ...product, materials: updated });
  };

  return (
    <div id="product-form-container" className="bg-[#0f0f0f] border border-white/10 p-5 text-white space-y-4">
      {/* Header & AI Harmonizer */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 block">
            IDENTITY SPECIFICATION
          </span>
          <h2 className="text-base font-black tracking-tight uppercase text-white font-['Syne',sans-serif]">
            Product DNA Tokens
          </h2>
        </div>

        <button
          id="harmonize-dna-btn"
          onClick={onHarmonizeWithAI}
          disabled={isHarmonizing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-white/5 text-[#00FF41] border border-[#00FF41]/40 text-[9px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          title="Enhance and harmonize Product DNA using Gemini AI"
        >
          {isHarmonizing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Harmonizing...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#00FF41]" />
              AI Harmonize
            </>
          )}
        </button>
      </div>

      {/* Product Synopsis Quote Card (From Bold Typography Layout) */}
      <div className="p-4 bg-white/5 border border-white/10">
        <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40 mb-1.5 block">
          Current Staging Spec
        </label>
        <p className="text-sm sm:text-base leading-snug font-medium italic text-white/90">
          "{product.shapeSilhouette || 'Sleek architectural product form.'} Crafted from {product.materials.join(', ')}. Defined in {product.primaryColor} with {product.accentColor} accents."
        </p>
      </div>

      {/* Product Name & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="product-name-input" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
            Product / Brand Name
          </label>
          <input
            id="product-name-input"
            type="text"
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            placeholder="e.g. Lumina Terra"
            className="w-full bg-black border border-white/20 px-3 py-2 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div>
          <label htmlFor="product-category-input" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
            Category
          </label>
          <input
            id="product-category-input"
            type="text"
            value={product.category}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            placeholder="e.g. Home & Wellness, Audio, Beverage"
            className="w-full bg-black border border-white/20 px-3 py-2 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label htmlFor="product-tagline-input" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
          Campaign Tagline / Headline
        </label>
        <input
          id="product-tagline-input"
          type="text"
          value={product.tagline}
          onChange={(e) => onChange({ ...product, tagline: e.target.value })}
          placeholder="e.g. Atmosphere in its purest form"
          className="w-full bg-black border border-white/20 px-3 py-2 text-xs font-semibold text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
        />
      </div>

      {/* Shape & Proportions */}
      <div>
        <label htmlFor="product-shape-input" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-white/40" />
          Form, Silhouette & Geometry
        </label>
        <textarea
          id="product-shape-input"
          rows={2}
          value={product.shapeSilhouette}
          onChange={(e) => onChange({ ...product, shapeSilhouette: e.target.value })}
          placeholder="Describe distinctive 3D contours, angles, ribbing, cap, nozzle, or proportions..."
          className="w-full bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white resize-none transition-colors"
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="product-primary-color" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-white/40" />
            Primary Tone & Finish
          </label>
          <input
            id="product-primary-color"
            type="text"
            value={product.primaryColor}
            onChange={(e) => onChange({ ...product, primaryColor: e.target.value })}
            placeholder="e.g. Matte Obsidian Ceramic"
            className="w-full bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div>
          <label htmlFor="product-accent-color" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-white/40" />
            Accent / Metallic Finish
          </label>
          <input
            id="product-accent-color"
            type="text"
            value={product.accentColor}
            onChange={(e) => onChange({ ...product, accentColor: e.target.value })}
            placeholder="e.g. Brushed Champagne Brass"
            className="w-full bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Tactile Materials */}
      <div>
        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-white/40" />
          Tactile Materials & Consistency Tokens
        </label>
        
        {/* Selected materials badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.materials.map((mat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-white/10 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1"
            >
              {mat}
              <button
                type="button"
                onClick={() => handleRemoveMaterial(idx)}
                className="text-white/40 hover:text-white transition-colors"
                title="Remove material"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Input to add material */}
        <div className="flex gap-2">
          <input
            id="new-material-input"
            type="text"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMaterial(newMaterial);
              }
            }}
            placeholder="Add custom finish or material token..."
            className="flex-1 bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white"
          />
          <button
            type="button"
            onClick={() => handleAddMaterial(newMaterial)}
            className="bg-white hover:bg-white/90 text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {/* Quick add popular chips */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 self-center mr-1">
            QUICK:
          </span>
          {COMMON_MATERIALS.filter((m) => !product.materials.includes(m))
            .slice(0, 4)
            .map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleAddMaterial(m)}
                className="text-[9px] uppercase font-bold tracking-wider bg-black hover:bg-white/10 text-white/60 hover:text-white border border-white/10 px-2 py-0.5 transition-colors"
              >
                + {m}
              </button>
            ))}
        </div>
      </div>

      {/* Branding Mark & Logo */}
      <div>
        <label htmlFor="product-branding-mark" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
          <Type className="w-3 h-3 text-white/40" />
          Branding Mark & Typography Placement
        </label>
        <textarea
          id="product-branding-mark"
          rows={2}
          value={product.brandingMark}
          onChange={(e) => onChange({ ...product, brandingMark: e.target.value })}
          placeholder="e.g. Debossed geometric spiral sun logo centered near base with crisp lowercase serif type 'lumina'..."
          className="w-full bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white resize-none transition-colors"
        />
      </div>

      {/* Mood / Aesthetic */}
      <div>
        <label htmlFor="product-aesthetic-mood" className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5">
          Aesthetic Mood & Design Atmosphere
        </label>
        <input
          id="product-aesthetic-mood"
          type="text"
          value={product.aestheticMood}
          onChange={(e) => onChange({ ...product, aestheticMood: e.target.value })}
          placeholder="e.g. Minimalist architectural brutality, pure light, zen geometry"
          className="w-full bg-black border border-white/20 px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors"
        />
      </div>
    </div>
  );
};

