// frontend/src/App.jsx
import Termometro from './components/Termometro';
import Higrometro from './components/Higrometro';
import ConnectionStatus from './components/ConnectionStatus';
import ExportButton from './components/ExportButton';
import SensorChart from './components/SensorChart';
import { useSensorData } from './hooks/useSensorData';

function App() {
  const { data: sensorData, historial } = useSensorData();

    // Formatear la fecha y hora ajustada a Ecuador (UTC-5)
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Esperando primera medición...';
    
    // Crear la fecha y restar 5 horas (offset de Ecuador) para asegurar la hora local
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
      {/* Encabezado y Estado de Conexión */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-white text-4xl font-bold">Monitoreo Ambiental DHT11</h1>
          <p className="text-gray-400 mt-1">Sistema de registro con Arduino Uno</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ConnectionStatus />
        </div>
      </div>
      
      {/* Fecha y hora de la última medición (Requisito del profesor) */}
      <div className="max-w-5xl mx-auto mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
        <p className="text-gray-400 text-sm">Última actualización:</p>
        <p className="text-white font-mono text-lg">{formatearFecha(sensorData.created_at)}</p>
      </div>

      {/* Botón de Exportar */}
      <div className="max-w-5xl mx-auto mb-8">
        <ExportButton />
      </div>

      {/* Medidores (Gauges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Termometro temperatura={sensorData.temperature} />
        <Higrometro humedad={sensorData.humidity} />
      </div>

      {/* Gráfico Histórico */}
      <div className="max-w-5xl mx-auto">
        <SensorChart historial={historial} />
      </div>
    </div>
  );
}

export default App;