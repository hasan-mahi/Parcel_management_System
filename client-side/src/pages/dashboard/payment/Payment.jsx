import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentCheckout from "./PaymentCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentCheckout></PaymentCheckout>
      </Elements>
    </div>
  );
};

export default Payment;
