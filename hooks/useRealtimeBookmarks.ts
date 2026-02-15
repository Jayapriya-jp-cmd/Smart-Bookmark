'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Bookmark } from '@/lib/types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeBookmarksProps {
  userId: string;
  onInsert?: (bookmark: Bookmark) => void;
  onUpdate?: (bookmark: Bookmark) => void;
  onDelete?: (oldBookmark: { id: string }) => void;
  onAnyChange?: () => void;
}

export function useRealtimeBookmarks({
  userId,
  onInsert,
  onUpdate,
  onDelete,
  onAnyChange,
}: UseRealtimeBookmarksProps) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Create unique channel name for this user
    const channelName = `bookmarks-realtime-${userId}-${Date.now()}`;

    // Subscribe to realtime changes
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime INSERT:', payload);
          onInsert?.(payload.new as Bookmark);
          onAnyChange?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime UPDATE:', payload);
          onUpdate?.(payload.new as Bookmark);
          onAnyChange?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime DELETE:', payload);
          onDelete?.(payload.old as { id: string });
          onAnyChange?.();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    channelRef.current = channel;

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, onInsert, onUpdate, onDelete, onAnyChange]);

  return channelRef;
}
