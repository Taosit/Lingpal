import React, { useEffect } from "react";
import {useRouter} from "next/router"
import { useAuthContext } from "../utils/contexts/AuthContext";

const PrivateRoute = ({children}) => {
	const { user } = useAuthContext();

  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user])

  if (!user) return null;

	return <>{children}</>;
};

export default PrivateRoute;