'use client';

export default function BookmarkSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-4">
        {/* Favicon skeleton */}
        <div className="w-12 h-12 rounded-xl bg-gray-200" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
          <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BookmarkSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <BookmarkSkeleton key={index} />
      ))}
    </div>
  );
}
