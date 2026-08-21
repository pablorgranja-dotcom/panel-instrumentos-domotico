import { useState, useEffect, useRef } from 'react';
import { domoticApi } from '../services/domoticApi';

const HISTORY_LIMIT = 50;
const OFFSET_ECUADOR_MS = 5 * 60 * 60 * 1000;

function formatearHora(fechaString) {
  if (!fechaString) return '--:--:--';
  const fechaLocal = new Date(new Date(fechaString).getTime() - OFFSET_ECUADOR_MS);
  return fechaLocal.toLocaleTimeString('es-EC', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
  });
}

export function useSensorData() {
  const [data, setData] = useState({ temperature: 0, humidity: 0, created_at: null });
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const historialLoaded = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const loadHistory = async () => {
      if (historialLoaded.current || isFetching.current) return;
      isFetching.current = true;
      
      try {
        const history = await domoticApi.getHistory(HISTORY_LIMIT);
        if (isMounted.current) {
          const historialFormateado = [...(history || [])].reverse().map((registro) => ({
            hora: formatearHora(registro.created_at),
            temperature: registro.temperature,
            humidity: registro.humidity
          }));
          setHistorial(historialFormateado);
          historialLoaded.current = true;
        }
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        isFetching.current = false;
      }
    };

    const fetchLatest = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      
      try {
        const latest = await domoticApi.getLatestMeasurement();
        if (isMounted.current && latest) {
          setData(latest);
          setLoading(false);
          
          // AGREGAR el nuevo dato al historial y mantener solo 50
          if (historialLoaded.current) {
            setHistorial(prev => {
              const nuevoRegistro = {
                hora: formatearHora(latest.created_at),
                temperature: latest.temperature,
                humidity: latest.humidity
              };
              const nuevoHistorial = [...prev, nuevoRegistro];
              // Mantener solo los últimos 50
              return nuevoHistorial.slice(-HISTORY_LIMIT);
            });
          }
        }
      } catch (error) {
        console.error('Error al obtener dato reciente:', error);
        if (isMounted.current) setLoading(false);
      } finally {
        isFetching.current = false;
      }
    };

    loadHistory();
    fetchLatest();
    
    // Actualizar cada 5 segundos
    const intervalo = setInterval(fetchLatest, 5000);

    return () => {
      isMounted.current = false;
      clearInterval(intervalo);
    };
  }, []);

  return { data, historial, loading };
}