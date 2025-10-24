import en from '@/content/registry/en.json';
import it from '@/content/registry/it.json';

type Entry = { slug: string; module: string };

const registries: Record<string, Entry[]> = { en: en as Entry[], it: it as Entry[] };

export async function getCalculatorSpec(locale: string, slug: string) {
  const list = registries[locale as 'en' | 'it'] || [];
  const entry = list.find(e => e.slug === slug);
  if (!entry) return null;
  // dynamic import module path stored in registry
  // e.g. "@/lib/formulas/convert-pressure"
  const mod = await import(/* @vite-ignore */ entry.module);
  return mod.spec as unknown;
}
