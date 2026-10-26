
const API_BASE_URL = '/olive_app';

export interface Season {
  id?: number | string | Record<string, unknown>;
  createdUser?: string;
  createdDate?: string;
  search?: string;
  beginDate?: string;
  endDate?: string;
  statusId?: number;
  year?: number;
  priceKilo?: number;
  priceAchat?: number;
  priceVente?: number;
  nbreCaisses?: number;
  [key: string]: unknown;
}


export interface SeasonUpdatePayload {
  createdUser: string;
  createdDate: string;
  createdTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  searche: string;
  beginDate: string;
  endDate: string;
  statusId: number;
  year: number;
  priceKilo: number;
  priceAchat: number;
  priceVente: number;
  nbreCaisses: number;
  id: number | string;
}

export interface SeasonSavePayload {
  createdUser: string;
  createdDate: string;
  createdTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  searche: string;
  beginDate: string;
  endDate: string;
  statusId: number;
  year: number;
  priceKilo: number;
  priceAchat: number;
  priceVente: number;
  nbreCaisses: number;
  id: Record<string, never>;
}

export async function updateSeason(
  payload: SeasonUpdatePayload,
): Promise<Season> {
  const response = await fetch(
    `${API_BASE_URL}/season/update`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  const responseText = await response.text();

  let result: unknown;

  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    throw new Error(
      `Réponse invalide du serveur (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const message =
      result !== null && typeof result === 'object' &&
      'message' in result
        ? String(result.message)
        : `Erreur HTTP ${response.status}`;

    throw new Error(message);
  }

  if (
    result !== null &&
    typeof result === 'object' &&
    'isValid' in result &&
    result.isValid === false
  ) {
    throw new Error(
      'message' in result
        ? String(result.message)
        : 'La modification a échoué.',
    );
  }

  return result as Season;
}


export interface DeleteSeasonResponse {
  message?: string;
  isValid?: boolean;
  messageCode?: string | null;
}


/* =========================================
   Fonction HTTP commune
========================================= */

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage ||
        `Erreur API : ${response.status} ${response.statusText}`,
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

/* =========================================
   GET /season/getId/{id}
   Récupérer une saison par son identifiant
========================================= */

export async function getSeasonById(
  id: number | string,
): Promise<Season> {
  if (
    id === '' ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    throw new Error('Identifiant de saison invalide.');
  }

  return request<Season>(
    `/season/getId/${encodeURIComponent(String(id))}`,
    {
      method: 'GET',
    },
  );
}


export async function saveSeason(
  payload: SeasonSavePayload,
): Promise<Season> {
  const response = await fetch(`${API_BASE_URL}/season/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  let result: unknown = null;

  if (responseText.trim()) {
    try {
      result = JSON.parse(responseText);
    } catch {
      // Garder le texte brut pour afficher l'erreur réelle du serveur.
      result = responseText;
    }
  }

  if (!response.ok) {
    let message = `Erreur HTTP ${response.status}`;

    if (typeof result === 'string' && result.trim()) {
      message = result;
    } else if (result && typeof result === 'object') {
      const data = result as {
        message?: string;
        detail?: string;
        title?: string;
        errors?: unknown;
      };

      message =
        data.message ||
        data.detail ||
        data.title ||
        JSON.stringify(data.errors ?? result);
    }

    console.error('Erreur API saveSeason:', {
      status: response.status,
      response: result,
      payload,
    });

    throw new Error(message);
  }

  if (
    result &&
    typeof result === 'object' &&
    'isValid' in result &&
    result.isValid === false
  ) {
    const data = result as { message?: string };

    throw new Error(
      data.message || "L'ajout de la saison a échoué.",
    );
  }

  return result as Season;
}

/* =========================================
   GET /season/getListBean?searche=
   Récupérer les saisons
========================================= */

export async function getSeasons(searche?: string): Promise<Season[]> {
  const params = new URLSearchParams();

  if (searche?.trim()) {
    params.set('searche', searche.trim());
  }

  const query = params.toString();
  const endpoint = `/season/getListBean${query ? `?${query}` : ''}`;

  return request<Season[]>(endpoint, {
    method: 'GET',
  });
}

/* =========================================
   POST /season/delete/{id}
   Supprimer une saison
========================================= */

export async function deleteSeason(
  id: number | string,
): Promise<DeleteSeasonResponse> {
  if (id === '' || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    throw new Error('Identifiant de saison invalide.');
  }

  const response = await fetch(
    `${API_BASE_URL}/season/delete/${encodeURIComponent(String(id))}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const body = await response.text();

  let result: DeleteSeasonResponse;

  try {
    result = body ? JSON.parse(body) : {};
  } catch {
    throw new Error(
      `Réponse invalide du serveur (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Erreur HTTP ${response.status}.`,
    );
  }

  // Le serveur peut répondre HTTP 200 tout en signalant un échec métier.
  if (result.isValid === false) {
    throw new Error(
      result.message || 'La suppression de la saison a échoué.',
    );
  }

  return result;
}


