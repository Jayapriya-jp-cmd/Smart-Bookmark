'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Bookmark } from '@/lib/types';

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  addBookmark: (title: string, url: string) => Promise<boolean>;
  deleteBookmark: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useBookmarks(userId: string | null): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      // No user yet – clear data and stop loading
      setBookmarks([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookmarks(data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addBookmark = useCallback(async (title: string, url: string): Promise<boolean> => {
    if (!userId) return false;

    // Optimistic update - add temp bookmark
    const tempId = `temp-${Date.now()}`;
    const tempBookmark: Bookmark = {
      id: tempId,
      user_id: userId,
      title,
      url,
      created_at: new Date().toISOString(),
    };

    setBookmarks(prev => [tempBookmark, ...prev]);

    try {
      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert({ title, url, user_id: userId })
        .select()
        .single();

      if (insertError) throw insertError;

      // Replace temp bookmark with real one
      setBookmarks(prev => prev.map(b => b.id === tempId ? data : b));
      return true;
    } catch (err) {
      // Rollback on error
      setBookmarks(prev => prev.filter(b => b.id !== tempId));
      console.error('Error adding bookmark:', err);
      return false;
    }
  }, [userId]);

  const deleteBookmark = useCallback(async (id: string): Promise<boolean> => {
    // Store for rollback
    const bookmarkToDelete = bookmarks.find(b => b.id === id);
    
    // Optimistic update
    setBookmarks(prev => prev.filter(b => b.id !== id));

    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      // Rollback on error
      if (bookmarkToDelete) {
        setBookmarks(prev => [bookmarkToDelete, ...prev]);
      }
      console.error('Error deleting bookmark:', err);
      return false;
    }
  }, [userId, bookmarks]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    refetch: fetchBookmarks,
  };
}
