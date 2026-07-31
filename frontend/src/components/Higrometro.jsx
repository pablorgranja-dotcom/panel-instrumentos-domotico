export default function Higrometro({ humedad = 50 }) {
  const h = Math.min(Math.max(humedad, 0), 100);
  const porcentaje = h / 100;
  const anguloAguja = -135 + (porcentaje * 270);

  const marcas = [0, 20, 40, 60, 80, 100];
  
  const getPosicion = (valor, radio) => {
    const pct = valor / 100;
    let anguloSVG = 135 + (pct * 270);
    if (anguloSVG >= 360) anguloSVG -= 360;
    const radianes = (anguloSVG * Math.PI) / 180;
    return {
      x: 100 + radio * Math.cos(radianes),
      y: 100 + radio * Math.sin(radianes)
    };
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl flex flex-col items-center w-full border border-gray-700">
      <h2 className="text-white text-xl font-bold mb-4 tracking-wider">HUMEDAD</h2>
      <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible">
        <path d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6" fill="none" stroke="#374151" strokeWidth="12" strokeLinecap="round" />
        <defs>
          <linearGradient id="gradHum" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path d="M 43.4 156.6 A 80 80 0 1 1 156.6 156.6" fill="none" stroke="url(#gradHum)" strokeWidth="12" strokeLinecap="round" />
        
        {marcas.map((marca) => {
          const ext = getPosicion(marca, 86);
          const int = getPosicion(marca, 74);
          return <line key={marca} x1={ext.x} y1={ext.y} x2={int.x} y2={int.y} stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />;
        })}
        {marcas.map((marca) => {
          const pos = getPosicion(marca, 62);
          return <text key={`num-${marca}`} x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#d1d5db" fontSize="11" fontWeight="600" fontFamily="monospace">{marca}</text>;
        })}
        
        <line x1="100" y1="100" x2="100" y2="40" stroke="#ffffff" strokeWidth="4" strokeLinecap="round"
          style={{ transform: `rotate(${anguloAguja}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        <circle cx="100" cy="100" r="10" fill="#ffffff" />
        <circle cx="100" cy="100" r="5" fill="#374151" />
      </svg>
      <div className="mt-2 text-center">
        <div className="text-white text-4xl font-bold font-mono">{h.toFixed(1)}</div>
        <div className="text-gray-400 text-sm font-medium">%</div>
      </div>
    </div>
  );
}