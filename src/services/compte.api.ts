

const API_BASE_URL = '/olive_app';

export interface ComptePayload {
  reference?: string;
  id?: number;
  compteId?: number;
  name: string;
  mobile: string;
  priceKg: number;
  isBaseCompte: boolean;
}

async function sendCompteRequest(
  endpoint: string,
  payload: ComptePayload,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  console.log('Endpoint :', `${API_BASE_URL}${endpoint}`);
  console.log('Statut HTTP :', response.status);
  console.log('Réponse API :', responseText);

  if (!response.ok) {
    throw new Error(
      `Erreur HTTP ${response.status}: ${
        responseText || response.statusText
      }`,
    );
  }

  if (!responseText.trim()) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

// Ajouter un compte
export function saveCompte(
  payload: ComptePayload,
): Promise<unknown> {
  return sendCompteRequest('/compte/save', payload);
}

// Modifier un compte
export function updateCompte(
  payload: ComptePayload,
): Promise<unknown> {
  return sendCompteRequest('/compte/update', payload);
}
