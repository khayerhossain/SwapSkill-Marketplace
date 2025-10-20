"use client"
import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")
    await signIn("credentials", { redirect: true, email, password, callbackUrl: "/post-login" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="email" type="email" required placeholder="Email" className="w-full border p-2 rounded" />
          <input name="password" type="password" required placeholder="Password" className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-black text-white py-2 rounded">Sign in</button>
        </form>
        <div className="mt-4">
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full border py-2 rounded">Continue with Google</button>
        </div>
      </div>
    </div>
  )
}


