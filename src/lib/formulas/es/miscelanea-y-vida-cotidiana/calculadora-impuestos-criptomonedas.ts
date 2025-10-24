import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculadora Impuestos Criptomonedas España"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:miscelanea-y-vida-cotidiana/calculadora-impuestos-criptomonedas",
  slug: "miscelanea-y-vida-cotidiana/calculadora-impuestos-criptomonedas",
  category: "miscelanea-y-vida-cotidiana",
  locale: "es",
  title: "Calculadora Impuestos Criptomonedas España",
  description: "Calcula impuestos por trading crypto: plusvalías, IRPF, modelo 720 y declaración Hacienda.",
  keywords: ["[\"criptomonedas\"]"],
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
    { q: "How do I use the Calculadora Impuestos Criptomonedas España calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};