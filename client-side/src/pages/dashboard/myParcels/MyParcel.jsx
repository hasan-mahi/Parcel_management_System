import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/authHook/useAuth";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["myParcels", user.email],
    queryFn: async () => {
      const res = axiosSecure.get(`/parcels?email=${user.email}`);
      return (await res).data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      axiosSecure.delete(`parcels/${id}`).then((res) => {
        console.log(res.data);
        if (res.data.deletedCount) {
          // 🔔 Success alert
          Swal.fire({
            title: "Deleted!",
            text: "Parcel has been deleted successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
        refetch();
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>

                <td>{parcel.type}</td>

                <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>

                <td className="font-semibold">৳{parcel.cost}</td>

                <td>
                  <span
                    className={`badge ${
                      parcel.payment_status === "paid"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>

                <td className="space-x-2">
                  <button className="btn btn-xs btn-info">View</button>

                  {parcel.payment_status === "unpaid" && (
                    <Link to={`/dashboard/payment/${parcel._id}`} className="btn btn-xs btn-warning">Pay</Link>
                  )}

                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No parcels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcel;
