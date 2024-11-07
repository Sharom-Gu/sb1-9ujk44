import TherapyDocumentation from '@/components/TherapyDocumentation';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900">ADHS-Therapie Dokumentation</h1>
        </div>
      </header>
      <TherapyDocumentation />
    </div>
  );
}

export default App;