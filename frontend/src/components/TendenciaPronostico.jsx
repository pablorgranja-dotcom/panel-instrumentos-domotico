// frontend/src/components/TendenciaPronostico.jsx

import { useTranslation } from "react-i18next";

export default function TendenciaPronostico({ historial }) {
  const { t } = useTranslation();

  // Calcular tendencia (comparar último valor con el anterior)
  const calcularTendencia = (valores) => {
    if (valores.length < 2) return { direccion: "estable", porcentaje: 0 };

    const ultimo = valores[valores.length - 1];
    const anterior = valores[valores.length - 2];
    const diferencia = ultimo - anterior;

    if (diferencia > 0.5) {
      return {
        direccion: "subiendo",
        porcentaje: diferencia.toFixed(1),
      };
    }

    if (diferencia < -0.5) {
      return {
        direccion: "bajando",
        porcentaje: Math.abs(diferencia).toFixed(1),
      };
    }

    return { direccion: "estable", porcentaje: 0 };
  };

  const temperaturas = historial.map((h) => h.temperature);
  const humedades = historial.map((h) => h.humidity);

  const tendenciaTemp = calcularTendencia(temperaturas);
  const tendenciaHum = calcularTendencia(humedades);

  const ultimoTemp = temperaturas[temperaturas.length - 1] || 0;
  const ultimoHum = humedades[humedades.length - 1] || 0;

  // 🌞🌙 DETECTAR SI ES DE DÍA O DE NOCHE
  // 6:00 AM a 6:00 PM es de día
  const horaActual = new Date().getHours();
  const esDeNoche = horaActual >= 18 || horaActual < 6;

  let pronostico = {
    icono: "☀️",
    texto: t("forecast.sunny"),
    color: "text-yellow-400",
    bg: "bg-yellow-900/30",
  };

  if (esDeNoche) {
    // Condiciones nocturnas
    if (ultimoHum > 75) {
      pronostico = {
        icono: "🌧️",
        texto: t("forecast.humidNight"),
        color: "text-blue-400",
        bg: "bg-blue-900/30",
      };
    } else if (ultimoTemp < 15) {
      pronostico = {
        icono: "🌙",
        texto: t("forecast.coldNight"),
        color: "text-blue-300",
        bg: "bg-indigo-900/30",
      };
    } else {
      pronostico = {
        icono: "🌙",
        texto: t("forecast.clearNight"),
        color: "text-indigo-300",
        bg: "bg-indigo-900/30",
      };
    }
  } else {
    // Condiciones diurnas
    if (ultimoTemp < 15) {
      pronostico = {
        icono: "❄️",
        texto: t("forecast.cold"),
        color: "text-blue-300",
        bg: "bg-blue-900/30",
      };
    } else if (ultimoTemp > 30 && ultimoHum < 50) {
      pronostico = {
        icono: "🔥",
        texto: t("forecast.hot"),
        color: "text-red-400",
        bg: "bg-red-900/30",
      };
    } else if (ultimoHum > 75) {
      pronostico = {
        icono: "🌧️",
        texto: t("forecast.rainy"),
        color: "text-blue-400",
        bg: "bg-blue-900/30",
      };
    } else if (
      ultimoTemp >= 20 &&
      ultimoTemp <= 28 &&
      ultimoHum >= 40 &&
      ultimoHum <= 70
    ) {
      pronostico = {
        icono: "🌤️",
        texto: t("forecast.pleasant"),
        color: "text-green-400",
        bg: "bg-green-900/30",
      };
    } else if (ultimoTemp > 28) {
      pronostico = {
        icono: "☀️",
        texto: t("forecast.warm"),
        color: "text-orange-400",
        bg: "bg-orange-900/30",
      };
    }
  }

  const getFlecha = (tendencia) => {
    if (tendencia.direccion === "subiendo") {
      return <span className="text-red-400 text-2xl font-bold">↑</span>;
    }

    if (tendencia.direccion === "bajando") {
      return <span className="text-blue-400 text-2xl font-bold">↓</span>;
    }

    return <span className="text-ink-faint text-2xl font-bold">→</span>;
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-lg shadow-black/20 flex flex-col gap-4 h-full sm:p-6">

      {/* Pronóstico */}
      <div
        className={`${pronostico.bg} rounded-xl p-4 text-center border border-line transition-all duration-500`}
      >
        <div className="text-5xl mb-2">{pronostico.icono}</div>

        <div className={`text-xl font-bold ${pronostico.color}`}>
          {pronostico.texto}
        </div>

        <div className="text-ink-soft text-sm mt-1 font-mono">
          {ultimoTemp.toFixed(1)}°C | {ultimoHum.toFixed(0)}%
        </div>
      </div>

      {/* Tendencia Temperatura */}
      <div className="bg-surface-hover rounded-xl p-4 border border-line flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-ink-soft text-sm">
              {t("sensors.temperature")}
            </div>

            <div className="text-ink text-2xl font-bold font-mono">
              {ultimoTemp.toFixed(1)}°C
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            {getFlecha(tendenciaTemp)}

            <div
              className={`text-xs font-bold ${
                tendenciaTemp.direccion === "subiendo"
                  ? "text-red-400"
                  : tendenciaTemp.direccion === "bajando"
                    ? "text-blue-400"
                    : "text-ink-faint"
              }`}
            >
              {tendenciaTemp.direccion === "subiendo" &&
                `+${tendenciaTemp.porcentaje}°`}

              {tendenciaTemp.direccion === "bajando" &&
                `-${tendenciaTemp.porcentaje}°`}

              {tendenciaTemp.direccion === "estable" &&
                t("forecast.stable")}
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia Humedad */}
      <div className="bg-surface-hover rounded-xl p-4 border border-line flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-ink-soft text-sm">
              {t("sensors.humidity")}
            </div>

            <div className="text-ink text-2xl font-bold font-mono">
              {ultimoHum.toFixed(0)}%
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            {getFlecha(tendenciaHum)}

            <div
              className={`text-xs font-bold ${
                tendenciaHum.direccion === "subiendo"
                  ? "text-blue-400"
                  : tendenciaHum.direccion === "bajando"
                    ? "text-orange-400"
                    : "text-ink-faint"
              }`}
            >
              {tendenciaHum.direccion === "subiendo" &&
                `+${tendenciaHum.porcentaje}%`}

              {tendenciaHum.direccion === "bajando" &&
                `-${tendenciaHum.porcentaje}%`}

              {tendenciaHum.direccion === "estable" &&
                t("forecast.stable")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
