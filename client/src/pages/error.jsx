import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { LuFileText, LuSearchX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Error = ({ error }) => {
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Error";
	}, []);

	return (
		<div className="w-full h-[calc(100vh-61px)] flex items-center justify-center flex-col">
			<div className="relative">
				<LuFileText className="inline-block [transform:rotateZ(-13deg)rotateY(180deg)translateY(13px)] text-red-500 font-bold text-9xl" />
				<span className="bg-white p-1 rounded-full w-fit h-fit absolute bottom-0 right-0">
					<LuSearchX className="inline-block text-3xl text-red-500" />
				</span>
			</div>
			<span className="text-9xl font-bold mt-10 text-red-500">
				{error.split(" ")[0]}
			</span>
			<span className="text-2xl font-bold text-zinc-500/80">
				{error.split(" ").slice(1).join(" ")}
			</span>
			<Button
				className="mt-10 bg-blue-500 hover:bg-blue-500/90"
				onClick={() => navigate("/")}
			>
				Go to Home
			</Button>
		</div>
	);
};

export default Error;
