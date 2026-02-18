import { useQuery } from "@tanstack/react-query";
import useAuth from "../authHook/useAuth";
import useAxiosSecure from "../axios/useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email, // wait for auth
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/role?email=${user.email}`
      );
      return res.data;
    },
  });

  return {
    role: roleData?.role || "user",
    isAdmin: roleData?.role === "admin",
    isLoading,
    refetch,
  };
};

export default useUserRole;
