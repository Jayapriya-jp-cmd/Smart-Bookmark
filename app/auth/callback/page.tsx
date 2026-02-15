'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Auth callback error:', error);
        router.push('/signin?error=auth_failed');
        return;
      }

      // Successfully authenticated, redirect to dashboard
      router.push('/dashboard');
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-600 font-medium">Completing sign in...</p>
        <p className="text-gray-400 text-sm">You'll be redirected shortly</p>
      </div>
    </div>
  );
}
