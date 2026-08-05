import { useState, useEffect } from 'react';

export default function DeviceControl() {
  const [estado, setEstado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Obtener estado inicial del LED
  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/devices/light');
        if (response.ok) {
          const data = await response.json();
          setEstado(data.status);
        }
      } catch (error) {
        console.error('Error al obtener estado del foco:', error);
      }
    };
    obtenerEstado();
  }, []);

  const toggleFoco = async (nuevoEstado) => {
    setCargando(true);
    setMensaje('');
    
    try {
      const response = await fetch('http://localhost:3001/api/devices/light', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nuevoEstado })
      });

      if (response.ok) {
        const data = await response.json();
        setEstado(data.status);
        setMensaje(`✅ Foco ${nuevoEstado ? 'ENCENDIDO' : 'APAGADO'} correctamente`);
      } else {
        setMensaje('❌ Error al controlar el foco');
      }
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700">
      <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
        💡 Control del Foco
      </h2>

      {/* Indicador visual del estado */}
      <div className={`rounded-lg p-6 text-center mb-4 transition-all duration-500 ${
        estado 
          ? 'bg-yellow-900/40 border-2 border-yellow-500 shadow-lg shadow-yellow-500/30' 
          : 'bg-gray-800 border-2 border-gray-700'
      }`}>
        <div className="text-6xl mb-2">
          {estado ? '💡' : '🌑'}
        </div>
        <div className={`text-xl font-bold ${estado ? 'text-yellow-400' : 'text-gray-500'}`}>
          {estado ? 'ENCENDIDO' : 'APAGADO'}
        </div>
      </div>

      {/* Botones de control */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => toggleFoco(true)}
          disabled={cargando || estado}
          className={`py-3 px-4 rounded font-bold transition-all ${
            estado
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {cargando && estado ? '⏳' : '⚡ Encender'}
        </button>

        <button
          onClick={() => toggleFoco(false)}
          disabled={cargando || !estado}
          className={`py-3 px-4 rounded font-bold transition-all ${
            !estado
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {cargando && !estado ? '⏳' : '🔴 Apagar'}
        </button>
      </div>

      {mensaje && (
        <p className={`mt-3 text-sm font-medium text-center ${
          mensaje.includes('✅') ? 'text-green-400' : 'text-red-400'
        }`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}