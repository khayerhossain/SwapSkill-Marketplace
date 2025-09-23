import dbConnect, { collectionNamesObj } from "@/lib/db.connect";
import axios from "axios";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const paymentInfo = await req.json();
  console.log("received", paymentInfo.price);  

 const traxid= new ObjectId().toString()

 paymentInfo.transactionId = traxid
    const initiate = {
        store_id: "dhali6887a38031a40",
        store_passwd: "dhali6887a38031a40@ssl",
        total_amount: paymentInfo.price,
        currency: "BDT",
        tran_id: `${traxid}`, // use unique tran_id for each api call
        success_url: "http://localhost:3000/success",
        fail_url: "http://localhost:3000/fail",
        cancel_url: "http://localhost:3000/cancel",
        ipn_url: "http://localhost:3000/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: `${paymentInfo.userName}`,
        cus_email: `${paymentInfo.email}`,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };




  const iniResponse = await axios({

    url:'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    method:'POST',
    data:initiate, 
    headers:{

     "Content-Type": "application/x-www-form-urlencoded",
    }
  }) 

  const getewayUrl = iniResponse?.data?.GatewayPageURL
 
  console.log('iniResponse', getewayUrl);
  

  const paymentCollection = await dbConnect(collectionNamesObj.paymentCollection)  

  const savedata = await paymentCollection.insertOne(paymentInfo)


console.log(savedata.insertedId);



  return NextResponse.json({getewayUrl});
}
