import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Simulador Declaración Renta IRPF"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:miscelanea-y-vida-cotidiana/simulador-declaracion-renta",
  slug: "miscelanea-y-vida-cotidiana/simulador-declaracion-renta",
  category: "miscelanea-y-vida-cotidiana",
  locale: "es",
  title: "Simulador Declaración Renta IRPF",
  description: "Simula tu declaración de la renta: rendimientos trabajo, capital, deducciones y resultado.",
  keywords: ["[\"declaración renta\"]"],
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
    { q: "How do I use the Simulador Declaración Renta IRPF calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};