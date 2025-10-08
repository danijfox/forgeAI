"use client";

import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs once when the component mounts.
    const initializeAuth = async () => {
      try {
        // First, check if the user is coming back from a redirect sign-in.
        // This promise resolves with the user credential, or null if not a redirect.
        const result = await getRedirectResult(auth);
        if (result) {
          // A user has successfully signed in via redirect.
          // The onAuthStateChanged listener below will now handle setting the user state.
          console.log("DEBUG: getRedirectResult successful!", { user: result.user.displayName });
        }

        // After processing the redirect, set up the listener for ongoing auth state changes.
        // This will also fire immediately with the current state (either from the redirect or from a saved session).
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log(`DEBUG: onAuthStateChanged event fired. User is: ${user ? user.displayName : 'null'}`);
          setUser(user);
          setLoading(false);
        });
        
        // Return the cleanup function for the listener.
        return unsubscribe;

      } catch (error) {
        // If anything fails during initialization, log the error and stop loading.
        console.error("DEBUG: Error during auth initialization.", error);
        setLoading(false);
        return () => {}; // Return an empty cleanup function on error.
      }
    };

    let unsubscribePromise = initializeAuth();

    // The actual cleanup function for useEffect will be the resolved value of the promise.
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
