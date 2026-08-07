import ConnectionStatus from './components/ConnectionStatus';
import ExportButton from './components/ExportButton';
import SensorChart from './components/SensorChart';
import TendenciaPronostico from './components/TendenciaPronostico';
import DeviceControl from './components/DeviceControl';
import Footer from './components/Footer';
import { useSensorData } from './hooks/useSensorData';
import { Clock, Thermometer, Droplets, Loader2, WifiOff, RadioTower } from 'lucide-react';
import Gauge from './components/Gauge';
import MeasurementCard from './components/MeasurementCard';
import { useConnectionStatus } from './hooks/useConnectionStatus';

const OFFSET_ECUADOR_MS = 5 * 60 * 60 * 1000;

function formatearFecha(fechaString) {
  if (!fechaString) return null;

  const fechaLocal = new Date(new Date(fechaString).getTime() - OFFSET_ECUADOR_MS);

  return fechaLocal.toLocaleString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-20 text-center">
      <Loader2 size={26} strokeWidth={2.25} className="animate-spin text-action" />
      <p className="text-sm text-ink-soft">Conectando con el panel de sensores...</p>
    </div>
  );
} 

function EmptyState({ isConnected }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-20 text-center">
      <span className="relative flex h-12 w-12 items-center justify-center">
        {isConnected && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action/20" />}
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action/10 text-action">
          <RadioTower size={22} strokeWidth={2} />
        </span>
      </span>
      <p className="text-sm font-medium text-ink">Esperando la primera medición del sensor...</p>
      <p className="max-w-sm text-xs text-ink-faint">
        Verifica que el Arduino esté conectado y enviando datos por el puerto serial. El panel se actualizará
        automáticamente en cuanto llegue el primer registro.
      </p>
    </div>
  );
}

function App() {
  const { data: sensorData, historial, loading } = useSensorData();
  const isConnected = useConnectionStatus();
  const tieneRegistros = Boolean(sensorData.created_at);
  const ultimaActualizacion = formatearFecha(sensorData.created_at);
  

  return (
    <div className="min-h-screen bg-gray-800 p-8 flex flex-col">
      {/* Encabezado Institucional */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">Tecnológico Universitario Rumiñahui</h1>
          <p className="text-blue-400 text-xl font-semibold mt-2">Asignatura de Reutilización de Software</p>
          <p className="text-gray-400 text-sm mt-1">Proyecto: Monitoreo Ambiental DHT11 con Arduino Uno</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>

      {!isConnected && (
      <div className="max-w-6xl mx-auto mb-6 w-full">
        <div className="flex items-start gap-3 rounded-xl border border-offline/30 bg-offline/10 px-4 py-3 text-sm text-offline">
          <WifiOff size={18} strokeWidth={2.25} className="mt-0.5 shrink-0" />
          <p>
            No se pudo conectar con el backend. Verifica que el servidor esté corriendo en{' '}
            <code className="font-mono text-xs">localhost:3001</code>. Los datos que ves abajo podrían estar desactualizados.
          </p>
        </div>
      </div>
      )}
          
      {/* Fecha y hora de la última medición */}
      {tieneRegistros && (
      <div className="max-w-6xl mx-auto mb-6 w-full">
        <MeasurementCard
          icon={Clock}
          label="Última medición"
          value={ultimaActualizacion}
        />
      </div>
      )}

        {loading ? (
          <LoadingState />
        ) : !tieneRegistros ? (
          <EmptyState isConnected={isConnected} />
        ) : (
          <>

      {/* Medidores (Gauges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8 w-full">
        <Gauge
        value={sensorData.temperature}
        min={0}
        max={50}
        label="Temperatura"
        unit="°C"
        marks={[0, 10, 20, 30, 40, 50]}
        accent="temp"
        icon={Thermometer}
        />
        <Gauge
          value={sensorData.humidity}
          min={0}
          max={100}
          label="Humedad"
          unit="%"
          marks={[0, 20, 40, 60, 80, 100]}
          accent="humidity"
          icon={Droplets}
        />
      </div>

      {/* Control del Foco */}
      <div className="max-w-6xl mx-auto mb-8 w-full">
        <DeviceControl />
      </div>

      {/* Gráfico Histórico y Panel de Tendencia/Pronóstico */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
        <div className="lg:col-span-3">
          <SensorChart historial={historial} />
        </div>
        <div className="lg:col-span-1">
          <TendenciaPronostico historial={historial} />
        </div>
      </div>

      {/* Botón de Exportar */}
      <div className="max-w-6xl mx-auto mb-8 w-full">
        <ExportButton />
      </div>

      
      </>
)}

{/* Pie de página */}
      <Footer />
    </div>
    
  );
}

export default App;