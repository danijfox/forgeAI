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
    // This function is the key. It processes the redirect result from Google.
    const processRedirect = async () => {
      try {
        // This will be null if the user just visited the page normally.
        // It will contain the user credential if they just came back from the redirect.
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("DEBUG: getRedirectResult successful!", { user: result.user });
        }
      } catch (error) {
        console.error("DEBUG: Error processing redirect result.", error);
      }
    };

    // Process the redirect result first.
    processRedirect();

    // Then, set up the onAuthStateChanged listener. This will fire after
    // getRedirectResult completes, and also for any subsequent auth changes.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`DEBUG: onAuthStateChanged event fired. User is: ${user ? user.displayName : 'null'}`);
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
