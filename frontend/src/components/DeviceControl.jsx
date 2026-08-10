
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function DeviceControl() {
  const { t } = useTranslation();

  const [estado, setEstado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Obtener estado inicial del LED
  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/devices/light'
        );

        if (response.ok) {
          const data = await response.json();
          setEstado(data.status);
        }
      } catch {
        console.error('Error al obtener estado del foco');
      }
    };

    obtenerEstado();
  }, []);

  const toggleFoco = async (nuevoEstado) => {
    setCargando(true);
    setMensaje('');

    try {
      const response = await fetch(
        'http://localhost:3001/api/devices/light',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nuevoEstado }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEstado(data.status);

        setMensaje(
          `✅ ${
            nuevoEstado
              ? t('deviceControl.messages.turnedOn')
              : t('deviceControl.messages.turnedOff')
          }`
        );
      } else {
        setMensaje(`❌ ${t('deviceControl.messages.controlError')}`);
      }
    } catch {
      setMensaje(`❌ ${t('deviceControl.messages.connectionError')}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-xl">
      {/* Encabezado */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {t('deviceControl.subtitle')}
          </p>

          <h2 className="mt-1 text-xl font-semibold text-ink">
            💡 {t('deviceControl.title')}
          </h2>
        </div>

        {/* Indicador pequeño de estado */}
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
            estado
              ? 'border-online/30 bg-online/10 text-online'
              : 'border-line-strong bg-base text-ink-soft'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              estado ? 'bg-online animate-pulse' : 'bg-ink-faint'
            }`}
          />

          {estado
            ? t('deviceControl.status.on')
            : t('deviceControl.status.off')}
        </div>
      </div>

      {/* Indicador principal del estado */}
      <div
        className={`mb-5 rounded-xl border p-6 text-center transition-all duration-500 ${
          estado
            ? 'border-temp/40 bg-temp-dim/20 shadow-lg shadow-temp/5'
            : 'border-line bg-base'
        }`}
      >
        <div
          className={`mb-3 text-6xl transition-transform duration-300 ${
            estado ? 'scale-105' : 'scale-100'
          }`}
        >
          {estado ? '💡' : '🌑'}
        </div>

        <div
          className={`font-mono text-2xl font-semibold tracking-wide ${
            estado ? 'text-temp' : 'text-ink-soft'
          }`}
        >
          {estado
            ? t('deviceControl.status.on')
            : t('deviceControl.status.off')}
        </div>
      </div>

      {/* Botones de control */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={() => toggleFoco(true)}
          disabled={cargando || estado}
          className={`rounded-xl border px-4 py-3 font-semibold transition-all duration-200 ${
            estado
              ? 'cursor-not-allowed border-line bg-base text-ink-faint'
              : 'border-online/40 bg-online/10 text-online hover:border-online/60 hover:bg-online/20'
          }`}
        >
          {cargando && !estado
            ? '⏳'
            : `⚡ ${t('deviceControl.buttons.on')}`}
        </button>

        <button
          onClick={() => toggleFoco(false)}
          disabled={cargando || !estado}
          className={`rounded-xl border px-4 py-3 font-semibold transition-all duration-200 ${
            !estado
              ? 'cursor-not-allowed border-line bg-base text-ink-faint'
              : 'border-offline/40 bg-offline/10 text-offline hover:border-offline/60 hover:bg-offline/20'
          }`}
        >
          {cargando && estado
            ? '⏳'
            : `🔴 ${t('deviceControl.buttons.off')}`}
        </button>
      </div>

      {/* Mensaje de resultado */}
      {mensaje && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-center text-sm font-medium ${
            mensaje.includes('✅')
              ? 'border-online/30 bg-online/10 text-online'
              : 'border-offline/30 bg-offline/10 text-offline'
          }`}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}
