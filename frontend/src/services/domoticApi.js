// frontend/src/services/domoticApi.js
const API_URL = 'http://localhost:3001/api';

export const domoticApi = {
  // Obtener la última medición
  getLatestMeasurement: async () => {
    const response = await fetch(`${API_URL}/measurements/latest`);
    if (!response.ok) throw new Error('Error al obtener datos');
    return await response.json();
  },

  // Obtener historial
  getHistory: async (limit = 100) => {
    const response = await fetch(`${API_URL}/measurements?limit=${limit}`);
    if (!response.ok) throw new Error('Error al obtener historial');
    return await response.json();
  },

  // Verificar si el backend está conectado
  checkConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/test`);
      return response.ok;
    } catch {
      return false;
    }
  }
};