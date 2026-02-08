import React from "react";
import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import ProFastLogo from "./shared/logo/ProFastLogo";

const AuthLayout = () => {
  
  return (
    <div>
      <div className="bg-base-200 p-5 min-h-screen">
        <ProFastLogo></ProFastLogo>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex-1">
            <img src={authImg} className="max-w-sm rounded-lg shadow-2xl" />
          </div>

          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
