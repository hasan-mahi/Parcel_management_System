import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";
import useAuth from "../../../hooks/authHook/useAuth";

const Login = () => {
  const { loginUser } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    loginUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        if (result.user) {
          navigate(state || "/");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <div className="flex justify-center items-center w-full">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
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

                <button className="btn btn-neutral w-full mt-4">Login</button>
              </fieldset>
              <p>
                Create an Account?{" "}
                <Link className="link link-hover" to="/register">
                  Register
                </Link>
              </p>
            </form>
            <div className="divider">OR</div>
            <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
