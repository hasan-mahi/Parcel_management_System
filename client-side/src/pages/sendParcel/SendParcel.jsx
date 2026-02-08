import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/authHook/useAuth";
import useAxiosSecure from "../../hooks/axios/useAxiosSecure";

/* ================= PRICE LOGIC ================= */
const calculatePrice = ({
  type,
  weight = 0,
  senderServiceCenter,
  receiverServiceCenter,
}) => {
  const isSameCity = senderServiceCenter === receiverServiceCenter;
  let breakdown = [];
  let total = 0;

  if (type === "document") {
    total = isSameCity ? 60 : 80;
    breakdown.push(`Document charge: ৳${total}`);
  }

  if (type === "non-document") {
    const base = isSameCity ? 110 : 150;
    breakdown.push(`Base charge (up to 3kg): ৳${base}`);
    total += base;

    if (weight > 3) {
      const extraKg = weight - 3;
      const extraCost = extraKg * 40;
      breakdown.push(`Extra ${extraKg}kg × ৳40 = ৳${extraCost}`);
      total += extraCost;

      if (!isSameCity) {
        breakdown.push(`Outside city extra: ৳40`);
        total += 40;
      }
    }
  }

  return { total, breakdown, isSameCity };
};

const generateTrackingId = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit number

  return `TRK-${year}${month}${day}-${random}`;
};

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, watch } = useForm();

  const [locations, setLocations] = useState([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetch("./warehouses.json")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  /* ================= WATCH ================= */
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");
  const senderCenter = watch("senderServiceCenter");
  const receiverCenter = watch("receiverServiceCenter");

  /* ================= HELPERS ================= */
  const regions = [...new Set(locations.map((l) => l.region))];

  const getCenters = (region) =>
    locations.filter((l) => l.region === region && l.status === "active");

  const getAreas = (city) =>
    locations.find((l) => l.city === city)?.covered_area || [];

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    const { total, breakdown, isSameCity } = calculatePrice({
      type: data.type,
      weight: Number(data.weight || 0),
      senderServiceCenter: data.senderServiceCenter,
      receiverServiceCenter: data.receiverServiceCenter,
    });

    Swal.fire({
      title: "Delivery Cost",
      html: `
        <p><strong>Parcel:</strong> ${data.type}</p>
        <p><strong>Delivery:</strong> ${
          isSameCity ? "Within City" : "Outside City"
        }</p>
        <hr/>
        ${breakdown.map((b) => `<p>${b}</p>`).join("")}
        <hr/>
        <h3>Total: ৳${total}</h3>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((res) => {
      if (res.isConfirmed) {
        const newParcel = {
          ...data,
          cost: total,
          created_by: user.email,
          payment_status: "unpaid",
          delivery_status: "not_collected",
          creation_date: new Date().toISOString(),
          tracking_id: generateTrackingId,
        };

        axiosSecure
          .post("/parcels", newParcel )
          .then((result) => {
            if (result.data.insertedId) {
              Swal.fire("Success", "Parcel Created Successfully!", "success");
            }
            console.log(result.data);
          })
          .catch((error) => console.log(error));
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-6xl mx-auto p-6 space-y-6"
    >
      {/* PARCEL INFO */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">📦 Parcel Info</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              className="select select-bordered"
              {...register("type", { required: true })}
            >
              <option value="">Type</option>
              <option value="document">Document</option>
              <option value="non-document">Non-Document</option>
            </select>

            <input
              className="input input-bordered"
              placeholder="Title"
              {...register("title", { required: true })}
            />

            <input
              type="number"
              className="input input-bordered"
              placeholder="Weight (kg)"
              {...register("weight")}
            />
          </div>
        </div>
      </div>

      {/* SENDER & RECEIVER */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* SENDER */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">👤 Sender</h2>

            <input
              className="input input-bordered"
              defaultValue={user?.displayName}
              {...register("senderName", { required: true })}
            />

            <select
              className="select select-bordered"
              {...register("senderRegion", { required: true })}
            >
              <option value="">Region</option>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              className="select select-bordered"
              {...register("senderServiceCenter", { required: true })}
              disabled={!senderRegion}
            >
              <option value="">Service Center</option>
              {getCenters(senderRegion).map((c) => (
                <option key={c.city}>{c.city}</option>
              ))}
            </select>

            <select
              className="select select-bordered"
              {...register("senderArea", { required: true })}
              disabled={!senderCenter}
            >
              <option value="">Area</option>
              {getAreas(senderCenter).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* RECEIVER */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">📍 Receiver</h2>

            <input
              className="input input-bordered"
              placeholder="Receiver Name"
              {...register("receiverName", { required: true })}
            />

            <select
              className="select select-bordered"
              {...register("receiverRegion", { required: true })}
            >
              <option value="">Region</option>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              className="select select-bordered"
              {...register("receiverServiceCenter", { required: true })}
              disabled={!receiverRegion}
            >
              <option value="">Service Center</option>
              {getCenters(receiverRegion).map((c) => (
                <option key={c.city}>{c.city}</option>
              ))}
            </select>

            <select
              className="select select-bordered"
              {...register("receiverArea", { required: true })}
              disabled={!receiverCenter}
            >
              <option value="">Area</option>
              {getAreas(receiverCenter).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="btn btn-primary w-full">Submit Parcel</button>
    </form>
  );
};

export default SendParcel;
