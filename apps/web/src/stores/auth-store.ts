import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Session } from "@supabase/supabase-js";
import type { ProfileRow, StaffSession } from "@/features/auth/types";

type AuthStoreState = {
  isLoading: boolean;
  isOnline: boolean;
  supabaseSession: Session | null;
  profile: ProfileRow | null;
  staffSession: StaffSession | null;
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
  setSupabaseSession: (session: Session | null) => void;
  setProfile: (profile: ProfileRow | null) => void;
  setStaffSession: (session: StaffSession | null) => void;
  clearAll: () => void;
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isLoading: true,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      supabaseSession: null,
      profile: null,
      staffSession: null,
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      setOnline: (online) => {
        set({ isOnline: online });
      },
      setSupabaseSession: (session) => {
        set({ supabaseSession: session });
      },
      setProfile: (profile) => {
        set({ profile });
      },
      setStaffSession: (session) => {
        set({ staffSession: session });
      },
      clearAll: () => {
        set({
          supabaseSession: null,
          profile: null,
          staffSession: null,
          isLoading: false
        });
      }
    }),
    {
      name: "foodflow-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        staffSession: state.staffSession
      })
    }
  )
);
