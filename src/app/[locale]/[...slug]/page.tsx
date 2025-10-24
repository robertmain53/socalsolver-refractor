import { getCalculatorSpec } from '@/lib/registry';
import { CalculatorClient } from '@/components/CalculatorRenderer/Client';
import { buildJsonLd } from '@/lib/seo/jsonld';

export default async function Page({ params }: { params: { locale: string; slug: string[] } }) {
  const slug = params.slug.join('/');
  const spec = await getCalculatorSpec(params.locale, slug);
  if (!spec) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-gray-600">This calculator does not exist.</p>
      </main>
    );
  }

  const jsonLd = buildJsonLd(spec as any);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
        <ol className="flex gap-2">
          <li><a href={`/${params.locale}`} className="hover:underline">Home</a></li>
          <li>/</li>
          <li>{spec.category}</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold">{spec.title}</h1>
      <p className="text-gray-600">{spec.description}</p>
      <CalculatorClient spec={spec as any} />
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
