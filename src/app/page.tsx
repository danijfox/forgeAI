"use client";

import { Loader2 } from "lucide-react";

export default function Home() {
  // This page now only shows a loading indicator.
  // The redirection logic is handled by the root layout or the protected app layout.
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
