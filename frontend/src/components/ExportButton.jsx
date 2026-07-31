// frontend/src/components/ExportButton.jsx
import { useState } from 'react';

export default function ExportButton() {
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleDownload = async () => {
    if (!fecha) {
      setMensaje('⚠️ Por favor selecciona una fecha.');
      return;
    }
    
    setMensaje('⏳ Generando archivo...');
    
    try {
      // Usamos la ruta exacta que definimos en el backend modular
      const response = await fetch(`http://localhost:3001/api/measurements/export/excel?fecha=${fecha}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_domotico_${fecha}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMensaje('✅ Descarga exitosa.');
      } else {
        setMensaje('❌ No hay datos para esa fecha.');
      }
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor.');
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-white text-lg font-bold mb-4">📥 Exportar Reporte Histórico</h2>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-gray-400 text-sm mb-1 block">Selecciona el día a consultar:</label>
          <input 
            type="date" 
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button 
          onClick={handleDownload}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar Excel
        </button>
      </div>
      {mensaje && (
        <p className={`mt-3 text-sm font-medium ${mensaje.includes('✅') ? 'text-green-400' : mensaje.includes('❌') || mensaje.includes('⚠️') ? 'text-red-400' : 'text-yellow-400'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}