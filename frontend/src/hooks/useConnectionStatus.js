// frontend/src/hooks/useConnectionStatus.js
import { useState, useEffect } from 'react';
import { domoticApi } from '../services/domoticApi';

const CHECK_INTERVAL_MS = 5000;

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await domoticApi.checkConnection();
      setIsConnected(status);
    };

    checkStatus();
    const interval = setInterval(checkStatus, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return isConnected;
}
