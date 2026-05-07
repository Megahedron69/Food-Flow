import { edgeFunctionEnvSchema } from "../../../packages/api-contracts/src/env";

export function getEdgeFunctionEnv() {
  return edgeFunctionEnvSchema.parse(Deno.env.toObject());
}
