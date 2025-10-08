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
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    let unsubscribe = () => {};
    console.log("DEBUG: AuthProvider useEffect starts.");

    // First, check for a redirect result. This is a one-time operation.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This means the user just signed in via redirect.
          // The onAuthStateChanged listener will handle setting the user.
          console.log(`DEBUG: Redirect result processed for user: ${result.user.displayName}`);
        } else {
          // This is a normal page load, not a redirect.
          console.log("DEBUG: No redirect result found.");
        }
      })
      .catch((error) => {
        // Handle errors from the redirect process.
        console.error("DEBUG: Error processing redirect result.", error);
      })
      .finally(() => {
        // AFTER attempting to process the redirect, set up the persistent listener.
        // This listener is the single source of truth for the auth state.
        console.log("DEBUG: Setting up onAuthStateChanged listener.");
        unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log(`DEBUG: onAuthStateChanged event fired. User is: ${user ? user.displayName : 'null'}`);
          setUser(user);
          // Now we have a definitive answer, so we can stop loading.
          setLoading(false);
          console.log("DEBUG: Loading state set to false.");
        });
      });

    // Cleanup function for useEffect.
    return () => {
      console.log("DEBUG: AuthProvider useEffect cleanup.");
      unsubscribe();
    };
  }, []);

  console.log(`DEBUG: AuthProvider rendering. State is: loading=${loading}, user=${user ? user.displayName : 'null'}`);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
