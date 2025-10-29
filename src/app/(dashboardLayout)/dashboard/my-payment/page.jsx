"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function MyPayment() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const amount = searchParams.get("amount");
  const tran_id = searchParams.get("tran_id");

  useEffect(() => {
    if (status === "success") {
      Swal.fire({
        title: "🎉 Payment Successful!",
        html: `<p><b>Transaction ID:</b> ${tran_id}</p>
               <p><b>Amount Paid:</b> ৳${amount}</p>`,
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#2563eb",
      });
    }
  }, [status, amount, tran_id]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">My Payments</h1>
   
    </div>
  );
}
