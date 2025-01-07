import React from "react";
import { LuLoader2 } from "react-icons/lu";

const Loader = () => {
	return (
		<div className="w-full h-[calc(100vh-61px)] flex items-center justify-center">
			<LuLoader2 className="animate-spin w-10 h-10 text-blue-500" />
		</div>
	);
};

export default Loader;
