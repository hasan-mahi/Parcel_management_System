import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [modalRider, setModalRider] = useState(null); // simple state for modal

  const { data: riders = [], refetch, isPending } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },
  });

  const handleApprove = async (rider) => {
    try {
      await axiosSecure.patch(`/riders/${rider._id}`, { status: "approved" });
      Swal.fire("Approved!", "Rider has been approved.", "success");
      setModalRider(null);
      refetch();
    } catch {
      Swal.fire("Error", "Failed to approve rider", "error");
    }
  };

  const handleReject = async (rider) => {
    try {
      await axiosSecure.patch(`/riders/${rider._id}`, { status: "rejected" });
      Swal.fire("Rejected", "Rider has been rejected.", "info");
      setModalRider(null);
      refetch();
    } catch {
      Swal.fire("Error", "Failed to reject rider", "error");
    }
  };

  if (isPending) {
    return <p className="text-center mt-6">Loading riders...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {riders.length === 0 ? (
        <p className="text-center text-gray-400">No pending riders.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="table w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Applied</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr
                  key={rider._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <th>{index + 1}</th>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{new Date(rider.applied_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => setModalRider(rider)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalRider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-11/12">
            <h3 className="font-bold text-lg mb-4">Rider Application Review</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <p><b>Name:</b> {modalRider.name}</p>
              <p><b>Email:</b> {modalRider.email}</p>
              <p><b>Age:</b> {modalRider.age || "-"}</p>
              <p><b>Phone:</b> {modalRider.phone}</p>
              <p><b>Region:</b> {modalRider.region}</p>
              <p><b>District:</b> {modalRider.district}</p>
              <p><b>NID Number:</b> {modalRider.nid}</p>
              <p><b>Bike Brand:</b> {modalRider.bikeBrand}</p>
              <p className="sm:col-span-2">
                <b>Bike Registration Number:</b> {modalRider.bikeRegNumber}
              </p>
              {modalRider.extraInfo && (
                <p className="sm:col-span-2">
                  <b>Additional Info:</b> {modalRider.extraInfo}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleApprove(modalRider)}
                className="btn btn-success btn-sm"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(modalRider)}
                className="btn btn-error btn-sm"
              >
                Reject
              </button>
              <button
                onClick={() => setModalRider(null)}
                className="btn btn-ghost btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;
