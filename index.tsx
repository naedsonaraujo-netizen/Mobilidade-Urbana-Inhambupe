
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

console.log("Iniciando renderização do React...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
  console.log("React montado com sucesso.");
} catch (err) {
  console.error("Falha ao montar o React:", err);
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.style.display = 'block';
    errorDisplay.innerHTML += `<div><strong>React Crash:</strong> ${err instanceof Error ? err.message : String(err)}</div>`;
  }
}
