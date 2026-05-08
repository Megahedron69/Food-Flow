import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import type { ProfileRow } from "@/features/auth/types";

type AuthContextValue = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const session = useAuthStore((state) => state.supabaseSession);
  const profile = useAuthStore((state) => state.profile);
  const staffSession = useAuthStore((state) => state.staffSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setOnline = useAuthStore((state) => state.setOnline);
  const setSupabaseSession = useAuthStore((state) => state.setSupabaseSession);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setStaffSession = useAuthStore((state) => state.setStaffSession);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true)
        .single();

      setProfile(data ?? null);
    },
    [setProfile]
  );

  useEffect(() => {
    let mounted = true;

    const markOnline = () => {
      setOnline(true);
    };

    const markOffline = () => {
      setOnline(false);
    };

    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);

    if (staffSession) {
      const isExpired = new Date(staffSession.expiresAt).getTime() <= Date.now();
      if (isExpired) {
        setStaffSession(null);
      }
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setSupabaseSession(data.session);

      if (data.session?.user.id) {
        void fetchProfile(data.session.user.id).finally(() => {
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSupabaseSession(nextSession);

      if (nextSession?.user.id) {
        void fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
      subscription.unsubscribe();
    };
  }, [
    fetchProfile,
    setLoading,
    setOnline,
    setProfile,
    setStaffSession,
    setSupabaseSession,
    staffSession
  ]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      session,
      user: session?.user ?? null,
      profile
    }),
    [isLoading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
