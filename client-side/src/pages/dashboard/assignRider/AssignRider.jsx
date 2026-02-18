import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels?payment_status=paid&delivery_status=not_collected`,
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading parcels...</p>;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-error">Failed to load parcels</p>
    );
  }

  const handleAssignRider = async (parcel) => {
    try {
      const res = await axiosSecure.get(
        `/riders/available?district=${parcel.senderServiceCenter}`,
      );

      const riders = res.data;

      if (riders.length === 0) {
        return Swal.fire(
          "No Riders Found",
          "No active riders available in this service center.",
          "warning",
        );
      }

      // Build rider list HTML
      const riderListHtml = riders
        .map(
          (rider) => `
    <div style="padding:10px; border-bottom:1px solid #ddd">
      <b>${rider.name}</b><br/>
      📍 ${rider.district}<br/>
      📞 ${rider.phone}<br/>

      <button
        style="
          margin-top:6px;
          padding:4px 8px;
          background:#2563eb;
          color:white;
          border:none;
          border-radius:4px;
          cursor:pointer;
        "
        onclick="window.assignRider('${rider._id}', '${rider.name}')"
      >
        Assign
      </button>
    </div>
  `,
        )
        .join("");

      // Expose function to window for SweetAlert
      window.assignRider = async (riderId, riderName) => {
        const confirm = await Swal.fire({
          title: "Assign Rider?",
          text: `Assign ${riderName} to this parcel?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, assign",
        });

        if (!confirm.isConfirmed) return;

        try {
          const res = await axiosSecure.patch(
            `/parcels/assign-rider/${selectedParcel._id}`,
            {
              riderId,
              riderName,
            },
          );

          if (res.data.modifiedCount > 0) {
            Swal.fire("Assigned!", "Parcel is now in transit.", "success");
            refetch(); // refresh parcel list
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to assign rider", "error");
        }
      };

      Swal.fire({
        title: "Assign Rider",
        html: `
        <div style="max-height:300px; overflow-y:auto; text-align:left">
          ${riderListHtml}
        </div>
      `,
        showConfirmButton: false,
        showCloseButton: true,
        width: 600,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load riders", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Assign Rider (Paid & Not Collected)
      </h2>

      {parcels.length === 0 ? (
        <p className="text-gray-500">No parcels available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Type</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Service Center</th>
                <th>Cost</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.title}</td>
                  <td className="capitalize">{parcel.type}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverServiceCenter}</td>
                  <td>{parcel.cost} ৳</td>
                  <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAssignRider(parcel)}
                    >
                      Assign Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
