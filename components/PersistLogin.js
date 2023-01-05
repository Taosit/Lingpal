import { useEffect, useState } from "react";
import { useAuthContext } from "../utils/contexts/AuthContext";

const PersistLogin = ({children}) => {
	const [loading, setLoading] = useState(true);
	const { setUser, accessToken, setAccessToken } = useAuthContext();

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

	if (loading) {
		return <div>Loading</div>
	}
	return <>{children}</>;
};

export default PersistLogin;