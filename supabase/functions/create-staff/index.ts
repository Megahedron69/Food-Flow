import { z } from "npm:zod@3.24.2";
import {
  optionsResponse,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  jsonResponse
} from "../_shared/http.ts";
import { createAuthedClient, createServiceClient } from "../_shared/supabase.ts";
import { hashPin, sanitizeEmail } from "../_shared/security.ts";

const createStaffSchema = z.object({
  outlet_id: z.string().uuid(),
  full_name: z.string().min(2).max(80),
  email: z.string().email().optional(),
  assigned_mode: z.enum(["pos", "kds"]),
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
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return unauthorizedResponse();
    }

    const payload = createStaffSchema.safeParse(await request.json());
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

    const canCreateStaff = actorProfile.role === "owner" || actorProfile.role === "manager";
    if (!canCreateStaff) {
      return unauthorizedResponse("Insufficient permissions");
    }

    if (actorProfile.role === "manager" && actorProfile.outlet_id !== payload.data.outlet_id) {
      return unauthorizedResponse("Managers can only create staff in assigned outlet");
    }

    const { data: targetOutlet, error: outletError } = await serviceClient
      .from("outlets")
      .select("id, tenant_id")
      .eq("id", payload.data.outlet_id)
      .single();

    if (outletError || !targetOutlet || targetOutlet.tenant_id !== actorProfile.tenant_id) {
      return badRequestResponse("Invalid outlet for current tenant");
    }

    const normalizedEmail = sanitizeEmail(payload.data.email);
    const syntheticEmail =
      normalizedEmail ??
      `staff.${crypto.randomUUID().replace(/-/g, "")}@${targetOutlet.tenant_id.slice(0, 8)}.foodflow.local`;

    const { data: createdUser, error: createUserError } = await serviceClient.auth.admin.createUser(
      {
        email: syntheticEmail,
        password: crypto.randomUUID(),
        email_confirm: true,
        app_metadata: {
          tenant_id: targetOutlet.tenant_id,
          role: "staff"
        }
      }
    );

    if (createUserError || !createdUser.user) {
      return serverErrorResponse("Unable to create staff account");
    }

    const pinHash = await hashPin(payload.data.pin);

    const { error: profileError } = await serviceClient.from("profiles").insert({
      id: createdUser.user.id,
      tenant_id: targetOutlet.tenant_id,
      outlet_id: payload.data.outlet_id,
      role: "staff",
      assigned_mode: payload.data.assigned_mode,
      full_name: payload.data.full_name,
      email: normalizedEmail,
      pin_hash: pinHash,
      is_active: true
    });

    if (profileError) {
      await serviceClient.auth.admin.deleteUser(createdUser.user.id);
      return serverErrorResponse("Unable to create staff profile");
    }

    return jsonResponse({
      id: createdUser.user.id,
      outlet_id: payload.data.outlet_id,
      role: "staff",
      assigned_mode: payload.data.assigned_mode,
      full_name: payload.data.full_name
    });
  } catch {
    return serverErrorResponse();
  }
});
