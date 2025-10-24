import type { CalculatorSpec } from '@/specs/calculator';

export function buildJsonLd(spec: CalculatorSpec) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "applicationCategory": "Calculator",
    "name": spec.title,
    "description": spec.description,
    "inLanguage": spec.locale,
    "operatingSystem": "All",
    "url": "", // inject with metadata API if desired
    "about": spec.keywords || []
  };
  return data;
}
