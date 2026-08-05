// frontend/src/components/Footer.jsx
export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray-700 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Información institucional */}
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-sm">
              Tecnológico Universitario Rumiñahui
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Carrera de Sistemas y Gestión de Data
            </p>
          </div>

          {/* Proyecto */}
          <div className="text-center">
            <p className="text-blue-400 font-medium text-sm">
              Proyecto: Monitoreo Ambiental DHT11
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Asignatura: Reutilización de Software
            </p>
          </div>

          {/* Derechos de autor */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-xs">
              © {anioActual} Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Desarrollado con Arduino, Node.js y React
            </p>
          </div>

        </div>

        {/* Línea decorativa inferior */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-600 text-xs">
            v1.0 | Panel de Instrumentos Domótico
          </p>
        </div>
      </div>
    </footer>
  );
}