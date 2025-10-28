import React from 'react'

export const metadata = {
  title: "Inbox | Swap Skill",
  description:
    "Check your messages on Swap Skill — stay updated, read and reply to messages from tutors and learners, and manage your conversations seamlessly.",
  icons: {
    icon: "/logo1.png",
  },
};

export default function page() {
  return (
    <div className=" flex items-center justify-center min-h-screen">
      <h1 >
        No messages yet. Start the conversation!
      </h1>
    </div>
  )
}
