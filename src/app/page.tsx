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
