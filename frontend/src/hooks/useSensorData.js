// frontend/src/hooks/useSensorData.js
import { useState, useEffect } from 'react';
import { domoticApi } from '../services/domoticApi';

export function useSensorData() {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    created_at: null
  });

  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usamos nuestro servicio centralizado
        const jsonData = await domoticApi.getLatestMeasurement();
        setData(jsonData);

        if (jsonData.temperature > 0) {
          const ahora = new Date();
          const horaFormateada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;
          
          setHistorial(prev => {
            const nuevoHistorial = [...prev, {
              hora: horaFormateada,
              temperature: jsonData.temperature,
              humidity: jsonData.humidity
            }];
            return nuevoHistorial.slice(-30);
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del sensor:', error);
      }
    };

    fetchData();
    const intervalo = setInterval(fetchData, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return { data, historial };
}