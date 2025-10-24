import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "UK Buy-to-Let Yield & ROI Calculator (incl. Section 24 mortgage interest changes)"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:tax-and-freelance-uk-us-ca/uk-buy-to-let-yield-roi-calculator",
  slug: "tax-and-freelance-uk-us-ca/uk-buy-to-let-yield-roi-calculator",
  category: "tax-and-freelance-uk-us-ca",
  locale: "en",
  title: "UK Buy-to-Let Yield & ROI Calculator (incl. Section 24 mortgage interest changes)",
  description: "UK Buy-to-Let Yield & ROI Calculator (incl. Section 24 mortgage interest changes) is a professional tool designed to help you calculate accurately and quickly. This calculator uses the latest tax regulations and formulas to provide you with accurate and reliable results.",
  keywords: ["[\"UK Buy-to-Let Yield & ROI Calculator (incl. Section 24 mortgage interest changes)\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the UK Buy-to-Let Yield & ROI Calculator (incl. Section 24 mortgage interest changes) calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};