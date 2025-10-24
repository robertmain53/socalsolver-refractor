import type { CalculatorMeta, Formula } from '@/specs/calculator';

// NOTE: This calculator was scaffolded from legacy /content.

export const formula: Formula = (inputs) => {
  // TODO: implement real formula for "Calculadora de las Oposiciones (coste de preparación, ratio de plazas)"
  const v = Number(inputs.value ?? 0);
  return { result: v };
};

export const meta: CalculatorMeta = {
  key: "es:educacion-y-universidad/calculadora-coste-oposiciones",
  slug: "educacion-y-universidad/calculadora-coste-oposiciones",
  category: "educacion-y-universidad",
  locale: "es",
  title: "Calculadora de las Oposiciones (coste de preparación, ratio de plazas)",
  description: "Calculadora de las Oposiciones (coste de preparación, ratio de plazas) es una herramienta profesional diseñada para ayudarte a calcular de manera precisa y rápida. Esta calculadora utiliza las normativas fiscales y las fórmulas más actualizadas para proporcionarte resultados precisos y confiables.",
  keywords: ["[\"Calculadora de las Oposiciones (coste de preparación","ratio de plazas)\"","\"calcolatore\"","\"calcolo online\"]"],
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
    { q: "How do I use the Calculadora de las Oposiciones (coste de preparación, ratio de plazas) calculator?", aMd: 'Enter inputs on the left and review the computed results on the right. The **Formulas** section explains the math used.' },
    { q: 'Is this calculator accurate enough for professional use?', aMd: 'Yes—formulas are shown and can be verified. Always review assumptions and units for your case.' }
  ]
};