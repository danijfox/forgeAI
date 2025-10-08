"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log(`DEBUG: Home page rendering. State is: loading=${loading}, user=${user ? user.displayName : 'null'}`);

  useEffect(() => {
    console.log(`DEBUG: Home page useEffect triggered. State is: loading=${loading}, user=${user ? user.displayName : 'null'}`);
    
    if (!loading) {
      if (user) {
        console.log("DEBUG: Home page redirecting to /dashboard because user is authenticated.");
        router.replace("/dashboard");
      } else {
        console.log("DEBUG: Home page redirecting to /login because user is NOT authenticated.");
        router.replace("/login");
      }
    } else {
      console.log("DEBUG: Home page useEffect waiting because auth state is loading.");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
