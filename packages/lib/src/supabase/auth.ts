import type { Session, User } from "@supabase/supabase-js";
import type { FoodFlowSupabaseClient } from "./client";

export type AuthState = {
  session: Session | null;
  user: User | null;
};

export async function getAuthState(client: FoodFlowSupabaseClient): Promise<AuthState> {
  const {
    data: { session },
    error
  } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return {
    session,
    user: session?.user ?? null
  };
}

export async function signOut(client: FoodFlowSupabaseClient) {
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}
