import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import React from "react";

export default function CarAdmin() {
	return (
		<>
			<div className="flex flex-col">
				<AdminHeader />
				<div className="flex flex-row h-[1000px] bg-[#DEDEDE]">
					<AdminNavigation />
				</div>
			</div>
		</>
	);
}
