
const API_BASE_URL = 'http://72.62.191.179:8080/olive_app';

async function sendSeasonRequest(
  endpoint: string,
  payload: Record<string, unknown>,
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

  console.log('Endpoint saison :', endpoint);
  console.log('Statut HTTP :', response.status);
  console.log('Réponse API :', responseText);

  if (!response.ok) {
    throw new Error(
      `Erreur HTTP ${response.status}: ${
        responseText || response.statusText
      }`,
    );
  }

  if (!responseText.trim()) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export const saveSeason = (payload: Record<string, unknown>) =>
  sendSeasonRequest('/season/saveBean', payload);

export const updateSeason = (payload: Record<string, unknown>) =>
  sendSeasonRequest('/season/updateBean', payload);
