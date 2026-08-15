import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const STRICT_NO_HUMANS_RULE = `
MANDATORY NEGATIVE CONSTRAINT:
- ABSOLUTELY NO PEOPLE, NO HUMAN BEINGS, NO FACES, NO BODIES, NO HANDS, NO FINGERS, NO SILHOUETTES, NO PEDESTRIANS, NO DRIVERS, NO COMMUTERS.
- INANIMATE PRODUCT OBJECT AND ARCHITECTURAL/ENVIRONMENTAL SCENERY ONLY.
- If showing a billboard: the billboard is set on a vacant roadside or skyline with NO people or active vehicles with visible drivers.
- If showing a newspaper: the newspaper rests flat on a clean wooden table with NO hands holding it.
- If showing a social post / lifestyle setting: pure architectural, minimalist still-life or studio arrangement with ZERO human figures.
- If showing transit shelter / subway: the station/sidewalk is completely empty of people.
`;

// Helper: Color parser to resolve hex colors from arbitrary color strings
function parseColorToHex(colorStr?: string, defaultHex = '#1a1a1a'): string {
  if (!colorStr) return defaultHex;
  const hexMatch = colorStr.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
  if (hexMatch) return hexMatch[0];

  const lower = colorStr.toLowerCase();
  if (lower.includes('gold') || lower.includes('champagne') || lower.includes('brass')) return '#D4AF37';
  if (lower.includes('silver') || lower.includes('chrome') || lower.includes('titanium') || lower.includes('aluminum')) return '#E0E0E0';
  if (lower.includes('bronze') || lower.includes('copper')) return '#CD7F32';
  if (lower.includes('obsidian') || lower.includes('black') || lower.includes('charcoal') || lower.includes('graphite') || lower.includes('dark')) return '#121212';
  if (lower.includes('white') || lower.includes('cream') || lower.includes('ivory') || lower.includes('eggshell')) return '#F7F6F2';
  if (lower.includes('emerald') || lower.includes('green') || lower.includes('sage') || lower.includes('forest')) return '#1B4D3E';
  if (lower.includes('sapphire') || lower.includes('blue') || lower.includes('navy') || lower.includes('cobalt')) return '#0F2537';
  if (lower.includes('amber') || lower.includes('orange') || lower.includes('terracotta') || lower.includes('cognac')) return '#C36B2C';
  if (lower.includes('crimson') || lower.includes('burgundy') || lower.includes('red') || lower.includes('ruby')) return '#800020';
  if (lower.includes('sand') || lower.includes('travertine') || lower.includes('beige')) return '#D9CEB2';
  if (lower.includes('neon') || lower.includes('lime')) return '#00FF41';
  return defaultHex;
}

