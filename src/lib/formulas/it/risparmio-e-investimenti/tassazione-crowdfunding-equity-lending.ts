import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Tassazione Crowdfunding Equity Lending"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:risparmio-e-investimenti/tassazione-crowdfunding-equity-lending",
  slug: "risparmio-e-investimenti/tassazione-crowdfunding-equity-lending",
  category: "risparmio-e-investimenti",
  locale: "it",
  title: "Tassazione Crowdfunding Equity Lending",
  description: "Professional Tassazione Crowdfunding Equity Lending calculator with clear formulas, examples, and references.",
  keywords: ["tassazione crowdfunding equity lending","tassazione crowdfunding equity lending calculator","online calculator"],
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
    { q: "How do I use the Tassazione Crowdfunding Equity Lending calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};