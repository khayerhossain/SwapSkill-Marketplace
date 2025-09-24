"use client";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function FailPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Payment Failed !",
 
});
    setTimeout(() => router.push("/"), 1500);
  }, []);

  return null;
}
