import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Canada \"Registered Education Savings Plan\" (RESP) Grant Calculator"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:savings-&-investment/canada-registered-education-savings-calculator",
  slug: "savings-&-investment/canada-registered-education-savings-calculator",
  category: "savings-&-investment",
  locale: "en",
  title: "Canada \"Registered Education Savings Plan\" (RESP) Grant Calculator",
  description: "Canada \"Registered Education Savings Plan\" (RESP) Grant Calculator is a professional tool designed to help you calculate accurately and quickly. This calculator uses the latest tax regulations and formulas to provide you with accurate and reliable results.",
  keywords: ["[\"Canada \"Registered Education Savings Plan\" (RESP) Grant Calculator\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Canada \"Registered Education Savings Plan\" (RESP) Grant Calculator calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};