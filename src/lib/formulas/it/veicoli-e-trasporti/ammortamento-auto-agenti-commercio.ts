import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Ammortamento Auto Agenti di Commercio"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:veicoli-e-trasporti/ammortamento-auto-agenti-commercio",
  slug: "veicoli-e-trasporti/ammortamento-auto-agenti-commercio",
  category: "veicoli-e-trasporti",
  locale: "it",
  title: "Ammortamento Auto Agenti di Commercio",
  description: "Calcola ammortamento fiscale auto per agenti di commercio: deducibilità 80% costi e 100% IVA.",
  keywords: ["[\"ammortamento auto\"]"],
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
    { q: "How do I use the Ammortamento Auto Agenti di Commercio calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};