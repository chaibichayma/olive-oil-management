

const API_BASE_URL = 'http://72.62.191.179:8080/olive_app';

// ======================================================
// FONCTION GÉNÉRIQUE POUR APPELER LE BACKEND
// ======================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Erreur API : ${response.status} ${response.statusText}`,
    );
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return responseText as T;
  }
}

// ======================================================
// UTILISATEURS : LISTE ET SUPPRESSION
// ======================================================

export const utilisateurApi = {
  getList: (searche = '') => {
    const params = new URLSearchParams({ searche });

    return apiRequest<unknown[]>(
      `/user/getListBean?${params.toString()}`,
    );
  },

  delete: (id: number | string) => {
    return apiRequest<{
      message?: string;
      isValid?: boolean;
    }>(
      `/user/delete/${encodeURIComponent(String(id))}`,
      {
        method: 'POST',
      },
    );
  },
};

// ======================================================
// UTILISATEURS : AJOUT ET MODIFICATION
// ======================================================

export interface UtilisateurApiPayload {
  id?: number;
  userId?: number;
  createdUser?: string;
  createdDate?: string;
  createdTime?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  searche?: string;
  displayName: string;
  userName: string;
  mail: string;
  password?: string;
  userCode: string;
  isActive: boolean;
  roles: Array<{
    id: number;
    name: string;
  }>;
}

async function envoyerUtilisateur(
  endpoint: string,
  utilisateur: UtilisateurApiPayload,
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(utilisateur),
  });

  const responseText = await response.text();

  // Informations utiles pour le débogage
  console.log('API utilisateur :', `${API_BASE_URL}${endpoint}`);
  console.log('Statut HTTP :', response.status);
  console.log('Réponse :', responseText);

  if (!response.ok) {
    throw new Error(
      responseText ||
        `Erreur API : ${response.status} ${response.statusText}`,
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

export const utilisateurCrudApi = {
  // Ajouter un utilisateur
  ajouter: (utilisateur: UtilisateurApiPayload) =>
    envoyerUtilisateur('/user/save', utilisateur),

  // Modifier un utilisateur
  modifier: (utilisateur: UtilisateurApiPayload) =>
    envoyerUtilisateur('/user/update', utilisateur),
};

// ======================================================
// SAISONS
// ======================================================

export async function getSeasons(searche = '') {
  const params = new URLSearchParams({ searche });

  const result: unknown = await apiRequest<unknown>(
    `/season/getListBean?${params.toString()}`,
  );

  if (Array.isArray(result)) {
    return result;
  }

  if (result && typeof result === 'object') {
    const data = result as Record<string, unknown>;

    const liste =
      data.data ??
      data.content ??
      data.result ??
      data.saisons;

    if (Array.isArray(liste)) {
      return liste;
    }
  }

  throw new Error('Format de réponse des saisons invalide.');
}

// ======================================================
// COMPTES : LISTE
// ======================================================

export async function getComptes(searche = '') {
  const params = new URLSearchParams({ searche });

  const result: unknown = await apiRequest<unknown>(
    `/compte/getListBean?${params.toString()}`,
  );

  if (Array.isArray(result)) {
    return result;
  }

  if (result && typeof result === 'object') {
    const data = result as Record<string, unknown>;

    const liste =
      data.data ??
      data.content ??
      data.result ??
      data.comptes ??
      data.list ??
      data.body;

    if (Array.isArray(liste)) {
      return liste;
    }
  }

  throw new Error('Format de réponse des comptes invalide.');
}

// ======================================================
// COMPTES : SUPPRESSION
// ======================================================

export async function deleteCompte(
  id: number | string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/compte/delete/${encodeURIComponent(String(id))}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Erreur API : ${response.status} ${response.statusText}`,
    );
  }
}

// ======================================================
// OUVRIERS
// ======================================================

export async function getOuvriers(searche = '') {
  const params = new URLSearchParams({ searche });

  const result: unknown = await apiRequest<unknown>(
    `/employee/getListBean?${params.toString()}`,
  );

  if (Array.isArray(result)) {
    return result;
  }

  if (result && typeof result === 'object') {
    const data = result as Record<string, unknown>;

    const liste =
      data.data ??
      data.content ??
      data.result ??
      data.ouvriers ??
      data.employees ??
      data.list ??
      data.body;

    if (Array.isArray(liste)) {
      return liste;
    }
  }

  throw new Error('Format de réponse des ouvriers invalide.');
}


export interface OuvrierApiPayload {
  functionId: number;
  employeeId: number;
  lastName: string;
  departementId: number;
  dateEmbauche: string;
  dateStartContrat: string;
  dateEndContrat: string;
  matricule: number;
  firstName: string;
  statusId: number;
  adresse: string;
  numeroCin: string;
  mobile: string;
  mail: string;
  fonction: string;
  departement: string;
  dateSuspension: string | null;
}

export const ouvrierApi = {
  ajouter: async (payload: OuvrierApiPayload) => {
    const response = await fetch(`${API_BASE_URL}/employee/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let result: unknown = responseText;

    try {
      result = responseText ? JSON.parse(responseText) : null;
    } catch {
      // La réponse du serveur n'est pas forcément du JSON.
    }

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP ${response.status}: ${
          typeof result === 'string'
            ? result
            : JSON.stringify(result)
        }`,
      );
    }

    return result;
  },
};

// Les prochaines API pourront être ajoutées dans ce même fichier.