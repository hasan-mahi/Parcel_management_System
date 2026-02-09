import React from "react";
import useAuth from "../../../hooks/authHook/useAuth";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return "...Loading";
  }

  return (
    <div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, index) => (
                <tr key={p._id}>
                  <td>{index + 1}</td>
                  <td className="text-xs">{p.parcel_id}</td>
                  <td>৳{p.amount}</td>
                  <td className="capitalize">{p.payment_method}</td>
                  <td className="text-xs">{p.transaction_id}</td>
                  <td>
                    {new Date(p.paid_at).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
