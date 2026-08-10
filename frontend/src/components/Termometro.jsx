
import { useTranslation } from "react-i18next";

export default function Termometro({ temperatura = 25 }) {
  const { t: translate } = useTranslation();

  const t = Math.min(Math.max(temperatura, 0), 50);
  const porcentaje = t / 50;
  const anguloAguja = -135 + (porcentaje * 270);

  const marcas = [0, 10, 20, 30, 40, 50];

  const getPosicion = (valor, radio) => {
    const pct = valor / 50;
    let anguloSVG = 135 + (pct * 270);

    if (anguloSVG >= 360) anguloSVG -= 360;

    const radianes = (anguloSVG * Math.PI) / 180;

    return {
      x: 100 + radio * Math.cos(radianes),
      y: 100 + radio * Math.sin(radianes)
    };
  };

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-lg shadow-black/20 flex flex-col items-center w-full border border-line sm:p-6">
      <h2 className="text-ink text-xs font-semibold mb-4 tracking-[0.14em] uppercase">
        {translate("sensors.temperature")}
      </h2>

      <svg
        width="220"
        height="220"
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        <path
          d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="gradTemp" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-temp-dim)" />
            <stop offset="50%" stopColor="var(--color-temp)" />
            <stop offset="100%" stopColor="var(--color-temp)" />
          </linearGradient>
        </defs>

        <path
          d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"
          fill="none"
          stroke="url(#gradTemp)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {marcas.map((marca) => {
          const ext = getPosicion(marca, 86);
          const int = getPosicion(marca, 74);

          return (
            <line
              key={marca}
              x1={ext.x}
              y1={ext.y}
              x2={int.x}
              y2={int.y}
              stroke="var(--color-ink-faint)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}

        {marcas.map((marca) => {
          const pos = getPosicion(marca, 62);

          return (
            <text
              key={`num-${marca}`}
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill="var(--color-ink-soft)"
              fontSize="11"
              fontWeight="600"
              fontFamily="JetBrains Mono, monospace"
            >
              {marca}
            </text>
          );
        })}

        <line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="var(--color-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            transform: `rotate(${anguloAguja}deg)`,
            transformOrigin: "100px 100px",
            transition:
              "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        />

        <circle
          cx="100"
          cy="100"
          r="10"
          fill="var(--color-ink)"
        />

        <circle
          cx="100"
          cy="100"
          r="5"
          fill="var(--color-surface)"
        />
      </svg>

      <div className="mt-2 text-center">
        <div className="text-temp text-4xl font-bold font-mono">
          {t.toFixed(1)}
        </div>

        <div className="text-ink-soft text-sm font-medium">
          °C
        </div>
      </div>
    </div>
  );
}
