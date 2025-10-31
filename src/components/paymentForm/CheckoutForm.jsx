import { ThemeContext } from "@/context/ThemeProvider";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import AOS from "aos";
import "aos/dist/aos.css";
import axiosInstance from "@/lib/axiosInstance";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";
import Swal from "sweetalert2";
function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const planName = searchParams.get("name");
  const price = searchParams.get("price");
  const { theme } = use(ThemeContext);
  const date = new Date();
  const options = {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const piceInCents = price * 100;
  const [error, setError] = useState("");

  AOS.init({
    duration: 800, // animation duration
    easing: "ease-in-out",
    once: true, // run only once
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentHistroy = {
      planName: planName,
      price: price,
      email: session?.user?.email,
      userName: session?.user?.name,
      transactionId: "", 
      paymentMethod:'stripe',
      date: date.toLocaleString("en-BD", options),
      status: "pending",
    };

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);
     
    }

      const { data } = await axiosInstance.post(
        "/stripe/create-payment-intent",
        { piceInCents: price * 100 }) 


    console.log("res form intent", data.clientSecret);  

    const result = await stripe.confirmCardPayment(data.clientSecret,{
      payment_method:{
        card:elements.getElement(CardElement),
        billing_details:{
          name:session?.user?.name
        }
      }
    })

    if(result.error){
   
       Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${result.error.message}`,
       
      });
      console.log(result.error.message);
      
    }else{
      if(result.paymentIntent.status === 'succeeded'){

         paymentHistroy.transactionId = result.paymentIntent.id;
         paymentHistroy.status = "success";

  
    await axiosInstance.post(
        "/payment-history",
        paymentHistroy) 

  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Payment completed successfully!",
  });

  window.location.href = "/";
      }
    }



  };
  return (
    <div data-aos="fade-down">
      <form
        onSubmit={handleSubmit}
        className="space-y-4  border p-6 rounded-xl text-blue-700 shadow-md w-full max-w-md mx-auto"
      >
        <div className="grid grid-cols-2 gap-3 text-sm">
          <span className="text-gray-400 font-medium">Plan Name:</span>
          <span className="text-gray-400">{planName}</span>

          <span className="text-gray-400 font-medium">Price:</span>
          <span className="text-gray-400"> ${price}</span>

          <span className="text-gray-400 font-medium">User Name:</span>
          <span className="text-gray-400">{session?.user?.name}</span>

          <span className="text-gray-400 font-medium">Email:</span>
          <span className="text-gray-400">{session?.user?.email}</span>

          <span className="text-gray-400 font-medium">Date & Time:</span>
          <span className="text-gray-400">
            {date.toLocaleString("en-BD", options)}
          </span>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: theme === "dark" ? "#ffffff" : "#000000", // 👈 auto toggle
                "::placeholder": {
                  color: theme === "dark" ? "#9ca3af" : "#6b7280", // gray-400 vs gray-500
                },
              },
              invalid: {
                color: "#ef4444", // red-500
              },
            },
          }}
          className="p-2 border rounded  "
        ></CardElement>
        <button type="submit" className="btn tom-btn w-full" disabled={!stripe}>
          {" "}
          Pay ${price}
        </button>
        {error && <p className="text-red-500"> {error}</p>}
      </form>
    </div>
  );
}

export default CheckoutForm;
