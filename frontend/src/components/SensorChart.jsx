import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SensorChart({ historial }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 mt-8">
      <h2 className="text-white text-xl font-bold mb-4 tracking-wider">📊 HISTORIAL EN TIEMPO REAL</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historial}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="hora" stroke="#9ca3af" fontSize={12} />
          <YAxis yAxisId="temp" stroke="#3b82f6" label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
          <YAxis yAxisId="hum" orientation="right" stroke="#f59e0b" label={{ value: '%', angle: 90, position: 'insideRight', fill: '#f59e0b' }} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
          <Legend />
          <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={false} name="Temperatura (°C)" />
          <Line yAxisId="hum" type="monotone" dataKey="humidity" stroke="#f59e0b" strokeWidth={2} dot={false} name="Humedad (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}