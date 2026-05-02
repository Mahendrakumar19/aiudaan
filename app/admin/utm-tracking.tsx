import { useEffect, useState } from 'react';
 
interface UTMData {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  timestamp: string;
}

export default function AdminPanel() {
  const [utmData, setUtmData] = useState<UTMData[]>([]);

  useEffect(() => {
    async function fetchUtmData() {
      try {
        const response = await fetch('/api/admin/utm-data');
        const data = await response.json();
        setUtmData(data);
      } catch (error) {
        console.error('Failed to fetch UTM data:', error);
      }
    }

    fetchUtmData();
  }, []);

  return (
    <div className="admin-panel">
      <h1 className="text-2xl font-bold mb-4">UTM Tracking Data</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Source</th>
            <th className="border border-gray-300 px-4 py-2">Medium</th>
            <th className="border border-gray-300 px-4 py-2">Campaign</th>
            <th className="border border-gray-300 px-4 py-2">Term</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {utmData.map((utm, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{utm.source}</td>
              <td className="border border-gray-300 px-4 py-2">{utm.medium}</td>
              <td className="border border-gray-300 px-4 py-2">{utm.campaign}</td>
              <td className="border border-gray-300 px-4 py-2">{utm.term}</td>
              <td className="border border-gray-300 px-4 py-2">{utm.content}</td>
              <td className="border border-gray-300 px-4 py-2">{utm.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}