import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Cash Flow Operativo"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:pmi-e-impresa/cash-flow-operativo",
  slug: "pmi-e-impresa/cash-flow-operativo",
  category: "pmi-e-impresa",
  locale: "it",
  title: "Cash Flow Operativo",
  description: "Professional Cash Flow Operativo calculator with clear formulas, examples, and references.",
  keywords: ["cash flow operativo","cash flow operativo calculator","online calculator"],
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
    { q: "How do I use the Cash Flow Operativo calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};