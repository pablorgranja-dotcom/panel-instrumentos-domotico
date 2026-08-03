// frontend/src/App.jsx
import Termometro from './components/Termometro';
import Higrometro from './components/Higrometro';
import ConnectionStatus from './components/ConnectionStatus';
import ExportButton from './components/ExportButton';
import SensorChart from './components/SensorChart';
import TendenciaPronostico from './components/TendenciaPronostico';
import { useSensorData } from './hooks/useSensorData';

function App() {
  const { data: sensorData, historial } = useSensorData();

  // Formatear la fecha y hora ajustada a Ecuador (UTC-5)
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Esperando primera medición...';
    
    const fecha = new Date(fechaString);
    const offsetEcuador = 5 * 60 * 60 * 1000; // 5 horas en milisegundos
    const fechaLocal = new Date(fecha.getTime() - offsetEcuador);

    return fechaLocal.toLocaleString('es-EC', { 
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      {/* Encabezado Institucional */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">Tecnológico Universitario Rumiñahui</h1>
          <p className="text-blue-400 text-xl font-semibold mt-2">Asignatura de Reutilización de Software</p>
          <p className="text-gray-400 text-sm mt-1">Proyecto: Monitoreo Ambiental DHT11 con Arduino Uno</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ConnectionStatus />
        </div>
      </div>
      
      {/* Fecha y hora de la última medición */}
      <div className="max-w-6xl mx-auto mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
        <p className="text-gray-400 text-sm">Última actualización:</p>
        <p className="text-white font-mono text-lg">{formatearFecha(sensorData.created_at)}</p>
      </div>

      {/* Botón de Exportar */}
      <div className="max-w-6xl mx-auto mb-8">
        <ExportButton />
      </div>

      {/* Medidores (Gauges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
        <Termometro temperatura={sensorData.temperature} />
        <Higrometro humedad={sensorData.humidity} />
      </div>

      {/* Gráfico Histórico y Panel de Tendencia/Pronóstico */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gráfico ocupa 3 columnas en pantallas grandes */}
        <div className="lg:col-span-3">
          <SensorChart historial={historial} />
        </div>
        
        {/* Panel de Tendencia y Pronóstico ocupa 1 columna */}
        <div className="lg:col-span-1">
          <TendenciaPronostico historial={historial} />
        </div>
      </div>
    </div>
  );
}

export default App;