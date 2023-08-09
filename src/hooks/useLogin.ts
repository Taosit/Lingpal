import { useAuthStore } from "@/stores/AuthStore";
import { fetcher } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

export const useLogIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { accessToken, setAccessToken } = useAuthStore(
    (store) => ({
      accessToken: store.accessToken,
      setAccessToken: store.setAccessToken,
    }),
    shallow
  );

  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/refresh_token", {
          credentials: "include",
        });
        const data = await res.json();
        const { user, accessToken } = data;
        if (!user || !accessToken) return;
        setUser(user);
        setAccessToken(accessToken);
        router.push("/dashboard");
      } catch (e) {
        console.log(e);
      }
    };
    verifyToken();
  }, [accessToken, router, setAccessToken, setLoading, setUser]);

  const logIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "/api/login",
      method: "POST",
      body: { email, password },
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        const { user, accessToken } = res.data;
        setUser(user);
        setAccessToken(accessToken);
        router.push("/dashboard");
        return;
      }
      if (res.status === 400) {
        setError("Please fill in the required fields");
        return;
      }
      if (res.status === 401) {
        setError("Incorrect credientials");
        return;
      }
      if (res.status === 409) {
        setError("This account is already logged in");
        return;
      }
    });
  };

  return {
    email,
    setEmail: (str: string) => {
      setEmail(str);
      setError("");
    },
    password,
    setPassword: (str: string) => {
      setPassword(str);
      setError("");
    },
    error,
    loading,
    logIn,
  };
};
