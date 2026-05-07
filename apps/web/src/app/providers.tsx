import type { PropsWithChildren } from "react";
import { Toaster } from "@foodflow/ui";
import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
