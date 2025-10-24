import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculadora Coste Desalojo Okupación Vivienda"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:legal-y-administrativo/calculadora-coste-okupacion",
  slug: "legal-y-administrativo/calculadora-coste-okupacion",
  category: "legal-y-administrativo",
  locale: "es",
  title: "Calculadora Coste Desalojo Okupación Vivienda",
  description: "Estima costes de desalojo por okupación: abogado, procurador, tiempo y gastos procesales.",
  keywords: ["[\"okupación\"]"],
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
    { q: "How do I use the Calculadora Coste Desalojo Okupación Vivienda calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};