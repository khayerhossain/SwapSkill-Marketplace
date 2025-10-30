"use client";

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  UserCheck,
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/app/loading";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalSubscribers: 0,
    totalRevenue: 0,
    totalSkills: 0,
    totalPosts: 0,
    totalMessages: 0,
    monthlyGrowth: 0,
    userGrowth: [],
    revenueData: [],
    skillCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch analytics data from the analytics API
      const analyticsRes = await fetch("/api/analytics");
      const analyticsResData = await analyticsRes.json();
      const analyticsData = analyticsResData?.analytics || {};

      // Extract the main analytics data
      const totalUsers = analyticsData.totalUsers || 0;
      const totalSubscribers = analyticsData.totalSubscribers || 0;
      const totalRevenue = analyticsData.totalRevenue || 0;
      const totalSkills = analyticsData.totalSkills || 0;
      const totalPosts = 0; // Keep as 0 for now
      const totalMessages = 0; // Keep as 0 for now

      const monthlyGrowth = 12.5; // mock growth

      // Mock chart data
      const userGrowth = [
        { month: "Jan", users: 120 },
        { month: "Feb", users: 150 },
        { month: "Mar", users: 180 },
        { month: "Apr", users: 220 },
        { month: "May", users: 280 },
        { month: "Jun", users: 320 },
      ];

      const revenueData = [
        { month: "Jan", revenue: 1200 },
        { month: "Feb", revenue: 1800 },
        { month: "Mar", revenue: 2200 },
        { month: "Apr", revenue: 2800 },
        { month: "May", revenue: 3200 },
        { month: "Jun", revenue: 3800 },
      ];

      const skillCategories = [
        { name: "Programming", count: 45, percentage: 30 },
        { name: "Design", count: 32, percentage: 21 },
        { name: "Marketing", count: 28, percentage: 19 },
        { name: "Writing", count: 25, percentage: 17 },
        { name: "Other", count: 20, percentage: 13 },
      ];

      setAnalytics({
        totalUsers,
        totalSubscribers,
        totalRevenue,
        totalSkills,
        totalPosts,
        totalMessages,
        monthlyGrowth,
        userGrowth,
        revenueData,
        skillCategories,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      change: "+12.5%",
      changeType: "positive",
      color: "bg-blue-500",
    },
    {
      title: "Active Subscribers",
      value: analytics.totalSubscribers.toLocaleString(),
      icon: <UserCheck className="w-6 h-6" />,
      change: "+8.2%",
      changeType: "positive",
      color: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      change: "+15.3%",
      changeType: "positive",
      color: "bg-yellow-500",
    },
    {
      title: "Total Skills",
      value: analytics.totalSkills.toLocaleString(),
      icon: <BookOpen className="w-6 h-6" />,
      change: "+22.1%",
      changeType: "positive",
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-red-500">Analytics</span> Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor your platform's performance and growth
        </p>

        {/* Time Range Selector */}
        <div className="mt-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#111111] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <div className="flex items-center text-sm">
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">User Growth</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.userGrowth.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-8 mb-2 transition-all duration-500"
                  style={{
                    height: `${(item.users / 400) * 200}px`,
                  }}
                ></div>
                <span className="text-xs text-gray-400">{item.month}</span>
                <span className="text-xs text-gray-300">{item.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Revenue Growth</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-green-500 rounded-t w-8 mb-2 transition-all duration-500"
                  style={{
                    height: `${(item.revenue / 4000) * 200}px`,
                  }}
                ></div>
                <span className="text-xs text-gray-400">{item.month}</span>
                <span className="text-xs text-gray-300">${item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Categories + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Categories */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Skill Categories</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.skillCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{
                      backgroundColor: [
                        "#3B82F6",
                        "#10B981",
                        "#F59E0B",
                        "#EF4444",
                        "#8B5CF6",
                      ][index % 5],
                    }}
                  ></div>
                  <span className="text-gray-300">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {category.count}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                time: "2 minutes ago",
                type: "user",
              },
              {
                action: "Skill shared: React Development",
                time: "15 minutes ago",
                type: "skill",
              },
              {
                action: "Payment received: $29.99",
                time: "1 hour ago",
                type: "payment",
              },
              {
                action: "New subscription activated",
                time: "2 hours ago",
                type: "subscription",
              },
              {
                action: "User completed profile",
                time: "3 hours ago",
                type: "profile",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-blue-500"
                      : activity.type === "skill"
                      ? "bg-green-500"
                      : activity.type === "payment"
                      ? "bg-yellow-500"
                      : activity.type === "subscription"
                      ? "bg-purple-500"
                      : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
