import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import React, { useEffect, useRef, useState } from "react";

export default function TransactionAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	return (
		<>
			<div className="flex flex-col">
				<AdminHeader />
				<div className="flex flex-row h-fit bg-[#DEDEDE]">
					<AdminNavigation height={height} />
					<div
						ref={contentRef}
						className="w-full bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-[700px]"
					>
						<h1 className="text-[30px] font-bold">Transaction</h1>
					</div>
				</div>
			</div>
		</>
	);
}
