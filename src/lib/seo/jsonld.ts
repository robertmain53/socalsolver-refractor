import type { CalculatorMeta } from '@/specs/calculator';

export function buildJsonLd(meta: CalculatorMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "applicationCategory": "Calculator",
    "name": meta.title,
    "description": meta.description,
    "inLanguage": meta.locale,
    "operatingSystem": "All",
    "about": meta.keywords || []
  };
}
