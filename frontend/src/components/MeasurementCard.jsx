export default function MeasurementCard({ title, value, unit, icon }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 flex flex-col items-center justify-center w-full">
      <div className="text-3xl mb-3 text-blue-400">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-white text-2xl md:text-3xl font-bold font-mono tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-gray-400 text-lg font-semibold">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}