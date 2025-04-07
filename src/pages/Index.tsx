
import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Galactic Scientific Calculator
      </h1>
      <Calculator />
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p className="mb-1">Scientific Calculator with Trigonometric and Logarithmic Functions</p>
        <p>Use keyboard shortcuts for quick calculations</p>
      </footer>
    </div>
  );
};

export default Index;
