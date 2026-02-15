'use client';

import { useState, useCallback, useMemo } from 'react';
import { Bookmark } from '@/lib/types';
import { useRealtimeBookmarks } from '@/hooks/useRealtimeBookmarks';
import BookmarkItem from './BookmarkItem';
import { BookmarkSkeletonList } from './BookmarkSkeleton';
import SearchInput from './SearchInput';
import EmptyState from './EmptyState';

interface BookmarkListProps {
  userId: string;
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => Promise<boolean>;
  onRefetch: () => Promise<void>;
}

export default function BookmarkList({
  userId,
  bookmarks,
  loading,
  error,
  onDelete,
  onRefetch,
}: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Set up realtime subscription for external changes (other tabs)
  const handleRealtimeChange = useCallback(() => {
    onRefetch();
  }, [onRefetch]);

  useRealtimeBookmarks({
    userId,
    onAnyChange: handleRealtimeChange,
  });

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
    );
  }, [bookmarks, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Bookmarks</h2>
        </div>
        <BookmarkSkeletonList count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load bookmarks</h3>
            <p className="text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={onRefetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Bookmarks</h2>
          <p className="text-sm text-gray-500">
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Search */}
        {bookmarks.length > 0 && (
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search bookmarks..."
            />
          </div>
        )}
      </div>

      {/* Bookmarks List or Empty State */}
      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyState
            title="No bookmarks yet"
            description="Start saving your favorite websites! Add your first bookmark using the form above."
          />
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <EmptyState
            title="No results found"
            description={`No bookmarks match "${searchQuery}". Try a different search term.`}
            icon={
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
