export type AspectRatioType = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface ProductDNA {
  name: string;
  category: string;
  tagline: string;
  shapeSilhouette: string;
  materials: string[];
  primaryColor: string;
  accentColor: string;
  brandingMark: string;
  aestheticMood: string;
  targetAudience?: string;
}

export type MediumId = 
  | 'billboard'
  | 'newspaper'
  | 'social_post'
  | 'magazine_spread'
  | 'transit_shelter'
  | 'storefront_pedestal'
  | 'packaging_box'
  | 'subway_lightbox';

export interface MediumDefinition {
  id: MediumId;
  name: string;
  category: 'outdoor' | 'print' | 'digital' | 'retail';
  description: string;
  aspectRatio: AspectRatioType;
  iconName: string;
  defaultPromptStaging: string;
  mockupFrameType: 'billboard' | 'newspaper' | 'social' | 'magazine' | 'transit' | 'pedestal' | 'packaging' | 'subway';
  recommendedLighting: string;
  environmentDescription: string;
}

export interface MediumGenerationResult {
  mediumId: MediumId;
  status: 'idle' | 'generating' | 'success' | 'error';
  imageUrl?: string;
  generatedPrompt?: string;
  timestamp?: number;
  errorMessage?: string;
  aspectRatio: AspectRatioType;
}

export interface BrandCampaign {
  id: string;
  createdAt: number;
  product: ProductDNA;
  masterAnchorImage?: string;
  masterAnchorPrompt?: string;
  isAnchorLocked: boolean;
  selectedModel: 'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image';
  results: Record<MediumId, MediumGenerationResult>;
}

export interface PresetBrand {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  product: ProductDNA;
  sampleAnchorDescription: string;
}
