import { supabase } from "@/lib/supabase";
import type { AssignedMode, StaffSession } from "@/features/auth/types";
import { z } from "zod";

type StaffLoginResponse = {
  session_type: "staff";
  session_token: string;
  expires_at: string;
  profile: {
    id: string;
    tenant_id: string;
    outlet_id: string;
    role: "staff";
    assigned_mode: AssignedMode;
    full_name: string;
    outlet_code: string;
  };
};

const staffLoginResponseSchema = z.object({
  session_type: z.literal("staff"),
  session_token: z.string().min(1),
  expires_at: z.string().min(1),
  profile: z.object({
    id: z.string().min(1),
    tenant_id: z.string().min(1),
    outlet_id: z.string().min(1),
    role: z.literal("staff"),
    assigned_mode: z.union([z.literal("pos"), z.literal("kds")]),
    full_name: z.string().min(1),
    outlet_code: z.string().min(1)
  })
});

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }

  return data;
}

export async function signupOwner(payload: {
  tenant: { name: string; slug: string; plan: string };
  outlet: { name: string; code: string; address?: string };
  owner: { full_name: string; email: string; password: string };
}) {
  const response = (await supabase.functions.invoke("tenant-bootstrap", {
    body: payload
  })) as { error: Error | null };

  if (response.error) {
    throw response.error;
  }
}

export async function loginStaff(payload: { outletCode: string; pin: string }) {
  const response = (await supabase.functions.invoke("staff-login", {
    body: {
      outlet_code: payload.outletCode,
      pin: payload.pin
    }
  })) as { data: unknown; error: Error | null };

  console.log("[auth-api] staff-login response", { error: response.error, data: response.data });

  if (response.error) {
    throw response.error;
  }

  const parsed = staffLoginResponseSchema.safeParse(response.data);
  console.log("[auth-api] schema parse", {
    success: parsed.success,
    issues: parsed.success ? null : parsed.error.issues
  });
  if (!parsed.success) {
    throw new Error(`Schema parse failed: ${JSON.stringify(parsed.error.issues)}`);
  }

  const parsedData: StaffLoginResponse = parsed.data;

  const staffSession: StaffSession = {
    sessionType: "staff",
    sessionToken: parsedData.session_token,
    expiresAt: parsedData.expires_at,
    profileId: parsedData.profile.id,
    tenantId: parsedData.profile.tenant_id,
    outletId: parsedData.profile.outlet_id,
    role: "staff",
    assignedMode: parsedData.profile.assigned_mode,
    fullName: parsedData.profile.full_name,
    outletCode: parsedData.profile.outlet_code
  };

  return staffSession;
}

export async function logoutEmailSession() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
