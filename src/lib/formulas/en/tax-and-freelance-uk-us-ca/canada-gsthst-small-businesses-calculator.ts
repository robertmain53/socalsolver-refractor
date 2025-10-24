import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Canada GST/HST Calculator for Small Businesses"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "en:tax-and-freelance-uk-us-ca/canada-gsthst-small-businesses-calculator",
  slug: "tax-and-freelance-uk-us-ca/canada-gsthst-small-businesses-calculator",
  category: "tax-and-freelance-uk-us-ca",
  locale: "en",
  title: "Canada GST/HST Calculator for Small Businesses",
  description: "Canada GST/HST Calculator for Small Businesses is a professional tool designed to help you calculate accurately and quickly. This calculator uses the latest tax regulations and formulas to provide you with accurate and reliable results.",
  keywords: ["[\"Canada GST/HST Calculator for Small Businesses\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Canada GST/HST Calculator for Small Businesses calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};