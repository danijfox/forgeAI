"use client";

import { useState } from "react";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // This function now ONLY starts the sign-in process.
  // The AuthProvider is responsible for handling the result.
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    // No 'await' is needed here, as the user is redirected away.
    signInWithRedirect(auth, provider);
  };

  return (
    <div className="w-full max-w-sm text-center">
      <Icons.logo className="mx-auto h-12 w-auto" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
        DataForge AI
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sign in to unlock the power of your documents.
      </p>
      <div className="mt-8">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full"
          size="lg"
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Sign in with Google
        </Button>
      </div>
       <p className="mt-8 text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
