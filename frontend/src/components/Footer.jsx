// frontend/src/components/Footer.jsx
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const anioActual = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Información institucional */}
        <div className="text-center md:text-left">
          <p className="text-white font-semibold text-sm">
            {t("footer.institution")}
          </p>

          <p className="text-gray-400 text-xs mt-1">
            {t("footer.career")}
          </p>
        </div>

        {/* Proyecto */}
        <div className="text-center">
          <p className="text-blue-400 font-medium text-sm">
            {t("footer.project")}
          </p>

          <p className="text-gray-500 text-xs mt-1">
            {t("footer.subject")}
          </p>
        </div>

        {/* Derechos de autor */}
        <div className="text-center md:text-right">
          <p className="text-gray-400 text-xs">
            © {anioActual} {t("footer.rights")}
          </p>

          <p className="text-gray-500 text-xs mt-1">
            {t("footer.developedWith")}
          </p>
        </div>

      </div>

      {/* Línea decorativa inferior */}
      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs">
          {t("footer.version")}
        </p>
      </div>
    </footer>
  );
}