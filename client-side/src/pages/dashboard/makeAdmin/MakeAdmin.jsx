import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch users by partial email
  const {
    data: users = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["search-users", searchEmail],
    enabled: !!searchEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      return res.data; // 🔥 array
    },
  });

  const handleSearch = () => {
    if (!email.trim()) {
      return Swal.fire("Error", "Please enter an email", "warning");
    }
    setSearchEmail(email.trim());
  };

  const handleRoleUpdate = async (user) => {
    const nextRole = user.role === "admin" ? "user" : "admin";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This user will be changed to ${nextRole}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: `Yes, make ${nextRole}`,
    });

    // ❌ If user cancels
    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch("/users/role", {
        email: user.email,
        role: nextRole,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", `User role changed to ${nextRole}`, "success");
        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="email"
          placeholder="Search user by email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {isError && <p className="text-error">No users found</p>}

      {/* Results */}
      {users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>Role:</b>{" "}
                  <span
                    className={`badge ${
                      user.role === "admin" ? "badge-success" : "badge-neutral"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-3 md:mt-0">
                <button
                  onClick={() => handleRoleUpdate(user)}
                  className={`btn btn-sm ${
                    user.role === "admin" ? "btn-error" : "btn-success"
                  }`}
                >
                  {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchEmail && users.length === 0 && !isPending && (
        <p className="text-gray-400 mt-4">No matching users found</p>
      )}
    </div>
  );
};

export default MakeAdmin;
