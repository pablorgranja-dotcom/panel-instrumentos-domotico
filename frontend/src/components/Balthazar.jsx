import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import normal from "../assets/normal.png";
import feliz from "../assets/feliz.png";
import viendo from "../assets/viendo.png";
import mostrando from "../assets/mostrando.png";

const emociones = {
  normal,
  feliz,
  viendo,
  mostrando,
};

export default function Balthazar({
  temperature,
  humidity,
  connected,
  historial = [],
  loading = false,
}) {
  const { t } = useTranslation();

  const [abierto, setAbierto] = useState(false);
  const [emocion, setEmocion] = useState("normal");
  const [textoVisible, setTextoVisible] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [estado, setEstado] = useState("inicio");

  const intervaloRef = useRef(null);

  /*
   * ============================================================
   * LIMPIEZA
   * ============================================================
   */

  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  /*
   * ============================================================
   * COMPROBAR DATOS REALES
   * ============================================================
   */

  const tieneDatosReales =
    connected &&
    !loading &&
    temperature !== undefined &&
    temperature !== null &&
    humidity !== undefined &&
    humidity !== null &&
    Number.isFinite(Number(temperature)) &&
    Number.isFinite(Number(humidity)) &&
    !(Number(temperature) === 0 && Number(humidity) === 0);

  /*
   * ============================================================
   * OBTENER MENSAJE
   * ============================================================
   */

  const obtenerMensaje = (tipo) => {
    const temp = Number(temperature);
    const hum = Number(humidity);

    /*
     * SIN CONEXIÓN
     */

    if (!connected) {
      return t("balthazar.messages.noConnection");
    }

    /*
     * CARGANDO
     */

    if (loading) {
      return t("balthazar.messages.loading");
    }

    /*
     * SIN DATOS REALES
     */

    if (!tieneDatosReales) {
      return t("balthazar.messages.noData");
    }

    /*
     * MENSAJES
     */

    switch (tipo) {
      case "inicio":
        return t("balthazar.messages.start");

      case "mediciones":
        return t("balthazar.messages.measurements", {
          temperature: temp.toFixed(1),
          humidity: hum.toFixed(1),
        });

      case "temperatura":
        if (temp < 18) {
          return t("balthazar.messages.temperature.low", {
            temperature: temp.toFixed(1),
          });
        }

        if (temp <= 28) {
          return t("balthazar.messages.temperature.normal", {
            temperature: temp.toFixed(1),
          });
        }

        if (temp <= 35) {
          return t("balthazar.messages.temperature.warm", {
            temperature: temp.toFixed(1),
          });
        }

        return t("balthazar.messages.temperature.high", {
          temperature: temp.toFixed(1),
        });

      case "humedad":
        if (hum < 30) {
          return t("balthazar.messages.humidity.low", {
            humidity: hum.toFixed(1),
          });
        }

        if (hum <= 60) {
          return t("balthazar.messages.humidity.normal", {
            humidity: hum.toFixed(1),
          });
        }

        if (hum <= 75) {
          return t("balthazar.messages.humidity.high", {
            humidity: hum.toFixed(1),
          });
        }

        return t("balthazar.messages.humidity.veryHigh", {
          humidity: hum.toFixed(1),
        });

      case "historico":
        if (!historial || historial.length === 0) {
          return t("balthazar.messages.history.none");
        }

        if (historial.length < 2) {
          return t("balthazar.messages.history.one");
        }

        return t("balthazar.messages.history.many", {
          count: historial.length,
        });

      case "tendencia": {
        if (!historial || historial.length < 2) {
          return t("balthazar.messages.trend.notEnough");
        }

        const ultimo = historial[historial.length - 1];
        const anterior = historial[historial.length - 2];

        const tempActual = Number(
          ultimo.temperature ?? ultimo.temperatura
        );

        const tempAnterior = Number(
          anterior.temperature ?? anterior.temperatura
        );

        if (
          !Number.isFinite(tempActual) ||
          !Number.isFinite(tempAnterior)
        ) {
          return t("balthazar.messages.trend.invalid");
        }

        if (tempActual > tempAnterior) {
          return t("balthazar.messages.trend.increasing");
        }

        if (tempActual < tempAnterior) {
          return t("balthazar.messages.trend.decreasing");
        }

        return t("balthazar.messages.trend.stable");
      }

      case "conexion":
        return t("balthazar.messages.connection");

      case "consejos":
        if (temp > 35 && hum > 75) {
          return t("balthazar.messages.advice.bothHigh");
        }

        if (temp < 18 && hum < 30) {
          return t("balthazar.messages.advice.bothLow");
        }

        if (hum > 75) {
          return t("balthazar.messages.advice.humidityHigh");
        }

        if (temp > 35) {
          return t("balthazar.messages.advice.temperatureHigh");
        }

        return t("balthazar.messages.advice.stable");

      case "sin-datos":
        return t("balthazar.messages.noDataShort");

      default:
        return t("balthazar.messages.default");
    }
  };

  /*
   * ============================================================
   * ESCRITURA
   * ============================================================
   */

  const escribir = (mensaje, nuevaEmocion = "viendo") => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    setEmocion(nuevaEmocion);
    setEscribiendo(true);
    setTextoVisible("");

    let indice = 0;

    intervaloRef.current = setInterval(() => {
      indice += 1;

      setTextoVisible(mensaje.slice(0, indice));

      if (indice >= mensaje.length) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;

        setEscribiendo(false);
        setEmocion("feliz");
      }
    }, 28);
  };

  /*
   * ============================================================
   * HABLAR
   * ============================================================
   */

  const hablar = (tipo, nuevaEmocion = "viendo") => {
    setEstado(tipo);

    const mensaje = obtenerMensaje(tipo);

    escribir(mensaje, nuevaEmocion);
  };

  /*
   * ============================================================
   * ABRIR / CERRAR
   * ============================================================
   */

  const toggle = () => {
    if (abierto) {
      setAbierto(false);

      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }

      return;
    }

    setAbierto(true);

    if (!connected) {
      hablar("sin-datos", "normal");
      return;
    }

    if (loading) {
      hablar("sin-datos", "viendo");
      return;
    }

    if (!tieneDatosReales) {
      hablar("sin-datos", "normal");
      return;
    }

    hablar("mediciones", "mostrando");
  };

  /*
   * ============================================================
   * BOTONES
   * ============================================================
   */

  const botonesOpciones = tieneDatosReales
    ? [
        {
          texto: t("balthazar.buttons.temperature"),
          accion: () => hablar("temperatura", "mostrando"),
        },
        {
          texto: t("balthazar.buttons.humidity"),
          accion: () => hablar("humedad", "mostrando"),
        },
        {
          texto: t("balthazar.buttons.history"),
          accion: () => hablar("historico", "viendo"),
        },
        {
          texto: t("balthazar.buttons.trend"),
          accion: () => hablar("tendencia", "viendo"),
        },
        {
          texto: t("balthazar.buttons.advice"),
          accion: () => hablar("consejos", "feliz"),
        },
        {
          texto: t("balthazar.buttons.connection"),
          accion: () => hablar("conexion", "normal"),
        },
      ]
    : [
        {
          texto: t("balthazar.buttons.connectionStatus"),
          accion: () => hablar("sin-datos", "normal"),
        },
      ];

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      style={{
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      {abierto && (
        <div
          className="mb-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          style={{
            animation: "balthazarEntrada 0.25s ease-out",
          }}
        >
          {/* Encabezado */}

          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="text-sm font-bold text-ink">
                Balthazar
              </p>

              <p className="text-xs text-ink-soft">
                {t("balthazar.subtitle")}
              </p>
            </div>

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connected
                  ? "bg-online"
                  : "bg-offline"
              }`}
            />
          </div>

          {/* Mensaje */}

          <div className="px-4 py-4">
            {escribiendo && (
              <div className="mb-2 text-xs text-ink-faint">
                {t("balthazar.thinking")}
              </div>
            )}

            <p className="text-sm leading-6 text-ink">
              {textoVisible}

              {escribiendo && (
                <span className="ml-1 animate-pulse">
                  ▌
                </span>
              )}
            </p>
          </div>

          {/* Botones */}

          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
            {/* eslint-disable-next-line react-hooks/refs */}
            {botonesOpciones.map((opcion) => (
              <button
                key={opcion.texto}
                type="button"
                onClick={opcion.accion}
                className="rounded-lg border border-line-strong bg-surface-hover px-3 py-2 text-xs font-medium text-ink transition hover:border-action hover:text-white"
              >
                {opcion.texto}
              </button>
            ))}
          </div>

          {/* Estado */}

          <div className="px-4 pb-3">
            <p className="text-[10px] text-ink-faint">
              {t("balthazar.currentState")}:{" "}
              {estado === "sin-datos"
                ? t("balthazar.states.noData")
                : estado}
            </p>
          </div>
        </div>
      )}

      {/* Balthazar */}

      <button
        type="button"
        onClick={toggle}
        aria-label={t("balthazar.ariaLabel")}
        className="group relative rounded-full border border-line-strong bg-surface p-2 shadow-2xl transition duration-300 hover:scale-105"
      >
        <div className="absolute inset-0 rounded-full bg-action/10 opacity-0 blur-xl transition group-hover:opacity-100" />

        <img
          src={emociones[emocion]}
          alt="Balthazar"
          className="relative h-28 w-28 object-contain transition-transform duration-300 group-hover:-translate-y-1"
          style={{
            animation: "balthazarFlotar 3s ease-in-out infinite",
          }}
        />

        <span
          className={`absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-surface ${
            connected
              ? "bg-online"
              : "bg-offline"
          }`}
        />
      </button>

      {/* Animaciones */}

      <style>
        {`
          @keyframes balthazarFlotar {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes balthazarEntrada {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}