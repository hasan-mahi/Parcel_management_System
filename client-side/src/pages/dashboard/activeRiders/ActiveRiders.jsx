import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import Swal from "sweetalert2";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch approved (active) riders
  const {
    data: riders = [],
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=approved");
      return res.data;
    },
  });

  // Filter riders by search term safely
  const filteredRiders = riders.filter((rider) =>
    (rider.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Deactivate rider
  const handleDeactivate = (riderId, riderName) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to deactivate ${riderName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/riders/${riderId}`, {
            status: "deactivated",
          });
          Swal.fire(
            "Deactivated!",
            `${riderName} has been deactivated.`,
            "success",
          );
          refetch();
        } catch (error) {
          Swal.fire("Error", `Failed to deactivate rider. ${error.message}`);
        }
      }
    });
  };

  if (isPending) {
    return <p className="text-center mt-6">Loading riders...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
      </div>

      {/* Riders Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRiders.length > 0 ? (
              filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <th>{index + 1}</th>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>
                    <span
                      className={`badge ${
                        rider.status === "approved"
                          ? "badge-success"
                          : rider.status === "deactivated"
                            ? "badge-gray"
                            : "badge-warning"
                      }`}
                    >
                      {rider.status}
                    </span>
                  </td>
                  <td>
                    {rider.status === "approved" && (
                      <button
                        onClick={() => handleDeactivate(rider._id, rider.name)}
                        className="btn btn-xs btn-error"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400">
                  No active riders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
