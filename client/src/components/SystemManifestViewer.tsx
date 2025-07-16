import { useEffect, useState } from "react";

export default function SystemManifestViewer() {
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManifest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/system");
      if (!res.ok) throw new Error("Failed to load manifest");
      const data = await res.json();
      setManifest(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setManifest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">System Manifest</h2>
      {loading && (
        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs mb-2">
          LOADING
        </span>
      )}
      {error && (
        <div className="text-red-600 mb-2">
          <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs mb-2">
            ERROR
          </span>
          <p>Error: {error}</p>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={fetchManifest}
          >
            Retry
          </button>
        </div>
      )}
      {manifest && (
        <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
          {JSON.stringify(manifest, null, 2)}
        </pre>
      )}
    </div>
  );
}