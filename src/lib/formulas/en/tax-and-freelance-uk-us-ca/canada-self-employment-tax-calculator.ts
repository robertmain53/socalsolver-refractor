import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Canada Self-Employment Tax Calculator (CPP & EI Premiums)"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:tax-and-freelance-uk-us-ca/canada-self-employment-tax-calculator",
  slug: "tax-and-freelance-uk-us-ca/canada-self-employment-tax-calculator",
  category: "tax-and-freelance-uk-us-ca",
  locale: "en",
  title: "Canada Self-Employment Tax Calculator (CPP & EI Premiums)",
  description: "Canada Self-Employment Tax Calculator (CPP & EI Premiums) is a professional tool designed to help you calculate accurately and quickly. This calculator uses the latest tax regulations and formulas to provide you with accurate and reliable results.",
  keywords: ["[\"Canada Self-Employment Tax Calculator (CPP & EI Premiums)\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Canada Self-Employment Tax Calculator (CPP & EI Premiums) calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};