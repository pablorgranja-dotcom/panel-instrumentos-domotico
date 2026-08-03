// frontend/src/components/TendenciaPronostico.jsx
export default function TendenciaPronostico({ historial }) {
  // Calcular tendencia (comparar último valor con el anterior)
  const calcularTendencia = (valores) => {
    if (valores.length < 2) return { direccion: 'estable', porcentaje: 0 };
    
    const ultimo = valores[valores.length - 1];
    const anterior = valores[valores.length - 2];
    const diferencia = ultimo - anterior;
    
    if (diferencia > 0.5) return { direccion: 'subiendo', porcentaje: diferencia.toFixed(1) };
    if (diferencia < -0.5) return { direccion: 'bajando', porcentaje: Math.abs(diferencia).toFixed(1) };
    return { direccion: 'estable', porcentaje: 0 };
  };

  const temperaturas = historial.map(h => h.temperature);
  const humedades = historial.map(h => h.humidity);

  const tendenciaTemp = calcularTendencia(temperaturas);
  const tendenciaHum = calcularTendencia(humedades);

  const ultimoTemp = temperaturas[temperaturas.length - 1] || 0;
  const ultimoHum = humedades[humedades.length - 1] || 0;

  // 🌞🌙 DETECTAR SI ES DE DÍA O DE NOCHE (6:00 AM a 6:00 PM es de día)
  const horaActual = new Date().getHours();
  const esDeNoche = horaActual >= 18 || horaActual < 6;

  let pronostico = { icono: '☀️', texto: 'Soleado', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };

  if (esDeNoche) {
    // Condiciones nocturnas
    if (ultimoHum > 75) {
      pronostico = { icono: '🌧️', texto: 'Noche Húmeda', color: 'text-blue-400', bg: 'bg-blue-900/30' };
    } else if (ultimoTemp < 15) {
      pronostico = { icono: '️', texto: 'Noche Fría', color: 'text-blue-300', bg: 'bg-indigo-900/30' };
    } else {
      pronostico = { icono: '🌙', texto: 'Noche Despejada', color: 'text-indigo-300', bg: 'bg-indigo-900/30' };
    }
  } else {
    // Condiciones diurnas
    if (ultimoTemp < 15) {
      pronostico = { icono: '️', texto: 'Frío', color: 'text-blue-300', bg: 'bg-blue-900/30' };
    } else if (ultimoTemp > 30 && ultimoHum < 50) {
      pronostico = { icono: '🔥', texto: 'Caluroso', color: 'text-red-400', bg: 'bg-red-900/30' };
    } else if (ultimoHum > 75) {
      pronostico = { icono: '🌧️', texto: 'Lluvioso', color: 'text-blue-400', bg: 'bg-blue-900/30' };
    } else if (ultimoTemp >= 20 && ultimoTemp <= 28 && ultimoHum >= 40 && ultimoHum <= 70) {
      pronostico = { icono: '🌤️', texto: 'Agradable', color: 'text-green-400', bg: 'bg-green-900/30' };
    } else if (ultimoTemp > 28) {
      pronostico = { icono: '', texto: 'Cálido', color: 'text-orange-400', bg: 'bg-orange-900/30' };
    }
  }

  const getFlecha = (tendencia) => {
    if (tendencia.direccion === 'subiendo') {
      return <span className="text-red-400 text-2xl font-bold">↑</span>;
    } else if (tendencia.direccion === 'bajando') {
      return <span className="text-blue-400 text-2xl font-bold">↓</span>;
    }
    return <span className="text-gray-400 text-2xl font-bold">→</span>;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 flex flex-col gap-4 h-full">
      {/* Pronóstico */}
      <div className={`${pronostico.bg} rounded-lg p-4 text-center border border-gray-700 transition-all duration-500`}>
        <div className="text-5xl mb-2">{pronostico.icono}</div>
        <div className={`text-xl font-bold ${pronostico.color}`}>{pronostico.texto}</div>
        <div className="text-gray-400 text-sm mt-1">
          {ultimoTemp.toFixed(1)}°C | {ultimoHum.toFixed(0)}%
        </div>
      </div>

      {/* Tendencia Temperatura */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Temperatura</div>
            <div className="text-white text-2xl font-bold">{ultimoTemp.toFixed(1)}°C</div>
          </div>
          <div className="text-right flex flex-col items-end">
            {getFlecha(tendenciaTemp)}
            <div className={`text-xs font-bold ${
              tendenciaTemp.direccion === 'subiendo' ? 'text-red-400' : 
              tendenciaTemp.direccion === 'bajando' ? 'text-blue-400' : 'text-gray-400'
            }`}>
              {tendenciaTemp.direccion === 'subiendo' && `+${tendenciaTemp.porcentaje}°`}
              {tendenciaTemp.direccion === 'bajando' && `-${tendenciaTemp.porcentaje}°`}
              {tendenciaTemp.direccion === 'estable' && 'Estable'}
            </div>
          </div>
        </div>
      </div>

      {/* Tendencia Humedad */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">Humedad</div>
            <div className="text-white text-2xl font-bold">{ultimoHum.toFixed(0)}%</div>
          </div>
          <div className="text-right flex flex-col items-end">
            {getFlecha(tendenciaHum)}
            <div className={`text-xs font-bold ${
              tendenciaHum.direccion === 'subiendo' ? 'text-blue-400' : 
              tendenciaHum.direccion === 'bajando' ? 'text-orange-400' : 'text-gray-400'
            }`}>
              {tendenciaHum.direccion === 'subiendo' && `+${tendenciaHum.porcentaje}%`}
              {tendenciaHum.direccion === 'bajando' && `-${tendenciaHum.porcentaje}%`}
              {tendenciaHum.direccion === 'estable' && 'Estable'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}