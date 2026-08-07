

export default function ConnectionStatus({ isConnected }) {
  
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
      <span className="text-sm font-medium">
        {isConnected ? 'Conectado al Backend' : 'Desconectado del Backend'}
      </span>
    </div>
  );
}