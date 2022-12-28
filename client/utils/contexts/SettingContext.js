import React, { useState, createContext, useContext } from "react";

const SettingContext = createContext();

const useSettingContext = () => {
	return useContext(SettingContext);
};

const SettingContextProvider = ({ children }) => {
	const [settings, setSettings] = useState({
		mode: null,
		level: null,
		describer: null,
	});

	const updateSetting = (name, value) => {
		if (name !== "mode" && name !== "level" && name !== "describer") {
			throw new Error(`no such setting exsits: ${name}`);
		}
		setSettings(prev => ({ ...prev, [name]: value }));
	};

	return (
		<SettingContext.Provider value={{ settings, updateSetting }}>
			{children}
		</SettingContext.Provider>
	);
};

export { useSettingContext, SettingContextProvider };
