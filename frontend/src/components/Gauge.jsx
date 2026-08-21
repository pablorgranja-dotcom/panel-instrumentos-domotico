import { COLORS } from '../theme';

const ACCENT_STYLES = {
  temp: {
    badge: 'bg-temp/10 text-temp',
    value: 'text-temp',
  },
  humidity: {
    badge: 'bg-humidity/10 text-humidity',
    value: 'text-humidity',
  },
};

export default function Gauge({ value = 0, min = 0, max, label, unit, marks, accent, icon: Icon }) {
  const accentColor = accent === 'humidity' ? COLORS.humidity : COLORS.temp;
  const accentColorDim = accent === 'humidity' ? COLORS.humidityDim : COLORS.tempDim;
  const styles = ACCENT_STYLES[accent] ?? ACCENT_STYLES.temp;
  const gradientId = `gauge-gradient-${accent}`;

  const v = Math.min(Math.max(value, min), max);
  const porcentaje = (v - min) / (max - min);
  const anguloAguja = -135 + porcentaje * 270;

  const getPosicion = (valor, radio) => {
    const pct = (valor - min) / (max - min);
    let anguloSVG = 135 + pct * 270;
    if (anguloSVG >= 360) anguloSVG -= 360;
    const radianes = (anguloSVG * Math.PI) / 180;
    return {
      x: 100 + radio * Math.cos(radianes),
      y: 100 + radio * Math.sin(radianes),
    };
  };

  return (
    <div className="flex w-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-lg shadow-black/20 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.badge}`}>
          {Icon ? <Icon size={17} strokeWidth={2.25} /> : null}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</h2>
      </div>

      <div className="mx-auto w-full max-w-55">
        <svg viewBox="0 0 200 200" className="w-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColorDim} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
            <filter id={`needle-shadow-${accent}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          <path
            d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"
            fill="none"
            stroke={COLORS.border}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${porcentaje * 377} 377`}
          />

          {marks.map((marca) => {
            const ext = getPosicion(marca, 87);
            const int = getPosicion(marca, 78);
            return (
              <line
                key={marca}
                x1={ext.x}
                y1={ext.y}
                x2={int.x}
                y2={int.y}
                stroke={COLORS.inkFaint}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          {marks.map((marca) => {
            const pos = getPosicion(marca, 64);
            return (
              <text
                key={`num-${marca}`}
                x={pos.x}
                y={pos.y + 3.5}
                textAnchor="middle"
                fill={COLORS.inkSoft}
                fontSize="9.5"
                fontWeight="600"
                fontFamily="'JetBrains Mono', monospace"
              >
                {marca}
              </text>
            );
          })}

          <line
            x1="100"
            y1="100"
            x2="100"
            y2="42"
            stroke={COLORS.ink}
            strokeWidth="3"
            strokeLinecap="round"
            filter={`url(#needle-shadow-${accent})`}
            style={{
              transform: `rotate(${anguloAguja}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <circle cx="100" cy="100" r="7" fill={COLORS.surface} stroke={COLORS.ink} strokeWidth="2.5" />
          <circle cx="100" cy="100" r="2.5" fill={accentColor} />
        </svg>
      </div>

      <div className="mt-1 flex items-baseline justify-center gap-1.5">
        <span className={`font-mono text-4xl font-semibold tabular-nums ${styles.value}`}>{v.toFixed(1)}</span>
        <span className="text-sm font-medium text-ink-soft">{unit}</span>
      </div>
    </div>
  );
}
