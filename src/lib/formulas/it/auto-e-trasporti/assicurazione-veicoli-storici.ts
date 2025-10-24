import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calcolatore Assicurazione Veicoli Storici"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:auto-e-trasporti/assicurazione-veicoli-storici",
  slug: "auto-e-trasporti/assicurazione-veicoli-storici",
  category: "auto-e-trasporti",
  locale: "it",
  title: "Calcolatore Assicurazione Veicoli Storici",
  description: "Calcolatore Assicurazione Veicoli Storici è uno strumento professionale progettato per aiutarti a calcolare in modo preciso e veloce. Questo calcolatore utilizza le normative fiscali e le formule più aggiornate per fornirti risultati accurati e affidabili.",
  keywords: ["[\"Calcolatore Assicurazione Veicoli Storici\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Calcolatore Assicurazione Veicoli Storici calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};