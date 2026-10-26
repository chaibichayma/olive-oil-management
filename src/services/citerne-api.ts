
const API_BASE_URL = "/olive_app/citerne";

export interface CiternePayload {
  citerneId?: number;
  reference: string;
  libelle: string;
  capacity: number;
  createdDate?: string;
  searche?: string;
  id?: Record<string, unknown>;
}

async function request<T>(
  endpoint: string,
  payload?: CiternePayload,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: payload ? "POST" : "GET",
    headers: {
      Accept: "application/json",
      ...(payload ? { "Content-Type": "application/json" } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Erreur HTTP ${response.status}: ${text || response.statusText}`,
    );
  }

  if (!text.trim()) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

export const citerneApi = {
  getList: () => request<unknown>("/getListBean"),

  ajouter: (payload: CiternePayload) =>
    request<unknown>("/save", payload),

  modifier: (payload: CiternePayload) =>
    request<unknown>("/update", payload),
};
