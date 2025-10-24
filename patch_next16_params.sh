#!/usr/bin/env bash
set -euo pipefail

FILE="src/app/[locale]/[...slug]/page.tsx"
[ -f "$FILE" ] || { echo "File not found: $FILE"; exit 1; }

cat > "$FILE" <<'TSX'
import { getCalculatorSpec } from '@/lib/registry';
import { CalculatorClient } from '@/components/CalculatorRenderer/Client';
import { buildJsonLd } from '@/lib/seo/jsonld';
import React from 'react';

type RouteParams = { locale: string; slug: string[] };

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  // Next 16: params is a Promise → must await
  const { locale, slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join('/') : '';

  const spec: any = await getCalculatorSpec(locale, slugPath);

  if (!spec) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-gray-600">This calculator does not exist.</p>
      </main>
    );
  }

  const jsonLd = buildJsonLd(spec);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex gap-2">
          <li><a href={`/${locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li>{spec.category}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold">{spec.title}</h1>
      <p className="text-gray-600">{spec.description}</p>
      <CalculatorClient spec={spec} />
      {spec?.faq?.length ? (
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-2">FAQ</h2>
          <div className="space-y-3">
            {spec.faq.map((f: any, idx: number) => (
              <details key={idx} className="border rounded-md p-3">
                <summary className="font-medium">{f.q}</summary>
                <div className="mt-2 text-gray-700">{f.aMd}</div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
TSX

echo "Patched: $FILE"
