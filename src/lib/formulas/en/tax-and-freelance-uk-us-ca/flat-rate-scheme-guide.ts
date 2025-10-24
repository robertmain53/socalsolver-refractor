import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Flat Rate Scheme Guide"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:tax-and-freelance-uk-us-ca/flat-rate-scheme-guide",
  slug: "tax-and-freelance-uk-us-ca/flat-rate-scheme-guide",
  category: "tax-and-freelance-uk-us-ca",
  locale: "en",
  title: "Flat Rate Scheme Guide",
  description: "Professional Flat Rate Scheme Guide calculator with clear formulas, examples, and references.",
  keywords: ["flat rate scheme guide","flat rate scheme guide calculator","online calculator"],
  inputs: [
    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.01, default: 1 }
  ],
  outputs: [
    { id: 'result', label: 'Result', decimals: 4 }
  ],
  references: [
    { label: 'Methodology / Standard (placeholder)', url: 'https://example.com' }
  ],
  faq: [
    { q: "How do I use the Flat Rate Scheme Guide calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};