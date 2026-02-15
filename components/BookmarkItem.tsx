'use client';

import { useState } from 'react';
import { Bookmark } from '@/lib/types';
import { formatRelativeTime, getFaviconUrl, copyToClipboard, extractDomain } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<boolean>;
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    const success = await onDelete(bookmark.id);
    
    if (success) {
      showToast('Bookmark deleted', 'success');
    } else {
      showToast('Failed to delete bookmark', 'error');
      setDeleting(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(bookmark.url);
    if (success) {
      showToast('Link copied to clipboard', 'success');
    } else {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const domain = extractDomain(bookmark.url);
  const faviconUrl = getFaviconUrl(bookmark.url, 64);

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 ${
        deleting ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start gap-4">
        {/* Favicon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
            {!imageError && faviconUrl ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-7 h-7 object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-500 truncate block transition-colors"
          >
            {domain || bookmark.url}
          </a>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatRelativeTime(bookmark.created_at)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="Copy link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Open in new tab */}
          <button
            onClick={handleOpenInNewTab}
            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
            title="Open in new tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete bookmark"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
