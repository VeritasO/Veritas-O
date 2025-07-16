// client/src/lib/queryClient.ts
import axios from "axios";

/**
 * Veritas-aware API request wrapper.
 * Includes grief tier transmission, error surface expansion, and restoration-first formatting.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: any
): Promise<any> {
  const config = {
    method,
    url,
    data,
    headers: {
      "Content-Type": "application/json",
      ...(data?.griefTier && {
        "X-Grief-Tier": data.griefTier.toString(),
      }),
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const grief = error.response.headers["x-grief-feedback"];
      const msg = `API error: ${error.response.status} – ${error.response.data?.error || error.response.statusText}`;
      console.error("[GRIEF RETURNED]", grief);
      throw new Error(msg);
    }
    throw new Error(`API request failed: ${error.message || "Unknown error"}`);
  }
}
