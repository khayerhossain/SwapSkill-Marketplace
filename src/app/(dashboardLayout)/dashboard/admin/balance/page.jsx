"use client";
import Loading from "@/app/loading";
import axiosInstance from "@/lib/axiosInstance";
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CiBadgeDollar } from "react-icons/ci";
import { FaArrowTrendUp, FaStripe } from "react-icons/fa6";
import { SiSsl } from "react-icons/si";
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
  Area,
  AreaChart,
  Line,
  LineChart,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  Label,
  LabelList,
} from "recharts";

/**
 * Modern Balance Dashboard
 * Enhanced with better visuals, animations, and modern UI elements
 */

export default function Balance() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState(null);

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
  useEffect(() => {
    let mounted = true;
    const fetchBalance = async () => {
      setLoadingStats(true);
      try {
        const res = await axiosInstance.get("/admin/balance");
        const data = res.data ?? {};
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

        if (mounted) {
          if (Array.isArray(data.trend) && data.trend.length > 0) {
            setTrendData(data.trend);
          } else {
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
  }, []);

  useEffect(() => {
    if (!stats) return;
    if (!trendData || trendData.length === 0) {
      const derived = deriveTrendFromPayments(payments);
      setTrendData(derived);
    }
  }, [payments]);

  function deriveTrendFromPayments(paymentsList) {
    if (!Array.isArray(paymentsList) || paymentsList.length === 0) {
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

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const map = new Map();
    days.forEach((d) => map.set(d, { payments: 0, amount: 0 }));

    paymentsList.forEach((p) => {
      const dateStr = p.date || p.createdAt || p.paymentDate || p.paidAt;
      let dt;
      if (dateStr) dt = new Date(dateStr);
      else dt = new Date();
      const day = days[dt.getDay()];
      const amount = Number(p.price ?? p.amount ?? p.total ?? 0);
      const current = map.get(day) ?? { payments: 0, amount: 0 };
      current.payments = current.payments + 1;
      current.amount = current.amount + (isNaN(amount) ? 0 : amount);
      map.set(day, current);
    });

    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return order.map((d) => ({
      day: d,
      payments: map.get(d)?.payments ?? 0,
      amount: Math.round(map.get(d)?.amount ?? 0),
    }));
  }

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

  const COLORS = ["#6366f1", "#10b981"];

  if (loadingStats || loadingPayments) {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-500 bg-clip-text mb-2">
              Balance <span className="text-white">Dashboard</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Overview of your payment activities and transactions
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800/50 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Period
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Last 7 Days
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="group relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-6 text-white overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30">
                  <DollarSign
                    className="w-7 h-7 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">+12.5%</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  Total Balance
                </p>
                <p className="text-4xl font-black tracking-tight">
                  ${formatNumber(stats?.totalAmount ?? 0)}
                </p>
                <p className="text-white/70 text-xs flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {Number(stats?.stripeCount ?? 0) +
                      Number(stats?.sslCount ?? 0)}{" "}
                    transactions
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Stripe Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-6 text-white overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-xl shadow-xl">
                    <FaStripe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Stripe</p>
                    <p className="text-xs text-white/70">Payment Gateway</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-400/30 backdrop-blur-md rounded-full border border-green-300/50">
                  <span className="text-xs font-bold">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs mb-0.5 uppercase tracking-wide">
                    Payments
                  </p>
                  <p className="text-2xl font-black">
                    {formatNumber(stats?.stripeCount ?? 0)}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs mb-0.5 uppercase tracking-wide">
                    Share
                  </p>
                  <p className="text-2xl font-black">
                    {stats?.stripePercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SSLCommerz Card */}
          <div className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl shadow-2xl p-6 text-white overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white rounded-xl shadow-xl">
                    <CreditCard
                      className="w-6 h-6 text-black"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">SSLCommerz</p>
                    <p className="text-xs text-white/70">Payment Gateway</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-400/30 backdrop-blur-md rounded-full border border-green-300/50">
                  <span className="text-xs font-bold">Active</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs mb-0.5 uppercase tracking-wide">
                    Payments
                  </p>
                  <p className="text-2xl font-black">
                    {formatNumber(stats?.sslCount ?? 0)}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs mb-0.5 uppercase tracking-wide">
                    Share
                  </p>
                  <p className="text-2xl font-black">{stats?.sslPercentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch">
            {/* --- MODERN WEEKLY TREND --- */}
            <div className="bg-gradient-to-br from-[#18181B] to-[#23235b] border border-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">Weekly Trend</h3>
                    <span className="inline-block px-3 py-1 rounded-xl text-xs bg-fuchsia-600 text-white font-bold uppercase">Payments</span>
                </div>
                <div className="h-80 w-full">
                    {/* Analytics-style (manual) Bar Chart for Weekly Trend */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 mt-10 max-w-3xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Weekly Trend (Bar)</h3>
                        <span className="text-gray-400 text-xs">Simple, elegant bar</span>
                      </div>
                      <div className="h-64 flex items-end justify-between space-x-5">
                        {trendData?.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className="bg-blue-500 rounded-t-lg w-9 mb-1 transition-all duration-500 shadow-lg hover:bg-fuchsia-500"
                              style={{ height: `${(item.amount / Math.max(...trendData.map(d=>d.amount || 1), 1)) * 190}px` }}
                              title={`$${item.amount}`}
                            ></div>
                            <span className="text-xs font-semibold text-gray-400 mt-2">{item.day}</span>
                            <span className="text-xs text-white">${item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
            </div>
            {/* --- MODERN DONUT CHART --- */}
            <div className="bg-gradient-to-br from-[#133649] to-[#16181d] border border-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">Gateway Distribution</h3>
                    <span className="inline-block px-3 py-1 rounded-xl text-xs bg-sky-600 text-white font-bold uppercase">Split</span>
                </div>
                <div className="relative h-80 w-full flex items-center justify-center">
                    {/* Analytics-style (manual) Pie/Stat Chart for Gateway Split */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 mt-10 max-w-xl mx-auto flex flex-col items-center">
                      <div className="flex items-center justify-between w-full mb-6">
                        <h3 className="text-xl font-bold text-white">Gateway Split</h3>
                        <span className="text-gray-400 text-xs">Analytics format</span>
                      </div>
                      <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center ">
                        {pieData?.map((item, idx) => (
                          <div key={item.name} className="flex flex-col items-center">
                            <div
                              className="rounded-full shadow-lg mb-3"
                              style={{
                                width: 62,
                                height: 62,
                                background: COLORS[idx % COLORS.length],
                                opacity: 0.85,
                                boxShadow: '0 3px 16px '+COLORS[idx%COLORS.length]+'99',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#fff'
                              }}
                              title={`${item.name} - ${item.value}% share`}
                            >
                              <span>${item.count}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-300">{item.name}</span>
                            <span className="text-xs text-gray-400">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                </div>
                {/* Modern horizontal legend */}
                <div className="flex items-center justify-center gap-5 mt-6">
                    {pieData.map((item, idx) => (
                        <div className="flex items-center gap-2" key={item.name}>
                            <span className="block w-5 h-5 rounded-full border-2 border-white" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                            <span className="text-sm text-gray-200 font-semibold">{item.name}</span>
                            <span className="text-xs text-gray-400">({item.count})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Transaction Table - Original Style */}
        <div className="bg-[#111111] backdrop-blur-md border border-white/10 rounded-2xl shadow max-w-7xl mx-auto my-10 overflow-hidden">
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
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-bold">
                      {row.paymentMethod === "coin" ? "" : "$"}{" "}
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
