import { useTranslation } from "react-i18next";

export default function ConnectionStatus({ isConnected }) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        isConnected
          ? "bg-green-900/50 text-green-400"
          : "bg-red-900/50 text-red-400"
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${
          isConnected
            ? "bg-green-400 animate-pulse"
            : "bg-red-400"
        }`}
      />

      <span>
        {isConnected
          ? t("connection.connected")
          : t("connection.disconnected")}
      </span>
    </div>
  );
}