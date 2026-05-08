import { z } from "npm:zod@3.24.2";
import {
  optionsResponse,
  badRequestResponse,
  serverErrorResponse,
  jsonResponse
} from "../_shared/http.ts";
import { createServiceClient } from "../_shared/supabase.ts";
import { normalizeOutletCode, sanitizeEmail } from "../_shared/security.ts";

const tenantBootstrapSchema = z.object({
  tenant: z.object({
    name: z.string().min(2).max(120),
    slug: z
      .string()
      .min(2)
      .max(80)
      .regex(/^[a-z0-9-]+$/),
    plan: z.string().default("starter")
  }),
  outlet: z.object({
    name: z.string().min(2).max(120),
    code: z.string().min(2).max(24),
    address: z.string().max(240).optional()
  }),
  owner: z.object({
    full_name: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(128)
  })
});

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (request.method !== "POST") {
    return badRequestResponse("Method not allowed");
  }

  try {
    const payload = tenantBootstrapSchema.safeParse(await request.json());

    if (!payload.success) {
      return badRequestResponse("Invalid payload", payload.error.issues);
    }

    const supabase = createServiceClient();

    const ownerEmail = sanitizeEmail(payload.data.owner.email);
    if (!ownerEmail) {
      return badRequestResponse("Owner email is required");
    }

    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: payload.data.tenant.name,
        slug: payload.data.tenant.slug,
        plan: payload.data.tenant.plan
      })
      .select("id, name, slug, plan")
      .single();

    if (tenantError || !tenant) {
      return badRequestResponse("Tenant slug already in use or tenant creation failed");
    }

    const { data: outlet, error: outletError } = await supabase
      .from("outlets")
      .insert({
        tenant_id: tenant.id,
        name: payload.data.outlet.name,
        code: normalizeOutletCode(payload.data.outlet.code),
        address: payload.data.outlet.address ?? null,
        is_active: true
      })
      .select("id, code")
      .single();

    if (outletError || !outlet) {
      await supabase.from("tenants").delete().eq("id", tenant.id);
      return badRequestResponse("Outlet code already in use or outlet creation failed");
    }

    const { data: ownerUser, error: ownerUserError } = await supabase.auth.admin.createUser({
      email: ownerEmail,
      password: payload.data.owner.password,
      email_confirm: true,
      app_metadata: {
        role: "owner",
        tenant_id: tenant.id
      }
    });

    if (ownerUserError || !ownerUser.user) {
      await supabase.from("outlets").delete().eq("id", outlet.id);
      await supabase.from("tenants").delete().eq("id", tenant.id);
      return badRequestResponse("Owner account creation failed");
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: ownerUser.user.id,
      tenant_id: tenant.id,
      outlet_id: outlet.id,
      role: "owner",
      full_name: payload.data.owner.full_name,
      email: ownerEmail,
      is_active: true
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(ownerUser.user.id);
      await supabase.from("outlets").delete().eq("id", outlet.id);
      await supabase.from("tenants").delete().eq("id", tenant.id);
      return serverErrorResponse("Owner profile creation failed");
    }

    return jsonResponse({
      tenant,
      outlet,
      owner_id: ownerUser.user.id
    });
  } catch {
    return serverErrorResponse();
  }
});
