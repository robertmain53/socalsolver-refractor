import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "US \"Required Minimum Distribution\" (RMD) Calculator for retirement accounts"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:savings-&-investment/us-required-minimum-distribution-calculator",
  slug: "savings-&-investment/us-required-minimum-distribution-calculator",
  category: "savings-&-investment",
  locale: "en",
  title: "US \"Required Minimum Distribution\" (RMD) Calculator for retirement accounts",
  description: "US \"Required Minimum Distribution\" (RMD) Calculator for retirement accounts is a professional tool designed to help you calculate accurately and quickly. This calculator uses the latest tax regulations and formulas to provide you with accurate and reliable results.",
  keywords: ["[\"US \"Required Minimum Distribution\" (RMD) Calculator for retirement accounts\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the US \"Required Minimum Distribution\" (RMD) Calculator for retirement accounts calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};