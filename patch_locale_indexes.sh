#!/usr/bin/env bash
set -euo pipefail

mkdir -p src/app

# Root homepage → links to locale hubs
cat > src/app/page.tsx <<'TSX'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Socalsolver (Refactor)</h1>
      <p className="text-gray-600">Choose a language to browse calculators:</p>
      <ul className="list-disc list-inside">
        <li><Link className="text-blue-600 hover:underline" href="/en">English calculators</Link></li>
        <li><Link className="text-blue-600 hover:underline" href="/it">Calcolatori in Italiano</Link></li>
      </ul>
    </main>
  );
}
TSX

# Locale hub → lists calculators for that locale
mkdir -p src/app/[locale]
cat > src/app/[locale]/page.tsx <<'TSX'
import Link from 'next/link';
import { listKnownCalculators } from '@/lib/registry';
import React from 'react';

type Params = { locale: string };

export default async function LocaleIndex({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  const items = listKnownCalculators()
    .filter(i => i.locale === locale)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (!items.length) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">No calculators found for “{locale}”</h1>
        <p className="text-gray-600">If you just generated calculators, rebuild or check the slugs.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">{locale.toUpperCase()} calculators</h1>
      <ul className="space-y-1">
        {items.map(i => (
          <li key={i.locale + ':' + i.slug}>
            <Link className="text-blue-600 hover:underline" href={`/${i.locale}/${i.slug}`}>
              /{i.locale}/{i.slug}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
TSX

echo "✅ Locale indexes added. Try: /en and /it"
