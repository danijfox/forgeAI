"use client";

import AuthHandler from "@/components/auth-handler";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <AuthHandler />
    </div>
  );
}
