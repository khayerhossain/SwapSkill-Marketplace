import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export default async function PostLogin() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role?.toString?.().trim().toLowerCase()
  if (!session) {
    redirect("/auth/signin")
  }
  if (role === "admin") {
    redirect("/dashboard")
  }
  redirect("/appBar")
}


