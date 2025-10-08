"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function AuthHandler() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication state is determined
    if (!loading) {
      if (user) {
        // If the user is authenticated, redirect to the dashboard
        router.push('/dashboard');
      } else {
        // If the user is not authenticated, redirect to the login page
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // This component does not render anything itself
  return null;
}
