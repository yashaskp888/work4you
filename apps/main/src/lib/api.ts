import { API_URL } from "@/lib/utils";

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const res = await fetch(`${API_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        message: (data as { message?: string }).message || `Request failed (${res.status})`,
      };
    }
    return { ok: true, data: data as T };
  } catch {
    return {
      ok: false,
      message:
        "Cannot reach the API server. Start it with: npm run dev:server — then run npm run seed --workspace=server if this is your first login.",
    };
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    const data = await res.json();
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}
