import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../../hooks/authHook/useAuth";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import Swal from "sweetalert2";

const PaymentCheckout = () => {
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { id } = useParams();

  const { data: parcel = {}, isPending } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${id}`);
      return res.data;
    },
  });

  if (isPending) {
    return "..Loading";
  }

  const parcelAmountInCents = parcel.cost * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log(error);
      setError(error.message);
    } else {
      setError("");
    }

    const res = await axiosSecure.post("/create-payment-intent", {
      parcelAmountInCents,
      id,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName, // Replace with actual customer name input
          email: user.email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer
      setError(`Payment failed: ${result.error.message}`);
      console.log(result.error);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // The payment has been processed!
        setError(null);

        // send to server
        const paymentData = {
          id,
          amount: parcel.cost,
          payment_method: result.paymentIntent.payment_method_types,
          transaction_id: result.paymentIntent.id,
          email: user.email,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.insertedId) {
          Swal.fire({
            title: "Payment Successful!",
            html: `
    <p class="mb-2">Your payment has been completed successfully.</p>
    <strong>Transaction ID:</strong>
    <p class="mt-1 text-sm">${result.paymentIntent.id}</p>
  `,
            icon: "success",
            confirmButtonText: "Go to My Parcels",
            confirmButtonColor: "#22c55e",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/dashboard/myParcels"); // adjust route if needed
            }
          });
        }
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement></CardElement>
        <button className="btn btn-primary" type="submit" disabled={!stripe}>
          Pay {parcel.cost}
        </button>
      </form>
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default PaymentCheckout;
