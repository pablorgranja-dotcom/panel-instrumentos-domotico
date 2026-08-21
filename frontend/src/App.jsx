import { useTranslation } from "react-i18next";
import ConnectionStatus from "./components/ConnectionStatus";
import ExportButton from "./components/ExportButton";
import SensorChart from "./components/SensorChart";
import TendenciaPronostico from "./components/TendenciaPronostico";
import DeviceControl from "./components/DeviceControl";
import Footer from "./components/Footer";
import { useSensorData } from "./hooks/useSensorData";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { Clock, Thermometer, Droplets } from "lucide-react";
import Gauge from "./components/Gauge";
import MeasurementCard from "./components/MeasurementCard";
import Balthazar from "./components/Balthazar";

const OFFSET_ECUADOR_MS = 5 * 60 * 60 * 1000;

function formatearFecha(fechaString) {
  if (!fechaString) return null;
  const fechaLocal = new Date(new Date(fechaString).getTime() - OFFSET_ECUADOR_MS);
  return fechaLocal.toLocaleString("es-EC", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

function App() {
  const { t, i18n } = useTranslation();
  const { data: sensorData, historial, loading } = useSensorData();
  const isConnected = useConnectionStatus();
  const tieneRegistros = Boolean(sensorData?.created_at);
  const ultimaActualizacion = formatearFecha(sensorData?.created_at);

  const cambiarIdioma = (idioma) => {
    i18n.changeLanguage(idioma);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Sincronizando con el sensor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-8 flex flex-col font-sans">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto w-full">

        <div>
          <h1 className="text-white text-3xl md:text-4xl font-extrabold">
            {t("header.institution", "Tecnológico Universitario Rumiñahui")}
          </h1>
          <p className="text-blue-400 text-xl md:text-2xl font-bold mt-2">
            {t("header.subject", "Asignatura de Reutilización de Software")}
          </p>
          <p className="text-gray-400 text-base mt-1">
            {t("header.project", "Proyecto: Monitoreo Ambiental DHT11 con Arduino Uno")}
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-lg border border-gray-600 bg-gray-900/80 p-1">
            <button type="button" onClick={() => cambiarIdioma("es")} className={`rounded-md px-3 py-2 text-sm font-bold transition ${i18n.language === "es" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}>🇪🇸</button>
            <button type="button" onClick={() => cambiarIdioma("en")} className={`rounded-md px-3 py-2 text-sm font-bold transition ${i18n.language === "en" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}>🇺🇸</button>
            <button type="button" onClick={() => cambiarIdioma("zh")} className={`rounded-md px-3 py-2 text-sm font-bold transition ${i18n.language === "zh" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}>🇨🇳</button>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>

      {/* Fecha y hora */}
      {tieneRegistros && (
        <div className="max-w-6xl mx-auto mb-8 w-full">
          <MeasurementCard
            icon={<Clock size={40} />}
            title={t("measurement.last", "ÚLTIMA ACTUALIZACIÓN")}
            value={ultimaActualizacion}
            unit=""
          />
        </div>
      )}

      {/* Medidores */}
      {tieneRegistros && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8 w-full">
          <Gauge value={sensorData.temperature} min={0} max={50} label={t("sensors.temperature", "Temperatura")} unit="°C" marks={[0, 10, 20, 30, 40, 50]} accent="temp" icon={Thermometer} />
          <Gauge value={sensorData.humidity} min={0} max={100} label={t("sensors.humidity", "Humedad")} unit="%" marks={[0, 20, 40, 60, 80, 100]} accent="humidity" icon={Droplets} />
        </div>
      )}

      {/* Control del Foco */}
      {tieneRegistros && (
        <div className="max-w-6xl mx-auto mb-8 w-full">
          <DeviceControl />
        </div>
      )}

      {/* Exportar */}
      {tieneRegistros && (
        <div className="max-w-6xl mx-auto mb-10 w-full">
          <ExportButton />
        </div>
      )}

      {/* Gráfico y Tendencia */}
      {tieneRegistros && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 w-full mb-8">
          <div className="lg:col-span-3">
            <SensorChart historial={historial} />
          </div>
          <div className="lg:col-span-1">
            <TendenciaPronostico historial={historial} />
          </div>
        </div>
      )}

      {/* Balthazar - Asistente Domótico */}
      <Balthazar
        temperature={sensorData?.temperature}
        humidity={sensorData?.humidity}
        connected={isConnected}
        historial={historial}
        loading={loading}
      />

      {/* Footer */}
      <Footer />

      

    </div>
  );
}

export default App;