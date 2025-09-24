import React from "react";

export default function RightSide() {
  return (
    <div>
      {" "}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <h3 className="font-semibold mb-2">Activity</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>Deraa started following you</li>
          <li>Ediwp liked your photo</li>
          <li>Praha_ liked your photo</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-2">Suggested For You</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between items-center">
            <span>Najid</span>
            <button className="text-blue-500">Follow</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Sheila Dara</span>
            <button className="text-blue-500">Follow</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Jhonson</span>
            <button className="text-blue-500">Follow</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
