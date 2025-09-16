"use client";

import { useEffect, useState } from "react";

export default function SubscribersDashboard() {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    const res = await fetch("/api/subscribers");
    const data = await res.json();
    setSubscribers(data);
  };

  const handleRemove = async (email) => {
    await fetch("/api/subscribers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    fetchSubscribers();
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Subscribers</h1>
      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Image</th>
            <th>Other Data</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((sub) => (
            <tr key={sub._id} className="border-b">
              <td className="p-2">{sub.name || "N/A"}</td>
              <td>{sub.email}</td>
              <td>{new Date(sub.date).toLocaleDateString()}</td>
              <td>
                {sub.image ? <img src={sub.image} alt="profile" className="w-10 h-10 rounded-full"/> : "N/A"}
              </td>
              <td>{sub.otherData || "N/A"}</td>
              <td>
                <button
                  onClick={() => handleRemove(sub.email)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
