import type { FoodFlowSupabaseClient } from "./client";

export function getPublicAssetUrl(
  client: FoodFlowSupabaseClient,
  bucket: string,
  path: string
): string {
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createSignedAssetUrl(
  client: FoodFlowSupabaseClient,
  bucket: string,
  path: string,
  expiresInSeconds = 60
) {
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
