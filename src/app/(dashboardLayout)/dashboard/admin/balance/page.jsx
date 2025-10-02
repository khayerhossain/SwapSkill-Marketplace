"use client";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Balance() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);

  // Mock trend data - in real app, this would come from your API
  const generateTrendData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      payments: Math.floor(Math.random() * 50) + 10,
      amount: Math.floor(Math.random() * 1000) + 500,
    }));
  };

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosInstance.get("/admin/allpayment");
        setPayments(res.data?.payments || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axiosInstance.get("/admin/balance");
        const data = res.data;

        const { totalAmount, stripeCount, sslCount } = data;

        const totalPayments = stripeCount + sslCount;

        const stripePercentage =
          totalPayments > 0
            ? ((stripeCount / totalPayments) * 100).toFixed(2)
            : 0;
        const sslPercentage =
          totalPayments > 0 ? ((sslCount / totalPayments) * 100).toFixed(2) : 0;

        setStats({
          totalAmount,
          stripeCount,
          sslCount,
          stripePercentage,
          sslPercentage,
        });

        // Generate trend data
        setTrendData(generateTrendData());
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const pieData = stats
    ? [
        {
          name: "Stripe",
          value: parseFloat(stats.stripePercentage),
          count: stats.stripeCount,
        },
        {
          name: "SSLCommerz",
          value: parseFloat(stats.sslPercentage),
          count: stats.sslCount,
        },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F"];

  console.log(payments);

  const StatCard = ({ title, value, percentage, trend = "up", subtitle }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className={`flex items-center px-3 py-1 rounded-full ${
            trend === "up"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          <span className="text-sm font-semibold">
            {trend === "up" ? "↗" : "↘"} {percentage}%
          </span>
        </div>
      </div>
    </div>
  );

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Balance Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount}`}
            percentage="12.5"
            trend="up"
            subtitle="All time revenue"
          />

          <StatCard
            title="Stripe Payments"
            value={stats.stripeCount}
            percentage={stats.stripePercentage}
            trend="up"
            subtitle={`${stats.stripePercentage}% of total`}
          />

          <StatCard
            title="SSLCommerz Payments"
            value={stats.sslCount}
            percentage={stats.sslPercentage}
            trend="up"
            subtitle={`${stats.sslPercentage}% of total`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Method Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </p>
                  <p className="text-sm text-gray-500">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="payments"
                    stroke="#0088FE"
                    strokeWidth={3}
                    dot={{ fill: "#0088FE", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Number of Payments"
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#00C49F"
                    strokeWidth={3}
                    dot={{ fill: "#00C49F", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Amount ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden max-w-7xl mx-auto my-10">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Payment History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs  font-bold uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-bold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-bold uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs  font-bold uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments?.slice(0, 6)?.map((row) => (
                  <tr key={row._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {row?.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {row?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {row?.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ${row?.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Balance;
