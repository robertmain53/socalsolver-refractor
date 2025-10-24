import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculadora Amortización Vehículo Empresa"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:automoviles-y-transporte/calculadora-amortizacion-vehiculo",
  slug: "automoviles-y-transporte/calculadora-amortizacion-vehiculo",
  category: "automoviles-y-transporte",
  locale: "es",
  title: "Calculadora Amortización Vehículo Empresa",
  description: "Calcula amortización fiscal de vehículos de empresa: turismos, furgonetas, camiones.",
  keywords: ["[\"amortización vehículo\"]"],
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
    { q: "How do I use the Calculadora Amortización Vehículo Empresa calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};