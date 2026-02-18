import axios from "axios";
import React from "react";
import useAuth from "../authHook/useAuth";
import { Navigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  //   timeout: 1000,
  //   headers: { "X-Custom-Header": "foobar" },
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosSecure.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if(error.status ===403){
        <Navigate to='/forbidden'></Navigate>
      }
      return Promise.reject(error);
    },
  );
  return axiosSecure;
};

export default useAxiosSecure;
