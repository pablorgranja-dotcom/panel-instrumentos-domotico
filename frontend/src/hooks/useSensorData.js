// frontend/src/hooks/useSensorData.js
import { useState, useEffect } from 'react';
import { domoticApi } from '../services/domoticApi';

const HISTORY_LIMIT = 30;
const OFFSET_ECUADOR_MS = 5 * 60 * 60 * 1000; // created_at se guarda en UTC

function formatearHora(fechaString) {
  const fechaLocal = new Date(new Date(fechaString).getTime() - OFFSET_ECUADOR_MS);
  return fechaLocal.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function useSensorData() {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    created_at: null
  });

  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos nuestro servicio centralizado
        const [latest, history] = await Promise.all([
          domoticApi.getLatestMeasurement(),
          domoticApi.getHistory(HISTORY_LIMIT)
        ]);

        setData(latest);

        // El backend devuelve el historial del más reciente al más antiguo;
        // lo invertimos para graficarlo en orden cronológico.
        setHistorial(
          [...history].reverse().map((registro) => ({
            hora: formatearHora(registro.created_at),
            temperature: registro.temperature,
            humidity: registro.humidity
          }))
        );
      } catch (error) {
        console.error('Error al obtener datos del sensor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalo = setInterval(fetchData, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return { data, historial, loading };
}