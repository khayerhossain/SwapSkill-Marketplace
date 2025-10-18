"use client";
import axiosInstance from "@/lib/axiosInstance";
import { CreditCard, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CiBadgeDollar } from "react-icons/ci";
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
/**
 * Balance Dashboard
 *
 * - Fetches stats from /admin/balance
 * - Fetches payments from /admin/allpayment
 * - Renders cards, bar chart (weekly), pie (gateway share), and a transaction table
 *
 * Notes:
 * - If your backend returns different keys, adjust mapping in fetch handlers.
 * - This component assumes `axiosInstance` is configured with baseURL and auth.
 */

export default function Balance() {
  const [stats, setStats] = useState(null); // { totalAmount, stripeCount, sslCount, ... }
  const [trendData, setTrendData] = useState([]); // e.g. [{ day: 'Mon', payments: 10, amount: 500 }, ...]
  const [payments, setPayments] = useState([]); // payments array
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState(null);

  // number formatting helper
  const formatNumber = (num) =>
    num === undefined || num === null
      ? "-"
      : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Fetch payments
  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoadingPayments(true);
      try {
        const res = await axiosInstance.get("/admin/allpayment");
        // Expected: res.data.payments or res.data
        const data = res.data?.payments ?? res.data ?? [];
        if (mounted) setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        if (mounted) setError("Unable to load payments");
      } finally {
        if (mounted) setLoadingPayments(false);
      }
    };
    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch stats / balance
  useEffect(
    () => {
      let mounted = true;
      const fetchBalance = async () => {
        setLoadingStats(true);
        try {
          const res = await axiosInstance.get("/admin/balance");
          // Expect structure like:
          // { totalAmount: 12345, stripeCount: 45, sslCount: 30, trend: [...optional...] }
          const data = res.data ?? {};
          // normalize keys — some APIs might use totalAmount or totalBalance
          const statsObj = {
            totalAmount: data.totalAmount ?? data.totalBalance ?? 0,
            stripeCount: data.stripeCount ?? data.stripe ?? 0,
            sslCount: data.sslCount ?? data.ssl ?? 0,
            stripePercentage: undefined,
            sslPercentage: undefined,
          };

          const totalPayments =
            Number(statsObj.stripeCount) + Number(statsObj.sslCount);
          statsObj.stripePercentage =
            totalPayments > 0
              ? ((statsObj.stripeCount / totalPayments) * 100).toFixed(2)
              : "0.00";
          statsObj.sslPercentage =
            totalPayments > 0
              ? ((statsObj.sslCount / totalPayments) * 100).toFixed(2)
              : "0.00";

          if (mounted) setStats(statsObj);

          // If backend gives trend data, use it. Otherwise try to compute fallback from payments
          if (mounted) {
            if (Array.isArray(data.trend) && data.trend.length > 0) {
              // expected trend objects: { day: 'Mon', payments: 10, amount: 500 }
              setTrendData(data.trend);
            } else {
              // derive a simple weekly trend from payments (group by date)
              const derived = deriveTrendFromPayments(payments);
              setTrendData(derived);
            }
          }
        } catch (err) {
          console.error("Error fetching balance:", err);
          if (mounted) setError("Unable to load balance");
        } finally {
          if (mounted) setLoadingStats(false);
        }
      };

      fetchBalance();

      return () => {
        mounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      /* no deps, but if you want trend to rederive when payments change, add payments */
    ]
  );

  // If payments change later, re-derive trend if no backend trend provided
  useEffect(() => {
    if (!stats) return;
    // only derive if trendData is empty or seems auto
    if (!trendData || trendData.length === 0) {
      const derived = deriveTrendFromPayments(payments);
      setTrendData(derived);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments]);

  // helper: derive weekly trend from payments by weekday
  function deriveTrendFromPayments(paymentsList) {
    if (!Array.isArray(paymentsList) || paymentsList.length === 0) {
      // fallback: return 7-day placeholders
      return [
        { day: "Mon", payments: 0, amount: 0 },
        { day: "Tue", payments: 0, amount: 0 },
        { day: "Wed", payments: 0, amount: 0 },
        { day: "Thu", payments: 0, amount: 0 },
        { day: "Fri", payments: 0, amount: 0 },
        { day: "Sat", payments: 0, amount: 0 },
        { day: "Sun", payments: 0, amount: 0 },
      ];
    }

    // group by weekday
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = new Map();
    days.forEach((d) => map.set(d, { payments: 0, amount: 0 }));

    paymentsList.forEach((p) => {
      const dateStr = p.date || p.createdAt || p.paymentDate || p.paidAt;
      let dt;
      if (dateStr) dt = new Date(dateStr);
      else dt = new Date(); // unknown => today
      const day = days[dt.getDay()];
      const amount = Number(p.price ?? p.amount ?? p.total ?? 0);
      const current = map.get(day) ?? { payments: 0, amount: 0 };
      current.payments = current.payments + 1;
      current.amount = current.amount + (isNaN(amount) ? 0 : amount);
      map.set(day, current);
    });

    // return Mon-Sun sequence (or custom sequence)
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return order.map((d) => ({
      day: d,
      payments: map.get(d)?.payments ?? 0,
      amount: Math.round(map.get(d)?.amount ?? 0),
    }));
  }

  // UI data for pie
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

  const COLORS = ["#635BFF", "#00D924"];

  // loading state
  if (loadingStats || loadingPayments) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // error fallback
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 overflow-x-hidden">
      <div className="mx-auto overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Balance Dashboard
          </h1>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Last 7 Days
            </span>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white bg-opacity-20 p-1 rounded-xl backdrop-blur-sm">
                  <CiBadgeDollar size={24} className="text-purple-600 " />
                </div>
                <div className="bg-green-400 bg-opacity-30 px-3 py-1 rounded-full backdrop-blur-sm ">
                  <span className="text-sm font-semibold flex items-center justify-center gap-1">
                    <FaArrowTrendUp /> <p>12.5%</p>
                  </span>
                </div>
              </div>
              <p className="text-purple-100 text-sm font-medium mb-2">
                Total Balance
              </p>
              <p className="text-4xl font-bold mb-1">
                ${formatNumber(stats?.totalAmount ?? 0)}
              </p>
              <p className="text-purple-200 text-xs">
                From{" "}
                {Number(stats?.stripeCount ?? 0) + Number(stats?.sslCount ?? 0)}{" "}
                transactions
              </p>
            </div>
          </div>

          {/* Stripe Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Stripe</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
                  <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full -ml-3"></div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-blue-100 text-xs mb-1">Payments</p>
                <p className="text-3xl font-bold">
                  {formatNumber(stats?.stripeCount ?? 0)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs">Share</p>
                  <p className="text-lg font-semibold">
                    {stats?.stripePercentage}%
                  </p>
                </div>
                <div className="bg-green-400 bg-opacity-25 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* SSLCommerz Card */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">SSLCommerz</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-orange-400 rounded-md"></div>
                  <div className="w-6 h-6 bg-red-400 rounded-md"></div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-green-100 text-xs mb-1">Payments</p>
                <p className="text-3xl font-bold">
                  {formatNumber(stats?.sslCount ?? 0)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs">Share</p>
                  <p className="text-lg font-semibold">
                    {stats?.sslPercentage}%
                  </p>
                </div>
                <div className="bg-green-300 bg-opacity-25 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Weekly Payment Activity
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#aaa" fontSize={12} />
                  <YAxis stroke="#aaa" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17,17,17,0.8)",
                      color: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="payments"
                    fill="#635BFF"
                    radius={[8, 8, 0, 0]}
                    name="Payments"
                  />
                  <Bar
                    dataKey="amount"
                    fill="#00D924"
                    radius={[8, 8, 0, 0]}
                    name="Amount ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Payment Gateway Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
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
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      background: "rgba(17,17,17,0.8)",
                      color: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium text-gray-200 text-sm">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-100">
                    {formatNumber(item.count)}
                  </p>
                  <p className="text-sm text-gray-400">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow max-w-7xl mx-auto my-10 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100">
                Recent Transactions
              </h2>
              <span className="text-sm text-gray-400">
                {payments.length} transactions
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-white/10 text-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payments?.slice(0, 6).map?.((row) => (
                  <tr
                    key={row._id ?? row.id ?? Math.random()}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {row?.userName ??
                            row?.user ??
                            row?.customerName ??
                            "-"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {row?.email ?? "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {row?.transactionId ?? row?.txnId ?? row?.id ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          row.paymentMethod === "coin"
                            ? "bg-yellow-400/20 text-yellow-300"
                            : row.paymentMethod === "stripe"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {row?.method ??
                          row?.gateway ??
                          row?.paymentMethod ??
                          "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {row.paymentMethod === "coin" ? "💰" : "$"}{" "}
                      {row.paymentMethod === "coin"
                        ? row.price * 10
                        : row.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {row?.date ?? row?.createdAt ?? row?.paidAt ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                        {row?.status ?? "Unknown"}
                      </span>
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
