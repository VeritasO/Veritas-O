import axios from "axios";

export async function apiRequest(method: string, url: string, data?: any) {
  const config = {
    method,
    url,
    data,
    headers: {
      "Content-Type": "application/json",
      ...(data?.griefTier && { 'X-Grief-Tier': data.griefTier.toString() }),
    },
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`API error: ${error.response.status} – ${error.response.data?.error || error.response.statusText}`);
    }
    throw new Error(`API request failed: ${error.message || "Unknown error"}`);
  }
}
