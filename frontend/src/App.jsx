import { useTranslation } from "react-i18next";
import ConnectionStatus from "./components/ConnectionStatus";
import ExportButton from "./components/ExportButton";
import SensorChart from "./components/SensorChart";
import TendenciaPronostico from "./components/TendenciaPronostico";
import DeviceControl from "./components/DeviceControl";
import Footer from "./components/Footer";
import { useSensorData } from "./hooks/useSensorData";
import {
  Clock,
  Thermometer,
  Droplets,
  Loader2,
  WifiOff,
  RadioTower,
} from "lucide-react";
import Gauge from "./components/Gauge";
import MeasurementCard from "./components/MeasurementCard";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import Balthazar from "./components/Balthazar";

const OFFSET_ECUADOR_MS = 5 * 60 * 60 * 1000;

function formatearFecha(fechaString) {
  if (!fechaString) return null;

  const fechaLocal = new Date(
    new Date(fechaString).getTime() - OFFSET_ECUADOR_MS
  );

  return fechaLocal.toLocaleString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-20 text-center">
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action/20" />

        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action/10 text-action">
          <RadioTower size={22} strokeWidth={2} />
        </span>
      </span>

      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2
          size={18}
          strokeWidth={2.25}
          className="animate-spin"
        />

        <p className="text-sm">
          {t("states.loading")}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ isConnected }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-20 text-center">
      <span className="relative flex h-12 w-12 items-center justify-center">
        {isConnected && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-action/20" />
        )}

        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-action/10 text-action">
          {isConnected ? (
            <RadioTower size={22} strokeWidth={2} />
          ) : (
            <WifiOff size={22} strokeWidth={2} />
          )}
        </span>
      </span>

      <p className="text-sm font-medium text-ink">
        {t("states.emptyTitle")}
      </p>

      <p className="max-w-sm text-xs text-ink-faint">
        {t("states.emptyDescription")}
      </p>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();

  const {
    data: sensorData,
    historial,
    loading,
  } = useSensorData();

  const isConnected = useConnectionStatus();

  const tieneRegistros = Boolean(sensorData.created_at);

  const ultimaActualizacion = formatearFecha(
    sensorData.created_at
  );

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8 flex flex-col">

      {/* Encabezado Institucional */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto w-full">

        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold">
            {t("header.institution")}
          </h1>

          <p className="text-blue-400 text-xl font-semibold mt-2">
            {t("header.subject")}
          </p>

          <p className="text-gray-400 text-sm mt-1">
            {t("header.project")}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-4">

          {/* Selector de idioma */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-600 bg-gray-900/60 p-1">

            {/* Español */}
            <button
              type="button"
              onClick={() => cambiarIdioma("es")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                i18n.language === "es"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              title="Español"
            >
              🇪🇸
            </button>

            {/* Inglés */}
            <button
              type="button"
              onClick={() => cambiarIdioma("en")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                i18n.language === "en"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              title="English"
            >
              🇺🇸
            </button>

            {/* Chino */}
            <button
              type="button"
              onClick={() => cambiarIdioma("zh")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                i18n.language === "zh"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
              title="中文"
            >
              🇨🇳
            </button>

          </div>

          {/* Estado de conexión */}
          <ConnectionStatus isConnected={isConnected} />

        </div>
      </div>

      {/* Aviso cuando no hay conexión */}
      {!isConnected && (
        <div className="max-w-6xl mx-auto mb-6 w-full">
          <div className="flex items-start gap-3 rounded-xl border border-offline/30 bg-offline/10 px-4 py-3 text-sm text-offline">

            <WifiOff
              size={18}
              strokeWidth={2.25}
              className="mt-0.5 shrink-0"
            />

            <p>
              {t("states.backendOffline")}{" "}
              <code className="font-mono text-xs">
                localhost:3001
              </code>
              . {t("states.backendOfflineEnd")}
            </p>

          </div>
        </div>
      )}

      {/* Fecha y hora de la última medición */}
      {tieneRegistros && (
        <div className="max-w-6xl mx-auto mb-6 w-full">
          <MeasurementCard
            icon={Clock}
            label={t("measurement.last")}
            value={ultimaActualizacion}
          />
        </div>
      )}

      {/* Estados de carga / sin datos / datos disponibles */}
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
              label={t("sensors.temperature")}
              unit="°C"
              marks={[0, 10, 20, 30, 40, 50]}
              accent="temp"
              icon={Thermometer}
            />

            <Gauge
              value={sensorData.humidity}
              min={0}
              max={100}
              label={t("sensors.humidity")}
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

      {/* Balthazar */}
      <Balthazar
        temperature={sensorData.temperature}
        humidity={sensorData.humidity}
        connected={isConnected}
        historial={historial}
        loading={loading}
      />

      {/* Pie de página */}
      <Footer />

      

    </div>
  );
}

export default App;