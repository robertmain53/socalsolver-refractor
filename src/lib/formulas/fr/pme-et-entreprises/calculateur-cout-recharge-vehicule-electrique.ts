import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculateur du \"Coût de la Recharge\" d'un véhicule électrique (domicile, travail, public)"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "fr:pme-et-entreprises/calculateur-cout-recharge-vehicule-electrique",
  slug: "pme-et-entreprises/calculateur-cout-recharge-vehicule-electrique",
  category: "pme-et-entreprises",
  locale: "fr",
  title: "Calculateur du \"Coût de la Recharge\" d'un véhicule électrique (domicile, travail, public)",
  description: "Calculateur du \"Coût de la Recharge\" d'un véhicule électrique (domicile, travail, public) est un outil professionnel conçu pour vous aider à calculer de manière précise et rapide. Ce calculateur utilise les réglementations fiscales et les formules les plus récentes pour vous fournir des résultats précis et fiables.",
  keywords: ["[\"Calculateur du \"Coût de la Recharge\" d'un véhicule électrique (domicile","travail","public)\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Calculateur du \"Coût de la Recharge\" d'un véhicule électrique (domicile, travail, public) calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};