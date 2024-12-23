import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

export default function PolicyAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	return (
		<>
			<Helmet>
				<title>Policy</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="flex flex-col">
				<AdminHeader />
				<div className="flex flex-row h-fit bg-[#DEDEDE]">
					<AdminNavigation height={height} />
					<div
						ref={contentRef}
						className="w-full bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-[700px]"
					>
						<h1 className="text-[30px] font-bold">Policy</h1>
					</div>
				</div>
			</div>
		</>
	);
}
