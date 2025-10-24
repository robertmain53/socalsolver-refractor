import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculateur de l'ACRE (Aide à la Création ou à la Reprise d'une Entreprise)"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "fr:fiscalite-et-travail-independant/calculateur-acre",
  slug: "fiscalite-et-travail-independant/calculateur-acre",
  category: "fiscalite-et-travail-independant",
  locale: "fr",
  title: "Calculateur de l'ACRE (Aide à la Création ou à la Reprise d'une Entreprise)",
  description: "Calculateur de l'ACRE (Aide à la Création ou à la Reprise d'une Entreprise)",
  keywords: ["[\"calculateur de l'acre (aide à la création ou à la reprise d'une entreprise)\"]"],
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
    { q: "How do I use the Calculateur de l'ACRE (Aide à la Création ou à la Reprise d'une Entreprise) calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};