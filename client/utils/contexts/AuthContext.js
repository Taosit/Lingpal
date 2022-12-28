import React, { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

const useAuthContext = () => {
	return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [accessToken, setAccessToken] = useState("");


	return (
		<AuthContext.Provider
			value={{ user, setUser, accessToken, setAccessToken}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { useAuthContext, AuthContextProvider };
