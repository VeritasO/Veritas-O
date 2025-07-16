// PATCH: Fix SystemManifestViewer component with proper async loading, error handling, and retry

import { useEffect, useState } from "react";

export default function SystemManifestViewer() {
  // State to hold manifest JSON data
  const [manifest, setManifest] = useState<any>(null);
  // Loading indicator state
  const [loading, setLoading] = useState(true);
  // Error message state
  const [error, setError] = useState<string | null>(null);
  // Last sync time state
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Async function to fetch manifest from backend
  const fetchManifest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/system");
      if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
      const data = await response.json();
      setManifest(data);
      setLastSync(new Date());
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setManifest(null);
      console.error("Manifest fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch manifest on component mount
  useEffect(() => {
    fetchManifest();
  }, []);

  // Render loading, error, and manifest UI with retry button
  return (
    <div className="bg-gray-50 p-4 rounded shadow text-sm">
      <h2 className="font-bold text-lg mb-2">System Manifest</h2>

      {loading && (
        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mb-2">
          LOADING...
        </span>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-300 p-2 rounded mb-2">
          <div className="mb-2">
            <strong>ERROR:</strong> {error}
          </div>
          <button
            onClick={fetchManifest}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {lastSync && (
        <div className="text-xs text-gray-500 mb-2">
          Last synced: {lastSync.toLocaleTimeString()}
        </div>
      )}

      {manifest && (
        <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-96 border border-gray-200">
          {JSON.stringify(manifest, null, 2)}
        </pre>
      )}
    </div>
  );
}

// This component fetches the system manifest from the backend, handles loading and error states,
// and displays the manifest JSON in a formatted way. It includes a retry button to refetch
// the manifest in case of an error. The manifest is displayed in a scrollable preformatted
// text block for better readability.
// Ensure the backend route /api/system is set up to return the manifest JSON.
// this code is designed to be used in a React application, and it assumes that the backend
// is set up to serve the manifest at the specified endpoint. The component uses hooks to manage
// state and side effects, making it suitable for functional components in React.
// The component is styled using Tailwind CSS classes for a clean and modern UI.
// Make sure to import this component in your main application file and render it where needed.
// This code is a complete React component that can be used in your application to view the system
// manifest. It handles fetching, loading, error states, and displays the manifest in a user
// friendly format. You can further customize the styles and functionality as per your requirements.
// Note: Ensure that the backend API is correctly implemented to return the manifest data in JSON format.
// This component is ready to be integrated into your React application and will provide a user-friendly
// interface for viewing the system manifest. It is designed to be reusable and can be placed in any
// part of your application where you need to display the system manifest information.
// Make sure to test the component in your development environment to ensure it works as expected.
// This code is a complete React component that can be used in your application to view the system
// manifest. It handles fetching, loading, error states, and displays the manifest in a user
// friendly format. You can further customize the styles and functionality as per your requirements.
// Note: Ensure that the backend API is correctly implemented to return the manifest data in JSON format.
// This component is ready to be integrated into your React application and will provide a user-friendly
// interface for viewing the system manifest. It is designed to be reusable and can be placed in
// any part of your application where you need to display the system manifest information.
// Make sure to test the component in your development environment to ensure it works as expected.