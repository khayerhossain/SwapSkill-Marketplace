"use client";
import CheckoutForm from "@/components/paymentForm/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PAYMENT_KEY);

function CheckoutStripe(props) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-full">
        <Elements stripe={stripePromise}>
          <CheckoutForm></CheckoutForm>
        </Elements>
      </div>
    </div>
  );
}

export default CheckoutStripe;
