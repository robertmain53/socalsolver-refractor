import type { CalculatorSpec } from '@/specs/calculator';

export const spec: CalculatorSpec = {
  slug: 'converti-pressione',
  category: 'ingegneria/unita',
  locale: 'it',
  title: 'Convertitore di Pressione (Pa, bar, psi, atm)',
  description: 'Conversioni di pressione rapide e accurate per uso tecnico.',
  keywords: ['pressione','Pa','bar','psi','atm','convertitore'],
  inputs: [
    { id: 'value', label: 'Valore', type: 'number', min: 0, step: 0.0001, default: 1 },
    { id: 'from', label: 'Unità di partenza', type: 'select', default: 'Pa',
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
  }
};
