import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";

const TrackParcel = ({ trackingId }) => {
  const axiosSecure = useAxiosSecure();
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    axiosSecure
      .get(`/tracking/${trackingId}`)
      .then((res) => {
        setTracking(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Tracking load failed", err);
        setLoading(false);
      });
  }, [trackingId, axiosSecure]);

  if (loading) {
    return <p className="text-center mt-4">Loading tracking info...</p>;
  }

  if (tracking.length === 0) {
    return (
      <p className="text-center mt-4 text-gray-400">
        No tracking information available
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Parcel Tracking</h3>

      <ul className="timeline timeline-vertical">
        {tracking.map((item) => (
          <li key={item._id}>
            <div className="timeline-start text-xs text-gray-400">
              {new Date(item.time).toLocaleString()}
            </div>

            <div className="timeline-middle">
              <span className="badge badge-primary badge-xs"></span>
            </div>

            <div className="timeline-end">
              <p className="font-semibold">{item.status}</p>
              <p className="text-sm text-gray-500">{item.message}</p>
              <p className="text-xs text-gray-400">
                Updated by: {item.updated_by}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackParcel;
