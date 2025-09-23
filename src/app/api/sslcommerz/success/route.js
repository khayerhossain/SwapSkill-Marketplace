import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Get form data
  const paymentSuccess = await req.formData();

  // Extract val_id from formData
  const valId = paymentSuccess.get("val_id");
  console.log("Payment Success val_id:", valId);

  // Call SSLCommerz validation API
  const isValidPayment = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=dhali6887a38031a40&store_passwd=dhali6887a38031a40@ssl`
  );

  console.log("Validation Response:", isValidPayment.data);  

  if(isValidPayment.data.status !== 'VALID'){

    return NextResponse.json({ message:'invalid'});
  }  

 const paymentCollection = await dbConnect(collectionNamesObj.paymentCollection);

// Debugging logs
console.log("Tran ID from SSLCommerz:", isValidPayment?.data?.tran_id);

const updatePayment = await paymentCollection.updateOne(
  { transactionId: isValidPayment?.data?.tran_id },
  {
    $set: {
      status: "success",
    },
  }
);

console.log("Update Result:", updatePayment);
  
 

  return NextResponse.json({ status: "success", data: isValidPayment.data });
}
