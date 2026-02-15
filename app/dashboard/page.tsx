'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@/lib/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import Navbar from '@/components/Navbar';
import InteractiveStatsCards from '@/components/InteractiveStatsCards';
import AddBookmark from '@/components/AddBookmark';
import BookmarkList from '@/components/BookmarkList';
type StatsFilter = 'all' | 'today' | 'week';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatsFilter>('all');

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/signin');
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email || undefined,
      });
      setAuthLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const { bookmarks, loading: bookmarksLoading, error, addBookmark, deleteBookmark, refetch } = useBookmarks(
    user?.id ?? null
  );

  const combinedLoading = authLoading || bookmarksLoading;

  const filteredBookmarks = useMemo(() => {
    if (!bookmarks.length) return bookmarks;

    if (activeFilter === 'all') return bookmarks;

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (activeFilter === 'today') {
      return bookmarks.filter((b) => new Date(b.created_at) >= todayStart);
    }

    if (activeFilter === 'week') {
      return bookmarks.filter((b) => new Date(b.created_at) >= sevenDaysAgo);
    }

    return bookmarks;
  }, [bookmarks, activeFilter]);

  if (combinedLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {user && <Navbar user={user} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-gray-600 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <div className="fixed inset-0 -z-10 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(99,102,241,0.08),_transparent_55%)]" />
      </div>

      <Navbar user={user} />

      <main className="relative max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full flex-1">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 mb-3">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </span>
              <span className="text-xs font-medium text-green-700">Live sync enabled</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Smart Bookmark Dashboard
            </h1>
          </div>
        </header>

        <section className="mb-6">
          <InteractiveStatsCards
            bookmarks={bookmarks}
            loading={bookmarksLoading}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
          <section className="space-y-4">
            <AddBookmark
              onAdd={async (title, url) => {
                const result = await addBookmark(title, url);
                if (result) {
                  setActiveFilter('all');
                }
                return result;
              }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </span>
                      Your bookmarks
                    </h2>
                    <p className="mt-1 text-xs text-gray-600">
                      All your saved links, automatically organized and synced. Use the stats above to focus on
                      today or this week.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Showing: {activeFilter === 'today' ? 'Today' : activeFilter === 'week' ? 'This Week' : 'All'} Bookmarks ({filteredBookmarks.length})
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <BookmarkList
                  userId={user.id}
                  bookmarks={filteredBookmarks}
                  loading={bookmarksLoading}
                  error={error}
                  onDelete={deleteBookmark}
                  onRefetch={refetch}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.25 9.75L9 12l2.25 2.25M15 9.75L17.25 12 15 14.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      Smart insights
                    </h2>
                    <p className="mt-1 text-xs text-gray-700 max-w-xs">
                      Gain a quick overview of your saving habits and how active you&apos;ve been recently.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 text-xs text-gray-700">
                  <div className="flex items-center justify-between bg-white/80 rounded-xl px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Private by default</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Protected with RLS</span>
                  </div>

                  <div className="flex items-center justify-between bg-white/80 rounded-xl px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L15 12 9.75 7" />
                        </svg>
                      </span>
                      <span>Blazing fast search</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Local & instant</span>
                  </div>

                  <div className="flex items-center justify-between bg-white/80 rounded-xl px-3 py-2 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      </span>
                      <span>Production-ready stack</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Next.js + Supabase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                  </svg>
                </span>
                Tips
              </h2>
              <ul className="mt-2 space-y-2 text-xs text-gray-700">
                <li>
                  Start by saving your most-used tools, docs, and dashboards. Smart Bookmark works best as your
                  personal launchpad.
                </li>
                <li>
                  Use the search bar above your list to instantly filter by title or URL. It&apos;s completely client-side
                  and blazing fast.
                </li>
                <li>
                  All your bookmarks are isolated to your Supabase user account, protected with row-level security
                  (RLS) policies.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
