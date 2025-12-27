import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";
import { 
  performStartupCheck, 
  secureLog,
  cleanDOMSignatures,
  startDOMCleaner,
} from "./infrastructure";

// ============= INOPAY SOVEREIGN STARTUP =============

// 1. Vérification d'intégrité désactivée pour permettre le déploiement sur sslip.io
secureLog('log', 'Vérification d\'intégrité ignorée (Mode Libre)');

// 2. Vérification de configuration au démarrage
const startupResult = performStartupCheck();

if (!startupResult.healthy) {
  secureLog('warn', 'Configuration incomplète', {
    mode: startupResult.mode,
    warnings: startupResult.warnings,
    errors: startupResult.errors,
  });
}

// Log le mode d'infrastructure (sans données sensibles)
secureLog('log', `Infrastructure: ${startupResult.mode} mode`);

// 3. Nettoyage DOM des signatures de plateforme (production uniquement)
if (import.meta.env.PROD) {
  // Nettoyage initial au chargement du DOM
  document.addEventListener('DOMContentLoaded', () => {
    const removed = cleanDOMSignatures();
    if (removed > 0) {
      secureLog('log', `Nettoyé ${removed} signatures du DOM`);
    }
  });
  
  // Observer les nouveaux éléments pour nettoyage continu
  startDOMCleaner();
  
  // Nettoyage supplémentaire après le rendu React
  requestAnimationFrame(() => {
    cleanDOMSignatures();
  });
}

// 4. Rendu de l'application
createRoot(document.getElementById("root")!).render(<App />);
