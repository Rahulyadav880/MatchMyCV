import { useEffect, useState } from "react";

interface HealthResponse {
  success: boolean;
  message: string;
}

function App() {
  const [status, setStatus] = useState<string>("Checking backend...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        const data: HealthResponse = await response.json();

        setStatus(data.message);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    };

    checkBackend();
  }, []);

  return (
    <main>
      <h1>Resume Analyzer</h1>

      {error ? (
        <p>Backend Error: {error}</p>
      ) : (
        <p>{status}</p>
      )}
    </main>
  );
}

export default App;