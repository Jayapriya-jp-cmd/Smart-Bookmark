'use client';

import { Bookmark } from '@/lib/types';

interface StatsCardsProps {
  bookmarks: Bookmark[];
  loading: boolean;
}

export default function StatsCards({ bookmarks, loading }: StatsCardsProps) {
  // Calculate stats
  const totalBookmarks = bookmarks.length;
  
  // Count bookmarks added in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyAdded = bookmarks.filter(
    b => new Date(b.created_at) > sevenDaysAgo
  ).length;

  // Count bookmarks added today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const addedToday = bookmarks.filter(
    b => new Date(b.created_at) >= today
  ).length;

  const stats = [
    {
      label: 'Total Bookmarks',
      value: totalBookmarks,
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
    {
      label: 'Added Today',
      value: addedToday,
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
      label: 'Recently Added',
      value: recentlyAdded,
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
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-shadow`}
        >
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 blur-2xl`}
          />

          <div className="relative flex items-start justify-between">
            <div>
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
              className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl text-white shadow-lg flex items-center justify-center`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}