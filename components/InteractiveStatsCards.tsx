'use client';

import { Bookmark } from '@/lib/types';

interface InteractiveStatsCardsProps {
  bookmarks: Bookmark[];
  loading: boolean;
  activeFilter: 'all' | 'today' | 'week';
  onFilterChange: (filter: 'all' | 'today' | 'week') => void;
}

export default function InteractiveStatsCards({
  bookmarks,
  loading,
  activeFilter,
  onFilterChange,
}: InteractiveStatsCardsProps) {
  // Calculate stats
  const totalBookmarks = bookmarks.length;

  // Count bookmarks added in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyAdded = bookmarks.filter(
    (b) => new Date(b.created_at) > sevenDaysAgo
  ).length;

  // Count bookmarks added today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const addedToday = bookmarks.filter(
    (b) => new Date(b.created_at) >= today
  ).length;

  const stats = [
    {
      label: 'Added Today',
      value: addedToday,
      filter: 'today' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-50 to-amber-50',
    },
    {
      label: 'Added This Week',
      value: recentlyAdded,
      filter: 'week' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      label: 'Total Bookmarks',
      value: totalBookmarks,
      filter: 'all' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-white/50"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <button
          key={stat.filter}
          onClick={() => onFilterChange(stat.filter)}
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 cursor-pointer ${
            activeFilter === stat.filter
              ? `ring-2 ring-blue-500 bg-blue-50 border-blue-200`
              : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-md`
          }`}
        >
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 blur-2xl`}
          />

          <div className="relative flex items-start justify-between">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                {stat.label}
              </p>
              <p
                className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
            </div>
            <div
              className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl text-white shadow-lg flex items-center justify-center flex-shrink-0`}
            >
              {stat.icon}
            </div>
          </div>

          {activeFilter === stat.filter && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Active filter
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
