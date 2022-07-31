import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PersistLogin = () => {
	const [loading, setLoading] = useState(true);
	const { setUser, accessToken, setAccessToken } = useAuthContext();

	useEffect(() => {
		const verifyToken = async () => {
			console.log("in verify token");
			try {
				const res = await fetch("http://localhost:5000/refresh-token", {
					credentials: "include",
				});
				const data = await res.json();
				console.log("setting access token");
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
	return <>{loading ? <div>Loading</div> : <Outlet />}</>;
};

export default PersistLogin;
