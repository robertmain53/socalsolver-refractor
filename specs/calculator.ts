export type Unit = { id: string; label: string };

export type InputField = {
  id: string;
  label: string;
  type: 'number' | 'select' | 'range';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  tooltipMd?: string;
  default?: number | string;
  required?: boolean;
};

export type OutputField = {
  id: string;
  label: string;
  unit?: string;
  decimals?: number;
  explanationMd?: string;
};

export type Formula = (inputs: Record<string, number | string>) => Record<string, number | string>;

export type CalculatorSpec = {
  slug: string;
  category: string;
  locale: 'en' | 'it' | string;
  title: string;
  description: string;
  keywords?: string[];
  inputs: InputField[];
  outputs: OutputField[];
  formula: Formula;
  references?: { label: string; url: string }[];
  faq?: { q: string; aMd: string }[];
};
