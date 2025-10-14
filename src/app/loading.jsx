import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Loading, please wait…</p>
      </div>
    </div>
  )
}

