import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/authHook/useAuth";
import useAxiosSecure from "../../../hooks/axios/useAxiosSecure";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, watch } = useForm();

  const [centers, setCenters] = useState([]);

  // watch selected region
  const selectedRegion = watch("region");

  // load data from public folder
  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => setCenters(data));
  }, []);

  // unique regions
  const regions = [...new Set(centers.map((c) => c.region))];

  // districts based on region
  const districts = centers.filter((c) => c.region === selectedRegion);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName,
      email: user?.email,
      status: "pending",
      applied_at: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your rider application is under review.",
          confirmButtonText: "OK",
        });

        // clear form
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6
               bg-base-100 dark:bg-base-200
               p-4 sm:p-6 rounded-xl shadow-md"
      >
        {/* NAME */}
        <div>
          <label className="label label-text font-medium">Name</label>
          <input
            value={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full
                   bg-base-200 dark:bg-base-300
                   text-base-content cursor-not-allowed"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="label label-text font-medium">Email</label>
          <input
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full
                   bg-base-200 dark:bg-base-300
                   text-base-content cursor-not-allowed"
          />
        </div>

        {/* AGE */}
        <div>
          <label className="label label-text font-medium">Age</label>
          <input
            type="number"
            {...register("age", { required: true, min: 18 })}
            placeholder="18+"
            className="input input-bordered w-full"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="label label-text font-medium">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            placeholder="01XXXXXXXXX"
            className="input input-bordered w-full"
          />
        </div>

        {/* REGION */}
        <div>
          <label className="label label-text font-medium">Region</label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT */}
        <div>
          <label className="label label-text font-medium">District</label>
          <select
            {...register("district", { required: true })}
            className="select select-bordered w-full"
            disabled={!selectedRegion}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district}
              </option>
            ))}
          </select>
        </div>

        {/* NID */}
        <div>
          <label className="label label-text font-medium">NID Number</label>
          <input
            {...register("nid", { required: true })}
            placeholder="National ID Number"
            className="input input-bordered w-full"
          />
        </div>

        {/* BIKE BRAND */}
        <div>
          <label className="label label-text font-medium">Bike Brand</label>
          <input
            {...register("bikeBrand", { required: true })}
            placeholder="Honda / Yamaha / Bajaj"
            className="input input-bordered w-full"
          />
        </div>

        {/* BIKE REG NUMBER */}
        <div className="sm:col-span-2">
          <label className="label label-text font-medium">
            Bike Registration Number
          </label>
          <input
            {...register("bikeRegNumber", { required: true })}
            placeholder="Dhaka Metro-XX-XXXX"
            className="input input-bordered w-full"
          />
        </div>

        {/* EXTRA INFO */}
        <div className="sm:col-span-2">
          <label className="label label-text font-medium">
            Additional Information (Optional)
          </label>
          <textarea
            {...register("extraInfo")}
            rows={3}
            placeholder="Delivery experience, working hours, etc."
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* SUBMIT */}
        <div className="sm:col-span-2 pt-2">
          <button className="btn btn-primary w-full text-base font-semibold">
            Submit Rider Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
