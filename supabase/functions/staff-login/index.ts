import { z } from "npm:zod@3.24.2";
import {
  optionsResponse,
  badRequestResponse,
  serverErrorResponse,
  jsonResponse
} from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import {
  generateToken,
  hashPin,
  normalizeOutletCode,
  sha256,
  verifyPin
} from "../_shared/security.ts";

type StaffProfile = {
  id: string;
  tenant_id: string;
  outlet_id: string | null;
  full_name: string;
  assigned_mode: "pos" | "kds" | null;
  pin_hash: string | null;
  is_active: boolean;
};

const staffLoginSchema = z.object({
  outlet_code: z.string().min(2).max(24),
  pin: z.string().regex(/^\d{4,8}$/)
});

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (request.method !== "POST") {
    return badRequestResponse("Method not allowed");
  }

  try {
    const body = staffLoginSchema.safeParse(await request.json());

    if (!body.success) {
      return badRequestResponse("Invalid payload", body.error.issues);
    }

    const outletCode = normalizeOutletCode(body.data.outlet_code);
    const pin = body.data.pin;
    const supabase = createServiceClient();

    const { data: outlet, error: outletError } = await supabase
      .from("outlets")
      .select("id, tenant_id, code, is_active")
      .eq("code", outletCode)
      .eq("is_active", true)
      .single();

    if (outletError || !outlet) {
      return badRequestResponse("Invalid outlet code or PIN");
    }

    const { data: staffProfiles, error: staffError } = await supabase
      .from("profiles")
      .select("id, tenant_id, outlet_id, full_name, assigned_mode, pin_hash, is_active")
      .eq("tenant_id", outlet.tenant_id)
      .eq("outlet_id", outlet.id)
      .eq("role", "staff")
      .eq("is_active", true);

    if (staffError || !staffProfiles || staffProfiles.length === 0) {
      return badRequestResponse("Invalid outlet code or PIN");
    }

    let matchedProfile: StaffProfile | null = null;
    for (const profile of staffProfiles as StaffProfile[]) {
      if (!profile.pin_hash) {
        continue;
      }

      const isValid = await verifyPin(pin, profile.pin_hash);
      if (isValid) {
        matchedProfile = profile;
        break;
      }
    }

    if (!matchedProfile || !matchedProfile.assigned_mode || !matchedProfile.outlet_id) {
      return badRequestResponse("Invalid outlet code or PIN");
    }

    const token = generateToken();
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();

    const { error: sessionInsertError } = await supabase.from("staff_sessions").insert({
      profile_id: matchedProfile.id,
      tenant_id: matchedProfile.tenant_id,
      outlet_id: matchedProfile.outlet_id,
      session_token_hash: tokenHash,
      expires_at: expiresAt
    });

    if (sessionInsertError) {
      return serverErrorResponse("Could not create staff session");
    }

    const cookie = [
      `ff_staff_session=${token}`,
      "Path=/",
      "Max-Age=28800",
      "HttpOnly",
      "Secure",
      "SameSite=Lax"
    ].join("; ");

    return jsonResponse(
      {
        session_type: "staff",
        session_token: token,
        expires_at: expiresAt,
        profile: {
          id: matchedProfile.id,
          tenant_id: matchedProfile.tenant_id,
          outlet_id: matchedProfile.outlet_id,
          role: "staff",
          assigned_mode: matchedProfile.assigned_mode,
          full_name: matchedProfile.full_name,
          outlet_code: outlet.code
        }
      },
      200,
      { "Set-Cookie": cookie }
    );
  } catch {
    return serverErrorResponse();
  }
});
