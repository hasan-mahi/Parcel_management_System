import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import PrivateRouter from "./PrivateRouter";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/authentication/login/Login";
import Register from "../pages/authentication/register/Register";
import Coverage from "../pages/coverage/Coverage";
import SendParcel from "../pages/sendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcel from "../pages/dashboard/myParcels/MyParcel";
import Payment from "../pages/dashboard/payment/Payment";
import PaymentHistory from "../pages/dashboard/paymentHistory/PaymentHistory";
import TrackParcel from "../pages/dashboard/trackParcel/TrackParcel";
import BeARider from "../pages/dashboard/beARider/BeARider";
import PendingRiders from "../pages/dashboard/pendingRiders/PendingRiders";
import ActiveRiders from "../pages/dashboard/activeRiders/ActiveRiders";
import MakeAdmin from "../pages/dashboard/makeAdmin/MakeAdmin";
import Forbidden from "../pages/forbidden/Forbidden";
import AdminRoute from "./AdminRoute";
import AssignRider from "../pages/dashboard/assignRider/AssignRider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
      },
      {
        path: "forbidden",
        Component: Forbidden,
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRouter>
            <SendParcel></SendParcel>
          </PrivateRouter>
        ),
      },
      {
        path: "beARider",
        element: (
          <PrivateRouter>
            <BeARider></BeARider>
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout></DashboardLayout>
      </PrivateRouter>
    ),
    children: [
      {
        path: "myParcels",
        Component: MyParcel,
      },
      {
        path: "payment/:id",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
