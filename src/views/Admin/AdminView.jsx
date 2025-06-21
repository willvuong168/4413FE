import { useEffect, useState } from "react";
import axios from "axios";

// AdminView: Displays sales and usage reports for administrators
export default function AdminView() {
  const [salesData, setSalesData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await axios.get("/api/admin/sales-monthly");
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
    fetchSales();
    fetchUsage();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Sales Report Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Monthly Sales Report</h2>
        {loadingSales ? (
          <p>Loading sales data...</p>
        ) : (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Items Sold</th>
                <th className="px-4 py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map(({ month, itemsSold, revenue }) => (
                <tr key={month} className="border-t">
                  <td className="px-4 py-2">{month}</td>
                  <td className="px-4 py-2 text-right">{itemsSold}</td>
                  <td className="px-4 py-2 text-right">
                    ${revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Usage Report Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Website Usage Events</h2>
        {loadingUsage ? (
          <p>Loading usage data...</p>
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
              {usageData.map(({ day, eventType, vid, ipAddress }, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{day}</td>
                  <td className="px-4 py-2 capitalize">{eventType}</td>
                  <td className="px-4 py-2">{vid}</td>
                  <td className="px-4 py-2">{ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
