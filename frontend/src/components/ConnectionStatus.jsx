// frontend/src/components/ConnectionStatus.jsx
import { useState, useEffect } from 'react';
import { domoticApi } from '../services/domoticApi';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await domoticApi.checkConnection();
      setIsConnected(status);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Revisar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
      <span className="text-sm font-medium">
        {isConnected ? 'Conectado al Backend' : 'Desconectado del Backend'}
      </span>
    </div>
  );
}