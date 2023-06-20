import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "../stores/AuthStore";

const PrivateRoute = ({ children }: PropsWithChildren) => {
  const { loading, setLoading, user, setUser, accessToken, setAccessToken } =
    useAuthStore();

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/refresh_token", {
          credentials: "include",
        });
        const data = await res.json();
        const { user, accessToken } = data;
        setUser(user);
        setAccessToken(accessToken);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    if (accessToken) {
      setLoading(false);
    } else {
      verifyToken();
    }
  }, [accessToken, setAccessToken, setLoading, setUser]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, router, user]);

  return <>{children}</>;
};

export default PrivateRoute;
