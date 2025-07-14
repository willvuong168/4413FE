import { useEffect, useState } from "react";
import axios from "axios";

// AdminView: Displays sales and usage reports for administrators
export default function AdminView() {
  const [salesData, setSalesData] = useState({ totalRevenue: 0, data: [] });
  const [usageData, setUsageData] = useState([]);
  const [eventLogData, setEventLogData] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [loadingEventLog, setLoadingEventLog] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await axios.get("/api/admin/sales");
        setSalesData(res.data);
      } catch (err) {
        console.error("Error fetching sales data", err);
      } finally {
        setLoadingSales(false);
      }
    }
    async function fetchUsage() {
      try {
        const res = await axios.get("/api/admin/usage");
        setUsageData(res.data);
      } catch (err) {
        console.error("Error fetching usage data", err);
      } finally {
        setLoadingUsage(false);
      }
    }
    async function fetchEventLog() {
      try {
        const res = await axios.get("/api/admin/event-log");
        setEventLogData(res.data);
      } catch (err) {
        console.error("Error fetching event log data", err);
      } finally {
        setLoadingEventLog(false);
      }
    }
    fetchSales();
    fetchUsage();
    fetchEventLog();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Sales Report Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
        {loadingSales ? (
          <p>Loading sales data...</p>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <h3 className="text-lg font-semibold">
                Total Revenue: ${salesData.totalRevenue?.toLocaleString()}
              </h3>
            </div>
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Vehicle ID</th>
                  <th className="px-4 py-2 text-right">Quantity Sold</th>
                  <th className="px-4 py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.data?.map(({ vehicleId, quantitySold, revenue }) => (
                  <tr key={vehicleId} className="border-t">
                    <td className="px-4 py-2">{vehicleId}</td>
                    <td className="px-4 py-2 text-right">{quantitySold}</td>
                    <td className="px-4 py-2 text-right">
                      ${revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Usage Report Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Vehicle Usage Statistics
        </h2>
        {loadingUsage ? (
          <p>Loading usage data...</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Vehicle ID</th>
                <th className="px-4 py-2 text-right">Views</th>
                <th className="px-4 py-2 text-right">Purchases</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map(({ vehicleId, views, purchases }) => (
                <tr key={vehicleId} className="border-t">
                  <td className="px-4 py-2">{vehicleId}</td>
                  <td className="px-4 py-2 text-right">{views}</td>
                  <td className="px-4 py-2 text-right">{purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Event Log Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Event Log</h2>
        {loadingEventLog ? (
          <p>Loading event log data...</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Event Type</th>
                <th className="px-4 py-2 text-left">Vehicle ID</th>
                <th className="px-4 py-2 text-left">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {eventLogData.map(
                ({ day, eventType, vehicleId, ipAddress }, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{day}</td>
                    <td className="px-4 py-2 capitalize">{eventType}</td>
                    <td className="px-4 py-2">{vehicleId}</td>
                    <td className="px-4 py-2">{ipAddress}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
