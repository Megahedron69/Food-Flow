import type { Database } from "@foodflow/types";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type AssignedMode = Database["public"]["Enums"]["assigned_mode"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type StaffSession = {
  sessionType: "staff";
  sessionToken: string;
  expiresAt: string;
  profileId: string;
  tenantId: string;
  outletId: string;
  role: "staff";
  assignedMode: AssignedMode;
  fullName: string;
  outletCode: string;
};

export type AuthIdentity =
  | {
      sessionType: "supabase";
      role: UserRole;
      assignedMode: AssignedMode | null;
      tenantId: string | null;
      outletId: string | null;
      displayName: string;
    }
  | {
      sessionType: "staff";
      role: "staff";
      assignedMode: AssignedMode;
      tenantId: string;
      outletId: string;
      displayName: string;
    };
