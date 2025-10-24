import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Comparatore Conti Correnti e Conti Deposito"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "it:risparmio-e-investimenti/compara-conti",
  slug: "risparmio-e-investimenti/compara-conti",
  category: "risparmio-e-investimenti",
  locale: "it",
  title: "Comparatore Conti Correnti e Conti Deposito",
  description: "Trova il miglior conto corrente o conto deposito per le tue esigenze. Compara costi, tassi di interesse e caratteristiche per massimizzare i tuoi risparmi.",
  keywords: ["[\"comparatore conti\"","\"miglior conto corrente\"","\"conto deposito\"","\"confronto conti\"","\"risparmio\"]"],
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
    { q: "How do I use the Comparatore Conti Correnti e Conti Deposito calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};