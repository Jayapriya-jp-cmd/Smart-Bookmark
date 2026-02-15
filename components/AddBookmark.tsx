'use client';

import { useState } from 'react';
import { validateAndNormalizeUrl } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface AddBookmarkProps {
  onAdd: (title: string, url: string) => Promise<boolean>;
}

export default function AddBookmark({ onAdd }: AddBookmarkProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      const { isValid } = validateAndNormalizeUrl(value);
      setUrlError(isValid ? null : 'Please enter a valid URL');
    } else {
      setUrlError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a title', 'warning');
      return;
    }

    if (!url.trim()) {
      showToast('Please enter a URL', 'warning');
      return;
    }

    const { isValid, url: normalizedUrl } = validateAndNormalizeUrl(url);
    if (!isValid) {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    setLoading(true);

    const success = await onAdd(title.trim(), normalizedUrl);

    if (success) {
      setTitle('');
      setUrl('');
      setUrlError(null);
      showToast('Bookmark added successfully!', 'success');
    } else {
      showToast('Failed to add bookmark', 'error');
    }

    setLoading(false);
  };

  const isValid = title.trim() && url.trim() && !urlError;

  return (
    <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
      {/* Background gradient decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Bookmark</h2>
            <p className="text-sm text-gray-500">Save your favorite links</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My favorite website"
              className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm ${
                  urlError ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={loading}
              />
              {url && !urlError && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            {urlError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {urlError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding bookmark...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Add Bookmark
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
