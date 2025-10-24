import type { CalculatorSpec } from '@/specs/calculator';

/**
 * Converts pressure between Pa, bar, psi, atm.
 */
export const spec: CalculatorSpec = {
  slug: 'convert-pressure',
  category: 'engineering/units',
  locale: 'en',
  title: 'Pressure Unit Converter (Pa, bar, psi, atm)',
  description: 'Fast, accurate pressure conversions for engineering work.',
  keywords: ['pressure','Pa','bar','psi','atm','converter'],
  inputs: [
    { id: 'value', label: 'Value', type: 'number', min: 0, step: 0.0001, default: 1 },
    { id: 'from', label: 'From unit', type: 'select', default: 'Pa',
      options: [{value:'Pa',label:'Pascal (Pa)'},{value:'bar',label:'bar'},{value:'psi',label:'psi'},{value:'atm',label:'atm'}] }
  ],
  outputs: [
    { id: 'Pa',  label: 'Pascal', unit:'Pa', decimals: 6 },
    { id: 'bar', label: 'bar', unit:'bar', decimals: 9 },
    { id: 'psi', label: 'psi', unit:'psi', decimals: 6 },
    { id: 'atm', label: 'atm', unit:'atm', decimals: 9 }
  ],
  formula: (inputs) => {
    const v = Number(inputs.value ?? 0);
    const from = String(inputs.from ?? 'Pa');

    const toPaFactor: Record<string, number> = {
      'Pa': 1, 'bar': 1e5, 'psi': 6894.757293168, 'atm': 101325
    };

    const pa = v * (toPaFactor[from] ?? 1);
    return {
      Pa: pa,
      bar: pa / 1e5,
      psi: pa / 6894.757293168,
      atm: pa / 101325
    };
  },
  references: [
    { label: 'NIST — Pressure Units', url: 'https://physics.nist.gov/cuu/Units/units.html' }
  ],
  faq: [
    { q: 'What is 1 bar in Pa?', aMd: '1 bar = 100,000 Pa.' },
    { q: 'What is standard atmospheric pressure?', aMd: '1 atm = 101,325 Pa ≈ 1.01325 bar.' }
  ]
};
