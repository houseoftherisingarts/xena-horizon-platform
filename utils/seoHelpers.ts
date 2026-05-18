
import { HomeBlock } from '../types';

// --- 1. THE GEMINI SYSTEM PROMPT (The "Brain") ---
export const GEMINI_SEO_SYSTEM_PROMPT = `
You are an expert SEO Strategist and Technical SEO Specialist. 
Analyze the provided Page Title and Page Content (derived from website blocks).

Output a STRICTLY VALID JSON object (no markdown formatting, no code blocks) with the following keys:
1. "optimizedTitle": An SEO-friendly title tag (max 60 chars).
2. "metaDescription": A compelling meta description optimized for CTR (max 160 chars).
3. "keywords": An array of 5 relevant keyword strings.
4. "schemaType": The most appropriate Schema.org type based on content (e.g., "ProfessionalService", "Article", "Event", "Product").
5. "sentiment": A brief 3-word analysis of the content tone.

Ensure the output is parseable JSON.
`;

// --- TYPES ---
export interface SeoResult {
  optimizedTitle: string;
  metaDescription: string;
  keywords: string[];
  schemaType: string;
  sentiment: string;
}

// --- 3. HELPER FUNCTIONS ---

/**
 * Generates the JSON-LD script tag content
 */
export const generateSchemaMarkup = (seoData: SeoResult, url: string = 'https://xenahorizon.com') => {
  const schema = {
    "@context": "https://schema.org",
    "@type": seoData.schemaType,
    "name": seoData.optimizedTitle,
    "description": seoData.metaDescription,
    "url": url,
    "keywords": seoData.keywords.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": "Xena Horizon",
      "logo": {
        "@type": "ImageObject",
        "url": "https://xenahorizon.com/logo.png"
      }
    }
  };

  return JSON.stringify(schema);
};

// --- MOCK SERVICES (The "Engine" Parts) ---

export const mockSaveToDB = async (blocks: HomeBlock[]) => {
  return new Promise((resolve) => setTimeout(resolve, 800)); // Simulate DB latency
};

export const mockGeminiAnalysis = async (content: string): Promise<SeoResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        optimizedTitle: "Xena Horizon | Stratégie Culturelle & Mentorat Artistes",
        metaDescription: "Consultante experte pour artistes et OBNL. Transformez votre chaos organisationnel en succès stratégique. Financement, gestion et clarté.",
        keywords: ["stratégie culturelle", "mentorat artiste", "consultant obnl", "demande de subvention", "gestion art"],
        schemaType: "ProfessionalService",
        sentiment: "Professionnel, Empathique, Autoritaire"
      });
    }, 2000); // Simulate AI Thinking time
  });
};

export const mockIndexNowPing = async (url: string) => {
  return new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API Ping
};
