import Calculator from "../components/Calculator";
import FAQ from "../components/FAQ";
import JsonLd from "../components/JsonLd";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd />

      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          ⏱️ Time Price
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
          See what things really cost — in hours of your life, not dollars.
        </p>
      </header>

      {/* Main */}
      <main className="px-4 pb-12 space-y-6 max-w-xl mx-auto">
        <Calculator />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 px-4">
        <p className="text-xs text-gray-400">
          Estimates only. Real value depends on your preferences and tax
          situation.
        </p>
      </footer>
    </div>
  );
}
