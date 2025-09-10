import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="text-center min-h-screen">
      HomePage
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
    </div>
  );
}