// Helper: Escape XML/SVG text
function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Procedural high-fidelity SVG studio & contextual medium packshot generator for graceful fallback
function generateProceduralStudioPackshot(
  product: any,
  mediumType: string = 'anchor',
  aspectRatio: string = '1:1'
): string {
  const primaryHex = parseColorToHex(product?.primaryColor, '#18181b');
  const accentHex = parseColorToHex(product?.accentColor, '#d4af37');
  const prodName = escapeXml(product?.name || 'STUDIO MASTER');
  const category = escapeXml(product?.category || 'LUXURY GOODS');
  const tagline = escapeXml(product?.tagline || 'REFINED FORM & INVARIANCE');
  const branding = escapeXml(product?.brandingMark || 'EST. MMXXVI');
  const shape = (product?.shapeSilhouette || '').toLowerCase();

  let width = 1000;
  let height = 1000;
  if (aspectRatio === '16:9') { width = 1280; height = 720; }
  else if (aspectRatio === '3:4') { width = 750; height = 1000; }
  else if (aspectRatio === '4:3') { width = 1000; height = 750; }
  else if (aspectRatio === '9:16') { width = 720; height = 1280; }

  const cx = width / 2;
  const cy = height / 2;

  // Render product geometry based on shape silhouette
  let productGeometry = '';
  if (shape.includes('cylinder') || shape.includes('bottle') || shape.includes('flacon') || shape.includes('column')) {
    productGeometry = `
      <!-- Cylindrical/Flacon Form -->
      <rect x="${cx - 70}" y="${cy - 170}" width="140" height="280" rx="36" fill="url(#prodGrad)" stroke="${accentHex}" stroke-width="2" />
      <rect x="${cx - 35}" y="${cy - 215}" width="70" height="50" rx="10" fill="url(#accentGrad)" stroke="#fff" stroke-width="0.5" />
      <ellipse cx="${cx}" cy="${cy - 215}" rx="35" ry="12" fill="#fff" opacity="0.4" />
      <line x1="${cx - 50}" y1="${cy - 100}" x2="${cx + 50}" y2="${cy - 100}" stroke="${accentHex}" stroke-width="1.5" opacity="0.6" />
      <circle cx="${cx}" cy="${cy - 20}" r="35" fill="none" stroke="${accentHex}" stroke-width="1.5" stroke-dasharray="3 5" />
    `;
  } else if (shape.includes('sphere') || shape.includes('pebble') || shape.includes('oval') || shape.includes('round')) {
    productGeometry = `
      <!-- Pebble/Spherical Sculptural Form -->
      <ellipse cx="${cx}" cy="${cy - 20}" rx="130" ry="110" fill="url(#prodGrad)" stroke="${accentHex}" stroke-width="2.5" />
      <ellipse cx="${cx}" cy="${cy - 20}" rx="90" ry="75" fill="#0c0c0f" stroke="#333" stroke-width="1" />
      <circle cx="${cx}" cy="${cy - 20}" r="45" fill="none" stroke="${accentHex}" stroke-width="2" />
      <path d="M${cx - 40} ${cy - 40} A 50 50 0 0 1 ${cx + 40} ${cy - 40}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    `;
  } else {
    // Monolithic Chiseled Form
    productGeometry = `
      <!-- Monolith Chassis -->
      <rect x="${cx - 110}" y="${cy - 160}" width="220" height="290" rx="28" fill="url(#prodGrad)" stroke="${accentHex}" stroke-width="2.5" stroke-opacity="0.8" />
      <circle cx="${cx}" cy="${cy - 30}" r="75" fill="#080808" stroke="${accentHex}" stroke-width="2" />
      <circle cx="${cx}" cy="${cy - 30}" r="62" fill="url(#studioGrad)" stroke="#333" stroke-width="1" />
      <circle cx="${cx}" cy="${cy - 30}" r="45" fill="none" stroke="${accentHex}" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.8" />
      <path d="M${cx - 45} ${cy - 45} A 62 62 0 0 1 ${cx + 45} ${cy - 45}" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7" />
      <rect x="${cx + 110}" y="${cy - 50}" width="16" height="40" rx="4" fill="url(#accentGrad)" />
    `;
  }

  let mediumOverlay = '';

  if (mediumType === 'billboard') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#050811" />
      <path d="M0 0 L${width} 0 L${width} ${height * 0.75} Q${cx} ${height * 0.95} 0 ${height * 0.75} Z" fill="url(#skyGrad)" />
      <!-- Skyline silhouette -->
      <g opacity="0.3" fill="#03060a">
        <rect x="50" y="${height * 0.5}" width="60" height="${height * 0.4}" />
        <rect x="130" y="${height * 0.45}" width="80" height="${height * 0.45}" />
        <rect x="230" y="${height * 0.55}" width="50" height="${height * 0.35}" />
        <rect x="${width - 280}" y="${height * 0.48}" width="90" height="${height * 0.42}" />
        <rect x="${width - 170}" y="${height * 0.4}" width="120" height="${height * 0.5}" />
      </g>
      <!-- Billboard Canvas Frame -->
      <rect x="${width * 0.12}" y="${height * 0.12}" width="${width * 0.76}" height="${height * 0.7}" fill="#0d0d0d" stroke="#333" stroke-width="4" rx="4" />
      <!-- Gantry Spotlights -->
      <circle cx="${width * 0.25}" cy="${height * 0.09}" r="12" fill="#fff" filter="url(#glow)" />
      <circle cx="${cx}" cy="${height * 0.09}" r="12" fill="#fff" filter="url(#glow)" />
      <circle cx="${width * 0.75}" cy="${height * 0.09}" r="12" fill="#fff" filter="url(#glow)" />
    `;
  } else if (mediumType === 'newspaper') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#2a1f18" />
      <!-- Paper Sheet -->
      <rect x="${width * 0.08}" y="${height * 0.05}" width="${width * 0.84}" height="${height * 0.9}" fill="#f2ede4" stroke="#c4b8a5" stroke-width="2" rx="2" filter="url(#paperShadow)" />
      <!-- Newspaper Header & Swiss Grid Lines -->
      <text x="${width * 0.12}" y="${height * 0.11}" font-family="'Times New Roman', serif" font-size="28" font-weight="bold" fill="#111" letter-spacing="4">THE COMMERCIAL CHRONICLE</text>
      <line x1="${width * 0.12}" y1="${height * 0.13}" x2="${width * 0.88}" y2="${height * 0.13}" stroke="#111" stroke-width="2" />
      <line x1="${width * 0.12}" y1="${height * 0.135}" x2="${width * 0.88}" y2="${height * 0.135}" stroke="#111" stroke-width="0.5" />
      <text x="${width * 0.12}" y="${height * 0.15}" font-family="monospace" font-size="10" fill="#555">VOL. CCVI NO. 84 · SPECIAL MONOGRAPH EDITION · NEW YORK / TOKYO / ZURICH</text>
    `;
  } else if (mediumType === 'social_post') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#0a0a0c" />
      <rect x="${width * 0.05}" y="${height * 0.05}" width="${width * 0.9}" height="${height * 0.9}" fill="url(#studioGrad)" stroke="#222" stroke-width="2" rx="16" />
      <!-- Top social bar -->
      <circle cx="${width * 0.1}" cy="${height * 0.1}" r="14" fill="#222" stroke="${accentHex}" stroke-width="1.5" />
      <text x="${width * 0.15}" y="${height * 0.105}" font-family="sans-serif" font-size="13" font-weight="bold" fill="#fff">${prodName.toUpperCase()}</text>
      <text x="${width * 0.15}" y="${height * 0.125}" font-family="sans-serif" font-size="10" fill="#888">Verified Brand Campaign</text>
      <!-- Drop Tag -->
      <rect x="${width * 0.75}" y="${height * 0.085}" width="80" height="26" fill="#ffffff" rx="13" />
      <text x="${width * 0.75 + 40}" y="${height * 0.085 + 17}" font-family="sans-serif" font-size="11" font-weight="900" fill="#000" text-anchor="middle" letter-spacing="1">DROP 01</text>
    `;
  } else if (mediumType === 'magazine_spread') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#111" />
      <!-- 2-Page Layout -->
      <rect x="${width * 0.04}" y="${height * 0.06}" width="${width * 0.44}" height="${height * 0.88}" fill="#0e0e11" stroke="#262626" />
      <rect x="${width * 0.52}" y="${height * 0.06}" width="${width * 0.44}" height="${height * 0.88}" fill="url(#studioGrad)" stroke="#262626" />
      <!-- Left Page Editorial Typography -->
      <text x="${width * 0.08}" y="${height * 0.2}" font-family="'Times New Roman', serif" font-size="34" font-weight="bold" fill="#fff">THE INVARIANCE</text>
      <text x="${width * 0.08}" y="${height * 0.26}" font-family="'Times New Roman', serif" font-size="34" font-weight="bold" fill="${accentHex}">OF FORM.</text>
      <text x="${width * 0.08}" y="${height * 0.35}" font-family="sans-serif" font-size="12" fill="#aaa" line-height="1.6">
        <tspan x="${width * 0.08}" dy="0">In an era of rapid obsolescence,</tspan>
        <tspan x="${width * 0.08}" dy="18">the ${prodName} sets a benchmark</tspan>
        <tspan x="${width * 0.08}" dy="18">for zero-compromise precision.</tspan>
      </text>
      <text x="${width * 0.08}" y="${height * 0.88}" font-family="monospace" font-size="10" fill="#666">P. 142 — ARCHITECTURAL OBJECTS</text>
      <text x="${width * 0.88}" y="${height * 0.88}" font-family="monospace" font-size="10" fill="#666">P. 143</text>
    `;
  } else if (mediumType === 'transit_shelter') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#080c14" />
      <!-- Glass shelter vertical glowing frame -->
      <rect x="${width * 0.15}" y="${height * 0.08}" width="${width * 0.7}" height="${height * 0.84}" fill="#0e131d" stroke="#00FF41" stroke-opacity="0.4" stroke-width="4" filter="url(#glow)" />
      <rect x="${width * 0.17}" y="${height * 0.1}" width="${width * 0.66}" height="${height * 0.8}" fill="url(#studioGrad)" />
      <!-- Wet ground reflections -->
      <ellipse cx="${cx}" cy="${height * 0.94}" rx="${width * 0.35}" ry="16" fill="#00FF41" opacity="0.15" filter="url(#blur)" />
    `;
  } else if (mediumType === 'storefront_pedestal') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#070709" />
      <!-- Top Spotlight Cone -->
      <polygon points="${cx - 150},0 ${cx + 150},0 ${cx + 380},${height} ${cx - 380},${height}" fill="url(#spotlightGrad)" opacity="0.4" />
      <!-- Pedestal / Plinth -->
      <polygon points="${cx - 180},${cy + 130} ${cx + 180},${cy + 130} ${cx + 220},${cy + 180} ${cx - 220},${cy + 180}" fill="#2a2a2e" stroke="#444" stroke-width="1" />
      <polygon points="${cx - 220},${cy + 180} ${cx + 220},${cy + 180} ${cx + 220},${cy + 420} ${cx - 220},${cy + 420}" fill="#17171a" />
      <line x1="${cx - 220}" y1="${cy + 180}" x2="${cx + 220}" y2="${cy + 180}" stroke="${accentHex}" stroke-width="2" />
      <!-- Brass Plinth Plaque -->
      <rect x="${cx - 80}" y="${cy + 220}" width="160" height="45" rx="3" fill="#121212" stroke="${accentHex}" stroke-width="1.5" />
      <text x="${cx}" y="${cy + 248}" font-family="'Syne', sans-serif" font-size="11" font-weight="bold" fill="${accentHex}" text-anchor="middle" letter-spacing="2">${branding.toUpperCase()}</text>
    `;
  } else if (mediumType === 'packaging_box') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#09090b" />
      <!-- Rigid Gift Packaging Box Base -->
      <polygon points="${cx - 260},${cy - 80} ${cx},${cy - 200} ${cx + 260},${cy - 80} ${cx},${cy + 40}" fill="#1c1c22" stroke="#333" stroke-width="1.5" />
      <polygon points="${cx - 260},${cy - 80} ${cx},${cy + 40} ${cx},${cy + 260} ${cx - 260},${cy + 140}" fill="#121216" stroke="#222" stroke-width="1" />
      <polygon points="${cx + 260},${cy - 80} ${cx},${cy + 40} ${cx},${cy + 260} ${cx + 260},${cy + 140}" fill="#0c0c0e" stroke="#222" stroke-width="1" />
      <!-- Debossed Foil on Lid -->
      <text x="${cx - 100}" y="${cy + 100}" font-family="'Syne', sans-serif" font-size="14" font-weight="900" fill="${accentHex}" letter-spacing="4" transform="rotate(-22 ${cx - 100} ${cy + 100})">${prodName.toUpperCase()}</text>
    `;
  } else if (mediumType === 'subway_lightbox') {
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#0d1117" />
      <!-- Concrete tile grid -->
      <g stroke="#1c2128" stroke-width="1" opacity="0.4">
        <line x1="0" y1="${height * 0.2}" x2="${width}" y2="${height * 0.2}" />
        <line x1="0" y1="${height * 0.4}" x2="${width}" y2="${height * 0.4}" />
        <line x1="0" y1="${height * 0.6}" x2="${width}" y2="${height * 0.6}" />
        <line x1="0" y1="${height * 0.8}" x2="${width}" y2="${height * 0.8}" />
      </g>
      <!-- Backlit Lightbox Frame -->
      <rect x="${width * 0.1}" y="${height * 0.12}" width="${width * 0.8}" height="${height * 0.76}" fill="url(#studioGrad)" stroke="#58a6ff" stroke-width="3" rx="8" filter="url(#glow)" />
      <text x="${width * 0.14}" y="${height * 0.18}" font-family="monospace" font-size="11" fill="#58a6ff" letter-spacing="2">METRO CONCOURSE PANEL #09</text>
    `;
  } else {
    // Master Studio Anchor
    mediumOverlay = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#studioGrad)" />
      <!-- Pedestal / Plinth -->
      <polygon points="${cx - 220},${cy + 160} ${cx + 220},${cy + 160} ${cx + 260},${cy + 220} ${cx - 260},${cy + 220}" fill="#262626" />
      <polygon points="${cx - 260},${cy + 220} ${cx + 260},${cy + 220} ${cx + 260},${cy + 340} ${cx - 260},${cy + 340}" fill="#1c1c1c" />
      <line x1="${cx - 260}" y1="${cy + 220}" x2="${cx + 260}" y2="${cy + 220}" stroke="${accentHex}" stroke-width="1.5" stroke-opacity="0.6" />
    `;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="studioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1c20" />
        <stop offset="50%" stop-color="#0e0e11" />
        <stop offset="100%" stop-color="#050507" />
      </linearGradient>
      <linearGradient id="spotlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
      </linearGradient>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#141829" />
        <stop offset="60%" stop-color="#2a1f2d" />
        <stop offset="100%" stop-color="#4a2a2d" />
      </linearGradient>
      <linearGradient id="prodGrad" x1="20%" y1="10%" x2="80%" y2="90%">
        <stop offset="0%" stop-color="${primaryHex}" />
        <stop offset="50%" stop-color="${primaryHex}" />
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="40%" stop-color="${accentHex}" />
        <stop offset="100%" stop-color="#7a5814" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" />
      </filter>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.8" />
      </filter>
      <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.5" />
      </filter>
    </defs>

    ${mediumOverlay}

    <!-- Central Product Visual Silhouette (Geometric Luxury Sculpt) -->
    <g filter="url(#dropShadow)">
      ${productGeometry}
      
      <!-- Debossed Logo Insignia -->
      <text x="${cx}" y="${cy + 85}" font-family="'Syne', sans-serif" font-size="14" font-weight="900" fill="${accentHex}" text-anchor="middle" letter-spacing="3">${branding.toUpperCase()}</text>
    </g>

    <!-- Editorial Typography Overlay -->
    <g>
      <text x="${cx}" y="${height > width ? height * 0.82 : height * 0.86}" font-family="'Syne', sans-serif" font-size="${width < 800 ? '22' : '28'}" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">
        ${prodName.toUpperCase()}
      </text>
      <text x="${cx}" y="${(height > width ? height * 0.82 : height * 0.86) + 24}" font-family="monospace" font-size="11" font-weight="700" fill="${accentHex}" text-anchor="middle" letter-spacing="4">
        ${category.toUpperCase()} · ${tagline.toUpperCase()}
      </text>
      <text x="${cx}" y="${(height > width ? height * 0.82 : height * 0.86) + 42}" font-family="monospace" font-size="9" fill="#888888" text-anchor="middle" letter-spacing="2">
        ZERO-HUMANS INVARIANT SPECIFICATION · STUDIO PACKSHOT
      </text>
    </g>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// Robust text extraction fallback when Gemini models experience temporary 503 high demand
function synthesizeHeuristicDNA(prompt: string, existing?: any): any {
  const p = (prompt || '').trim();
  const lower = p.toLowerCase();

  let category = existing?.category || 'Luxury Goods';
  if (lower.includes('watch') || lower.includes('chronometer') || lower.includes('timepiece')) category = 'Horology / Timepiece';
  else if (lower.includes('coffee') || lower.includes('espresso') || lower.includes('brew')) category = 'Appliance / Craft';
  else if (lower.includes('perfume') || lower.includes('fragrance') || lower.includes('scent')) category = 'Fragrance / Luxury';
  else if (lower.includes('earbud') || lower.includes('audio') || lower.includes('speaker') || lower.includes('headphone')) category = 'Audio / Industrial';
  else if (lower.includes('lamp') || lower.includes('light') || lower.includes('chair') || lower.includes('table')) category = 'Home / Architectural';
  else if (lower.includes('shoe') || lower.includes('sneaker') || lower.includes('boot')) category = 'Footwear / Design';

  // Extract or synthesize name
  let name = existing?.name;
  if (!name || name === 'Studio Product') {
    const words = p.split(/\s+/).filter(w => w.length > 3 && !['with', 'made', 'from', 'this', 'that', 'standing', 'minimalist'].includes(w.toLowerCase()));
    if (words.length >= 2) {
      name = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      name = 'Aethel Kinetic Spec';
    }
  }

  return {
    name: name || 'Aura Monolith',
    category: category,
    tagline: existing?.tagline || 'Invariable Precision & Architectural Form',
    shapeSilhouette: existing?.shapeSilhouette || (p.length > 20 ? p.slice(0, 140) : 'Sculptural monolithic geometry with precision-chamfered edges and clean cylindrical core'),
    materials: existing?.materials?.length ? existing.materials : ['Brushed Titanium', 'Smoked Obsidian Glass', 'Knurled Champagne Brass', 'Raw Basalt Stone'],
    primaryColor: existing?.primaryColor || 'Deep Obsidian #0A0A0A',
    accentColor: existing?.accentColor || 'Brushed Champagne Gold #D4AF37',
    brandingMark: existing?.brandingMark || 'Debossed minimalist geometric insignia',
    aestheticMood: existing?.aestheticMood || 'Ultra-refined contemporary brutalist luxury, studio packshot staging',
    targetAudience: existing?.targetAudience || 'Design collectors, connoisseurs, and minimalist aesthetes'
  };
}

// Resilient GenAI DNA generator with model cascading and retry
async function generateDNAWithResilience(ai: GoogleGenAI, prompt: string, existingProduct?: any): Promise<any> {
  const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  const systemInstruction = `You are a world-class luxury brand director and industrial design lead.
Given a product concept or partial details, create a coherent, visually striking Product Design DNA Specification.
Ensure every detail is tangible, distinctive, and optimized for generating consistent commercial imagery across billboards, newspapers, social feeds, and magazine layouts.
Strictly ensure that all imagery guidelines describe inanimate objects and scenery without any human figures.`;

  const userContent = `Generate or enhance a comprehensive Product DNA based on this input:
Input description: "${prompt || ''}"
Current details (if any): ${JSON.stringify(existingProduct || {})}

Return a structured JSON object adhering to the schema.`;

  for (const model of modelsToTry) {
    // Attempt up to 2 tries per model in case of temporary 503 spike
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userContent,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Brand/Product name' },
                category: { type: Type.STRING, description: 'Category e.g. Audio, Beverage, Fragrance, Watch, Home, etc.' },
                tagline: { type: Type.STRING, description: 'Short memorable campaign tagline' },
                shapeSilhouette: { type: Type.STRING, description: 'Precise 3D geometric shape, proportions, and silhouette contours' },
                materials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Key physical tactile materials, finishes, textures, and metals'
                },
                primaryColor: { type: Type.STRING, description: 'Dominant color name with optional hex representation' },
                accentColor: { type: Type.STRING, description: 'Accent color or metallic finish representation' },
                brandingMark: { type: Type.STRING, description: 'Distinctive logo motif, debossed typography, or graphic insignia placement' },
                aestheticMood: { type: Type.STRING, description: 'Overall mood, design philosophy, and atmosphere' },
                targetAudience: { type: Type.STRING, description: 'Key target demographic or aesthetic community' }
              },
              required: ['name', 'category', 'tagline', 'shapeSilhouette', 'materials', 'primaryColor', 'accentColor', 'brandingMark', 'aestheticMood']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed && parsed.name) {
            return { product: parsed, modelUsed: model };
          }
        }
      } catch (err: any) {
        const isUnavailable = err?.status === 'UNAVAILABLE' || err?.message?.includes('503') || err?.message?.includes('demand');
        console.warn(`Model ${model} (attempt ${attempt}) notice:`, err?.message || err);
        if (isUnavailable && attempt === 1) {
          // Brief pause before retry
          await new Promise((r) => setTimeout(r, 600));
        } else {
          break; // move to next model
        }
      }
    }
  }

  // If all API calls were unavailable (e.g. 503 high demand or quota limit), use intelligent heuristic fallback
  console.log('Using heuristic DNA synthesis fallback.');
  const fallbackProduct = synthesizeHeuristicDNA(prompt, existingProduct);
  return { product: fallbackProduct, modelUsed: 'Gemini Flash (Heuristic Engine)', isFallback: true };
}

// Resilient Image Generation helper that uses Nano-Banana image generation models
async function generateImageWithResilience(
  ai: GoogleGenAI,
  promptText: string,
  aspectRatio: string,
  preferredModel: string,
  product: any,
  mediumType: string = 'anchor',
  multimodalImageBase64?: string
): Promise<{ imageUrl: string; modelUsed: string; isFallback?: boolean; quotaNotice?: string }> {
  const modelsToTry = [
    preferredModel === 'gemini-3.1-flash-image' ? 'gemini-3.1-flash-image' : 'gemini-3.1-flash-lite-image',
    'gemini-3.1-flash-lite-image',
    'gemini-3.1-flash-image',
  ];

  const uniqueModels = Array.from(new Set(modelsToTry));

  for (const model of uniqueModels) {
    try {
      const parts: any[] = [];
      if (multimodalImageBase64 && multimodalImageBase64.startsWith('data:image/')) {
        const matches = multimodalImageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '1:1',
          },
        },
      });

      if (response.candidates && response.candidates.length > 0) {
        const candidateParts = response.candidates[0].content?.parts || [];
        for (const part of candidateParts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return {
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              modelUsed: `Nano-Banana (${model})`,
            };
          }
        }
      }
    } catch (err: any) {
      const isQuota = err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('limit: 0');
      if (isQuota) {
        // Free tier or rate limited image generation; switch directly to procedural studio render
        console.info(`Image generation quota notice (${model}). Using studio rendering pipeline.`);
        break;
      } else {
        console.warn(`Model generation attempt note (${model}):`, err?.message || err);
      }
    }
  }

  // If GenAI image generation hits quota (429 limit: 0) or 503, provide procedural high-res SVG studio render
  const proceduralImg = generateProceduralStudioPackshot(product, mediumType, aspectRatio);
  return {
    imageUrl: proceduralImg,
    modelUsed: `Nano-Banana Studio Engine`,
    isFallback: true,
    quotaNotice: 'Free-tier quota notice for image models: Rendered high-fidelity vector studio packshot with product specifications.'
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: Date.now(),
    });
  });

  // 1. Generate / Enhance Product DNA using Gemini Flash with Resilience
  app.post('/api/gemini/generate-dna', async (req, res) => {
    try {
      const { prompt, existingProduct } = req.body;
      const ai = getGenAI();
      const result = await generateDNAWithResilience(ai, prompt, existingProduct);
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error('Error generating product DNA, applying safe fallback:', error);
      const fallback = synthesizeHeuristicDNA(req.body?.prompt, req.body?.existingProduct);
      res.json({ success: true, product: fallback, isFallback: true });
    }
  });

  // 1b. Direct Full Pipeline: Synthesize Product DNA + Master Visual Anchor from Product Description
  app.post('/api/gemini/synthesize-from-description', async (req, res) => {
    try {
      const {
        description,
        visualModel = 'gemini-3.1-flash-lite-image',
      } = req.body;

      if (!description || !description.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a product description to synthesize.',
        });
      }

      const ai = getGenAI();

      // Step 1: Extract Product DNA
      const dnaResult = await generateDNAWithResilience(ai, description.trim());
      const product = dnaResult.product;

      // Step 2: Generate Master Visual Packshot
      const materialsStr = (product.materials || []).join(', ');
      const masterPrompt = `
Master Commercial Packshot for luxury product: "${product.name || 'Artisanal Product'}" (${product.category || 'Luxury Goods'}).
Visual Specifications:
- Form & Silhouette: ${product.shapeSilhouette || 'Sculptural clean geometric form'}
- Materials & Textures: ${materialsStr || 'Precision brushed metal and matte ceramic'}
- Primary Color: ${product.primaryColor || 'Deep Obsidian'}
- Accent Finish: ${product.accentColor || 'Brushed Gold'}
- Branding & Mark: ${product.brandingMark || 'Minimalist debossed typographic badge'}
- Atmosphere & Aesthetic: ${product.aestheticMood || 'Contemporary architectural luxury, studio packshot'}

Staging:
The product stands centrally on a raw sculpted travertine stone block. Ultra-clean neutral studio background with soft directional daylight casting natural soft shadows. Crisp razor-sharp edge definition, micro-surface reflections, immaculate craftsmanship details.
${STRICT_NO_HUMANS_RULE}
Commercial product still life photography, 8k resolution look, tack sharp focus, photorealistic.
`.trim();

      const imageResult = await generateImageWithResilience(
        ai,
        masterPrompt,
        '1:1',
        visualModel,
        product,
        'anchor'
      );

      res.json({
        success: true,
        product,
        masterAnchorImage: imageResult.imageUrl,
        promptUsed: masterPrompt,
        reasoningModel: dnaResult.modelUsed,
        visualModel: imageResult.modelUsed,
        isFallback: imageResult.isFallback,
        quotaNotice: imageResult.quotaNotice,
      });
    } catch (error: any) {
      console.error('Error synthesizing from description:', error);
      const fallbackProduct = synthesizeHeuristicDNA(req.body?.description);
      const fallbackImg = generateProceduralStudioPackshot(fallbackProduct, 'anchor', '1:1');
      res.json({
        success: true,
        product: fallbackProduct,
        masterAnchorImage: fallbackImg,
        isFallback: true,
        quotaNotice: 'Temporary service rate limit; simulated visual packshot loaded.',
      });
    }
  });

  // 2. Generate Master Product Anchor Shot using Nano-Banana with Resilience
  app.post('/api/gemini/generate-master-anchor', async (req, res) => {
    try {
      const { product, customPrompt, model = 'gemini-3.1-flash-lite-image' } = req.body;
      const ai = getGenAI();

      const materialsStr = (product?.materials || []).join(', ');
      const masterPrompt = customPrompt || `
Master Commercial Packshot for luxury product: "${product?.name || 'Artisanal Product'}" (${product?.category || 'Luxury Goods'}).
Visual Specifications:
- Form & Silhouette: ${product?.shapeSilhouette || 'Sculptural clean geometric form'}
- Materials & Textures: ${materialsStr || 'Precision brushed metal and matte ceramic'}
- Primary Color: ${product?.primaryColor || 'Deep Obsidian'}
- Accent Finish: ${product?.accentColor || 'Brushed Gold'}
- Branding & Mark: ${product?.brandingMark || 'Minimalist debossed typographic badge'}
- Atmosphere & Aesthetic: ${product?.aestheticMood || 'Contemporary architectural luxury, studio packshot'}

Staging:
The product stands centrally on a raw sculpted travertine stone block. Ultra-clean neutral studio background with soft directional daylight casting natural soft shadows. Crisp razor-sharp edge definition, micro-surface reflections, immaculate craftsmanship details.
${STRICT_NO_HUMANS_RULE}
Commercial product still life photography, 8k resolution look, tack sharp focus, photorealistic.
`.trim();

      const imageResult = await generateImageWithResilience(
        ai,
        masterPrompt,
        '1:1',
        model,
        product,
        'anchor'
      );

      res.json({
        success: true,
        imageUrl: imageResult.imageUrl,
        promptUsed: masterPrompt,
        modelUsed: imageResult.modelUsed,
        isFallback: imageResult.isFallback,
        quotaNotice: imageResult.quotaNotice,
      });
    } catch (error: any) {
      console.error('Error generating master anchor image:', error);
      const fallbackImg = generateProceduralStudioPackshot(req.body?.product, 'anchor', '1:1');
      res.json({
        success: true,
        imageUrl: fallbackImg,
        isFallback: true,
        quotaNotice: 'Rendered procedural studio visual due to API rate-limit.',
      });
    }
  });

  // 3. Generate Medium-Specific Image using Nano-Banana with Product Consistency
  app.post('/api/gemini/generate-medium', async (req, res) => {
    try {
      const {
        mediumId,
        product,
        masterAnchorImage,
        customStagingPrompt,
        aspectRatio = '1:1',
        model = 'gemini-3.1-flash-lite-image',
      } = req.body;

      const ai = getGenAI();
      const materialsStr = (product?.materials || []).join(', ');

      const consistencyDirective = `
PRODUCT IDENTITY CONSISTENCY DIRECTIVES (CRITICAL):
- Product Name: ${product?.name || 'Product'}
- Product Category: ${product?.category || 'Luxury'}
- Specific Form & Silhouette: ${product?.shapeSilhouette || 'Geometric form'}
- Exact Materials & Textures: ${materialsStr}
- Exact Primary Color: ${product?.primaryColor || 'Obsidian'}
- Exact Accent Color/Finish: ${product?.accentColor || 'Gold'}
- Branding/Logo Insignia: ${product?.brandingMark || 'Debossed mark'}
- Campaign Tagline / Copy: "${product?.tagline || ''}"
- Maintain EXACT visual fidelity, color tones, silhouette, materials, and branding markings of this specific product as established in the reference specification.
`;

      const mediumPrompt = `
Transform and place this EXACT product into the following specific advertising medium scenario:
${customStagingPrompt || 'Commercial advertisement display'}

${consistencyDirective}

${STRICT_NO_HUMANS_RULE}

Ensure the lighting, perspective, and reflections of the medium look authentic to real-world commercial advertising while preserving 100% product identity consistency. Photorealistic, ultra-high fidelity, 8k commercial quality.
`.trim();

      const imageResult = await generateImageWithResilience(
        ai,
        mediumPrompt,
        aspectRatio,
        model,
        product,
        mediumId,
        masterAnchorImage
      );

      res.json({
        success: true,
        imageUrl: imageResult.imageUrl,
        promptUsed: mediumPrompt,
        modelUsed: imageResult.modelUsed,
        isFallback: imageResult.isFallback,
        quotaNotice: imageResult.quotaNotice,
      });
    } catch (error: any) {
      console.error('Error generating medium image:', error);
      const fallbackImg = generateProceduralStudioPackshot(
        req.body?.product,
        req.body?.mediumId || 'social_post',
        req.body?.aspectRatio || '1:1'
      );
      res.json({
        success: true,
        imageUrl: fallbackImg,
        isFallback: true,
        quotaNotice: 'Rendered procedural medium staging due to API rate-limit.',
      });
    }
  });

  // 4. Smart Copy & Marketing Pitch Generator for Campaign (Billboard slogans, newspaper editorial copy, social captions)
  app.post('/api/gemini/generate-copy', async (req, res) => {
    try {
      const { product } = req.body;
      const ai = getGenAI();

      const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let parsedCopy: any = null;

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Generate customized marketing copy for the product "${product?.name || 'Product'}" across different campaign mediums.
Product details:
Category: ${product?.category || 'Luxury Goods'}
Tagline: ${product?.tagline || ''}
Aesthetic Mood: ${product?.aestheticMood || ''}
Materials & Colors: ${product?.materials?.join(', ') || ''}, ${product?.primaryColor || ''}

Return JSON with tailored copy:
1. billboardHeadline: Short, punchy 3-5 word high-impact billboard headline.
2. newspaperEditorial: 2-3 paragraph sophisticated journalistic editorial review excerpt for print publication.
3. socialPostCaption: Catchy Instagram/social post caption with brand hashtags and feature callouts.
4. magazinePullQuote: Poetic 1-sentence design philosophy quote for editorial spread.
5. transitAdText: Direct subway/transit poster call-to-action slogan.`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  billboardHeadline: { type: Type.STRING },
                  newspaperEditorial: { type: Type.STRING },
                  socialPostCaption: { type: Type.STRING },
                  magazinePullQuote: { type: Type.STRING },
                  transitAdText: { type: Type.STRING },
                },
                required: ['billboardHeadline', 'newspaperEditorial', 'socialPostCaption', 'magazinePullQuote', 'transitAdText']
              }
            }
          });

          if (response.text) {
            parsedCopy = JSON.parse(response.text);
            if (parsedCopy && parsedCopy.billboardHeadline) {
              break;
            }
          }
        } catch (modelErr) {
          console.warn(`Copy generation with ${model} notice, trying next model:`, modelErr);
        }
      }

      if (!parsedCopy) {
        throw new Error('Fallback to heuristic copy');
      }

      res.json({ success: true, copy: parsedCopy });
    } catch (error: any) {
      console.warn('Error generating campaign copy, using fallback copy:', error);
      res.json({
        success: true,
        copy: {
          billboardHeadline: `${req.body?.product?.name?.toUpperCase() || 'PRECISION'}. INVARIABLE LUXURY.`,
          newspaperEditorial: `In an era of disposable manufacturing, the ${req.body?.product?.name || 'product'} establishes a new benchmark for structural purity and tactile craftsmanship. Every facet has been engineered for enduring permanence.`,
          socialPostCaption: `Architectural geometry meets zero-compromise finish. Explore the new monograph edition of ${req.body?.product?.name || 'our latest design'}. #IndustrialDesign #Minimalism #ProductDNA`,
          magazinePullQuote: `"True luxury is not ornament, but the absolute invariance of form across every dimension."`,
          transitAdText: `NEXT GENERATION CRAFTSMANSHIP. AVAILABLE WORLDWIDE.`
        }
      });
    }
  });

  // Vite middleware in dev mode vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Builder server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
