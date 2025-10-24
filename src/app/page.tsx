import Link from 'next/link';
export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Socalsolver Refactor</h1>
      <p>Select a language:</p>
      <ul className="list-disc pl-6">
        <li><Link href="/en/convert-pressure">EN — Pressure Converter</Link></li>
        <li><Link href="/it/converti-pressione">IT — Convertitore Pressione</Link></li>
      </ul>
    </main>
  );
}
