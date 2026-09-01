import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-700">과천 G타운 PM</span>
            </div>
            <div className="flex ml-4 space-x-4 overflow-x-auto whitespace-nowrap scrollbar-hide items-center">
              <Link href="/" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                비용/직접공사
              </Link>
              <Link href="/schedule" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                종합 공정표
              </Link>
              <Link href="/resources" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                투입 계획
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
