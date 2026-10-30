import { useEffect, useState } from 'react';

export function App() {
  const [status, setStatus] = useState<string>('consultando...');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.text())
      .then(setStatus)
      .catch(() => setStatus('backend no disponible'));
  }, []);

  return (
    <main>
      <h1>3DPrinting</h1>
      <p>Backend: {status}</p>
    </main>
  );
}
