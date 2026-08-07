import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { COLORS } from '../theme';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-xl">
      <p className="mb-1.5 font-mono text-xs text-ink-faint">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toFixed(1)}
        </p>
      ))}
    </div>
  );
}

export default function SensorChart({ historial }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-lg shadow-black/20 sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-action/10 text-action">
          <Activity size={17} strokeWidth={2.25} />
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          Historial en tiempo real
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={historial} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 6" stroke={COLORS.border} vertical={false} />
          <XAxis
            dataKey="hora"
            stroke={COLORS.inkFaint}
            tick={{ fill: COLORS.inkFaint, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={{ stroke: COLORS.border }}
          />
          <YAxis
            yAxisId="temp"
            stroke={COLORS.temp}
            tick={{ fill: COLORS.inkFaint, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <YAxis
            yAxisId="hum"
            orientation="right"
            stroke={COLORS.humidity}
            tick={{ fill: COLORS.inkFaint, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: COLORS.inkSoft, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            stroke={COLORS.temp}
            strokeWidth={2}
            dot={false}
            name="Temperatura (°C)"
            isAnimationActive={false}
          />
          <Line
            yAxisId="hum"
            type="monotone"
            dataKey="humidity"
            stroke={COLORS.humidity}
            strokeWidth={2}
            dot={false}
            name="Humedad (%)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
