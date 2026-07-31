export default function MeasurementCard({ title, value, unit, icon, color }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 flex flex-col items-center justify-center">
      <div className={`text-4xl mb-2 ${color}`}>{icon}</div>
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-white text-4xl font-bold font-mono">{value}</span>
        <span className="text-gray-400 text-lg">{unit}</span>
      </div>
    </div>
  );
}