import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExportButton() {
  const { t } = useTranslation();

  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleDownload = async () => {
    // 1. Validar que todos los campos estén llenos
    if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
      setMensaje(t("export.messages.completeFields"));
      return;
    }

    // 2. Unir Fecha y Hora en un solo formato (YYYY-MM-DDTHH:mm)
    const dateTimeInicio = `${fechaInicio}T${horaInicio}`;
    const dateTimeFin = `${fechaFin}T${horaFin}`;

    // 3. Validar que el inicio sea menor al fin
    if (dateTimeInicio >= dateTimeFin) {
      setMensaje(t("export.messages.invalidRange"));
      return;
    }

    setMensaje(t("export.messages.generating"));

    try {
      // Enviamos los datos unidos al backend
      const url = `http://localhost:3001/api/measurements/export/excel?fechaHoraInicio=${dateTimeInicio}&fechaHoraFin=${dateTimeFin}`;
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlBlob;

        // Limpiamos el nombre del archivo para que sea válido en Windows
        const nombreArchivo = `reporte_domotico_${dateTimeInicio
          .replace("T", "_")
          .replace(":", "-")}_a_${dateTimeFin
          .replace("T", "_")
          .replace(":", "-")}.xlsx`;

        a.download = nombreArchivo;

        document.body.appendChild(a);
        a.click();
        a.remove();

        setMensaje(t("export.messages.success"));
      } else {
        setMensaje(t("export.messages.noData"));
      }
    } catch {
      setMensaje(t("export.messages.connectionError"));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {t("export.title")}
      </h2>

      {/* Contenedor de los 4 casilleros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

        {/* BLOQUE INICIO */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-blue-400 text-sm font-bold mb-3 uppercase tracking-wider">
            {t("export.startPeriod")}
          </h3>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                {t("export.date")}
              </label>

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                {t("export.time")}
              </label>

              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* BLOQUE FIN */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-orange-400 text-sm font-bold mb-3 uppercase tracking-wider">
            {t("export.endPeriod")}
          </h3>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                {t("export.date")}
              </label>

              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1 block">
                {t("export.time")}
              </label>

              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-600 rounded p-2 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Descarga */}
      <button
        onClick={handleDownload}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition duration-200 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>

        {t("export.download")}
      </button>

      {/* Mensajes de estado */}
      {mensaje && (
        <p
          className={`mt-3 text-sm font-medium text-center ${
            mensaje.includes("✅")
              ? "text-green-400"
              : mensaje.includes("❌") || mensaje.includes("⚠️")
                ? "text-red-400"
                : "text-yellow-400"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}