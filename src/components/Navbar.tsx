"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center mr-4">
              <span className="text-xl font-bold text-blue-700">과천 G타운 PM</span>
            </div>
            <div className="flex space-x-1 lg:space-x-4 items-center overflow-x-auto">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                종합 대시보드
              </Link>
              <Link
                href="/direct-cost"
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === '/direct-cost'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                직접공사비 내역
              </Link>
              <Link
                href="/schedule"
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === '/schedule'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                종합 공정표
              </Link>
              <Link
                href="/resources"
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === '/resources'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                투입 계획
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
