import React from "react";

const WhiteboardTemplate = ({ children }) => {
	return (
		<div className="bg-transparent-20 w-full h-9/10 sm:h-5/6 mx-4 sm:mx-12 rounded-2xl px-4 py-4 sm:py-8 sm:px-4 md:px-16 max-w-5xl max-h-700 relative z-10">
			{children}
		</div>
	);
};

export default WhiteboardTemplate;
