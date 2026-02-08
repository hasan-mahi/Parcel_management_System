import React from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../../context/authContext/AuthContext";
import useAuth from "../../../hooks/authHook/useAuth";
import { Link } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";

const Register = () => {
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    registerUser(data.email, data.password)
      .then((result) => console.log(result.user))
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="card bg-base-100 w-full max-w-md shadow-2xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Create an Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset space-y-3">
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500">Email is required</p>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-500">Password is required</p>
                )}
              </div>

              <div className="text-right">
                <a className="link link-hover text-sm">Forgot password?</a>
              </div>

              <button className="btn btn-neutral w-full mt-4">Register</button>
            </fieldset>
            <p>
              Already have an account?{" "}
              <Link className="link link-hover" to="/login">
                Login
              </Link>
            </p>
          </form>
          <div className="divider">OR</div>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
