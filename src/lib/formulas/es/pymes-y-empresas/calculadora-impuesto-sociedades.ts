import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculadora Impuesto de Sociedades 2025"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:pymes-y-empresas/calculadora-impuesto-sociedades",
  slug: "pymes-y-empresas/calculadora-impuesto-sociedades",
  category: "pymes-y-empresas",
  locale: "es",
  title: "Calculadora Impuesto de Sociedades 2025",
  description: "Calcula Impuesto de Sociedades: base imponible, tipo 25%, deducciones y cuota a pagar.",
  keywords: ["[\"impuesto sociedades\"]"],
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
    { q: "How do I use the Calculadora Impuesto de Sociedades 2025 calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};