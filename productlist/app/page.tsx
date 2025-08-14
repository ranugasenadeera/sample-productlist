import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[2px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Showcase
          </h1>
          <p className="text-gray-600 mb-8">
            Discover amazing products with detailed reviews and ratings. 
            Browse our collection, filter by tags, and find exactly what you're looking for.
          </p>
          
          <Link 
            href="/products"
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg px-8 py-3 rounded-lg transition-colors"
          >
            Browse Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold mb-2 text-gray-600">Advanced Search</h3>
            <p className="text-sm text-gray-600">Search by title and filter by multiple tags</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-semibold  mb-2 text-gray-600">Customer Reviews</h3>
            <p className="text-sm text-gray-600">Read authentic reviews from real customers</p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold mb-2 text-gray-600">Responsive Design</h3>
            <p className="text-sm text-gray-600">Perfect experience on all devices</p>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <span>Built with Next.js, TypeScript & Tailwind CSS</span>
        <span>•</span>
        <span>Data from DummyJSON API</span>
      </footer>
    </div>
  );
}
