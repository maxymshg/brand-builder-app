import { MediumDefinition } from '../types';

export const MEDIUM_DEFINITIONS: MediumDefinition[] = [
  {
    id: 'billboard',
    name: 'Highway & Skyline Billboard',
    category: 'outdoor',
    description: 'Massive panoramic outdoor billboard towering beside a modern architectural skyline under dramatic sunset lighting.',
    aspectRatio: '16:9',
    iconName: 'Tv',
    defaultPromptStaging: 'High-impact commercial billboard installation positioned on a clean steel gantry against a dramatic dusk twilight sky and minimalist city architecture. The product is rendered with heroic scale and sharp studio-grade clarity on the billboard canvas. Realistic spotlights illuminate the board. NO people, no drivers, no pedestrians.',
    mockupFrameType: 'billboard',
    recommendedLighting: 'Golden hour twilight with directional gantry spotlights',
    environmentDescription: 'Elevated roadside gantry, modern architectural skyline, clean evening sky'
  },
  {
    id: 'newspaper',
    name: 'Vintage Broadsheet Newspaper Ad',
    category: 'print',
    description: 'Full-page editorial ad printed on textured newsprint paper with authentic halftone ink dot detailing.',
    aspectRatio: '3:4',
    iconName: 'Newspaper',
    defaultPromptStaging: 'An open full-page broadsheet newspaper laid flat on a rustic natural dark oak studio table. In the center of the page is a crisp, high-contrast monochrome and subtle warm-toned advertisement featuring the product with clean Swiss typography and editorial column formatting. Tactile paper texture, authentic ink press halftone grain. NO people, no hands holding the paper.',
    mockupFrameType: 'newspaper',
    recommendedLighting: 'Soft diffused natural window daylight across the paper surface',
    environmentDescription: 'Artisan studio desk, coffee table setting, newsprint grain and ink press finish'
  },
  {
    id: 'social_post',
    name: 'Social Media Feed Post',
    category: 'digital',
    description: 'Aesthetic modern social media drop post with contemporary composition and vibrant minimalist backdrop.',
    aspectRatio: '1:1',
    iconName: 'Smartphone',
    defaultPromptStaging: 'Square modern social media campaign visual featuring the product centered in an impeccably styled minimalist architectural setting. Complementary geometric shapes, soft pastel shadow play, botanical accents, pristine negative space. Clean high-end digital lifestyle photography. ZERO humans, no hands, no faces.',
    mockupFrameType: 'social',
    recommendedLighting: 'Clean contemporary studio lighting with soft geometric shadows',
    environmentDescription: 'Minimalist architectural alcove, textured plaster background, botanical shadows'
  },
  {
    id: 'magazine_spread',
    name: 'Glossy Editorial Magazine Spread',
    category: 'print',
    description: 'Double-page high-fashion luxury editorial spread in a thick matte paper art and design quarterly.',
    aspectRatio: '16:9',
    iconName: 'BookOpen',
    defaultPromptStaging: 'A luxurious heavy-weight design magazine open flat to a double-page editorial feature. One page showcases the product in majestic still-life studio photography on a raw travertine stone plinth, while the facing page features minimalist typographic columns and minimalist branding details. Crisp page crease and natural paper weight. NO people, no hands.',
    mockupFrameType: 'magazine',
    recommendedLighting: 'Warm directional afternoon sunbeam casting soft diagonal shadows',
    environmentDescription: 'Glossy editorial layout, open magazine on raw travertine surface'
  },
  {
    id: 'transit_shelter',
    name: 'Transit & Bus Shelter Poster',
    category: 'outdoor',
    description: 'Backlit street-level poster frame inside a sleek glass transit shelter on a moody European evening.',
    aspectRatio: '3:4',
    iconName: 'Compass',
    defaultPromptStaging: 'A glowing vertical glass poster box at a sleek contemporary urban transit bus shelter on a misty evening. The backlit poster showcases the product in ultra-crisp detail with bold typography. Subtle damp pavement reflections and soft ambient city bokeh in the background. Completely empty sidewalk, NO people, no pedestrians, no figures.',
    mockupFrameType: 'transit',
    recommendedLighting: 'Internal poster backlight with glowing reflection on damp ground',
    environmentDescription: 'Glass urban bus shelter, misty asphalt pavement, clean minimalist street'
  },
  {
    id: 'storefront_pedestal',
    name: 'Boutique Gallery Window Display',
    category: 'retail',
    description: 'Ultra-exclusive boutique storefront window featuring the product spotlighted on a sculpted marble plinth.',
    aspectRatio: '1:1',
    iconName: 'Sparkles',
    defaultPromptStaging: 'An ultra-luxury boutique display window framed by dark fluted bronze architecture. The product rests majestically on a bespoke fluted marble pedestal under warm gallery pin-spots. Pristine clean glass reflection, museum-grade staging and refined minimalist ambiance. NO people, no shoppers, no passersby.',
    mockupFrameType: 'pedestal',
    recommendedLighting: 'Narrow museum pin-spotlight with deep ambient velvet shadows',
    environmentDescription: 'Luxury flagship storefront, sculpted marble pedestal, polished brass trim'
  },
  {
    id: 'packaging_box',
    name: 'Luxury Unboxing & Packaging',
    category: 'retail',
    description: 'Premium rigid unboxing experience with debossed gold foil box, textured tissue, and matte card.',
    aspectRatio: '1:1',
    iconName: 'Package',
    defaultPromptStaging: 'A premium luxury unboxing scene laid out on a smooth slate surface. The bespoke matte rigid box is open, revealing the product nestled snugly inside custom-molded velvet-touch inserts. Beside it lies the embossed brand card and folded silk paper. Impeccable craftsmanship and packaging design details. NO people, no hands.',
    mockupFrameType: 'packaging',
    recommendedLighting: 'Overhead softbox studio light capturing micro-textures and foil stamp reflections',
    environmentDescription: 'Minimalist studio tabletop, open luxury gift box, custom-cut insert'
  },
  {
    id: 'subway_lightbox',
    name: 'Metro Underground Lightbox',
    category: 'outdoor',
    description: 'Curved tiled subway tunnel wall with an illuminated widescreen commercial display.',
    aspectRatio: '16:9',
    iconName: 'Train',
    defaultPromptStaging: 'A widescreen illuminated lightbox ad installed along the curved ceramic tiled wall of a modern architectural metro station. The crisp poster displays the product with striking clarity and bold branding. Clean architectural symmetry, polished platform floor reflecting the soft light. Completely empty station, ZERO humans, no commuters.',
    mockupFrameType: 'subway',
    recommendedLighting: 'Even interior lightbox luminescence casting a soft glow on tiled walls',
    environmentDescription: 'Sleek metro platform, white subway tiles, polished concrete floor'
  }
];
