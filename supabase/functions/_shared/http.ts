import { corsHeaders } from "./cors.ts";

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...headers
    }
  });
}

export function optionsResponse() {
  return new Response("ok", { headers: corsHeaders });
}

export function unauthorizedResponse(message = "Unauthorized") {
  return jsonResponse({ error: message }, 401);
}

export function badRequestResponse(message: string, details?: unknown) {
  return jsonResponse({ error: message, details }, 400);
}

export function serverErrorResponse(message = "Internal server error") {
  return jsonResponse({ error: message }, 500);
}
