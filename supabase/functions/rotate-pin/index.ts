import { z } from "npm:zod@3.24.2";
import {
  optionsResponse,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  jsonResponse
} from "../_shared/http.ts";
import { createAuthedClient, createServiceClient } from "../_shared/supabase.ts";
import { hashPin } from "../_shared/security.ts";

const rotatePinSchema = z.object({
  profile_id: z.string().uuid(),
  new_pin: z.string().regex(/^\d{4,8}$/)
});

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (request.method !== "POST") {
    return badRequestResponse("Method not allowed");
  }

  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return unauthorizedResponse();
    }

    const payload = rotatePinSchema.safeParse(await request.json());
    if (!payload.success) {
      return badRequestResponse("Invalid payload", payload.error.issues);
    }

    const authedClient = createAuthedClient(token);
    const serviceClient = createServiceClient();

    const {
      data: { user },
      error: userError
    } = await authedClient.auth.getUser();

    if (userError || !user) {
      return unauthorizedResponse();
    }

    const { data: actorProfile, error: actorError } = await serviceClient
      .from("profiles")
      .select("id, role, tenant_id, outlet_id")
      .eq("id", user.id)
      .single();

    if (actorError || !actorProfile) {
      return unauthorizedResponse();
    }

    const canRotate = actorProfile.role === "owner" || actorProfile.role === "manager";
    if (!canRotate) {
      return unauthorizedResponse("Insufficient permissions");
    }

    const { data: targetProfile, error: targetError } = await serviceClient
      .from("profiles")
      .select("id, role, tenant_id, outlet_id")
      .eq("id", payload.data.profile_id)
      .eq("role", "staff")
      .single();

    if (targetError || !targetProfile || targetProfile.tenant_id !== actorProfile.tenant_id) {
      return badRequestResponse("Invalid target profile");
    }

    if (actorProfile.role === "manager" && actorProfile.outlet_id !== targetProfile.outlet_id) {
      return unauthorizedResponse("Managers can only rotate staff PINs in assigned outlet");
    }

    const pinHash = await hashPin(payload.data.new_pin);

    const { error: updateError } = await serviceClient
      .from("profiles")
      .update({ pin_hash: pinHash })
      .eq("id", payload.data.profile_id);

    if (updateError) {
      return serverErrorResponse("Could not rotate PIN");
    }

    await serviceClient
      .from("staff_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("profile_id", payload.data.profile_id)
      .is("revoked_at", null);

    return jsonResponse({ ok: true });
  } catch {
    return serverErrorResponse();
  }
});
