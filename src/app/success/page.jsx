"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
   Swal.fire({
    icon: "success",
    title: "Success",
    text: "Payment completed successfully!",
   
  })
    setTimeout(() => router.push("/"), 1500);
  }, []);

  return null;
}
