import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../utils/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loading, setLoading, user, setUser, accessToken, setAccessToken } =
    useAuthContext();

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
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
  }, [loading, user]);

  return <>{children}</>;
};

export default PrivateRoute;
