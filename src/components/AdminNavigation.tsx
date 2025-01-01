import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface AdminNavigationProps {
	height: string;
}

const AdminNavigation = ({ height }: AdminNavigationProps) => {
	const navItems = [
		{
			name: "Car",
			path: "/",
			iconActive: "/images/car.svg",
			icon: "/images/car_unactive.svg",
		},
		// {
		// 	name: "Statistic",
		// 	path: "/statistic",
		// 	iconActive: "/images/statistic.svg",
		// 	icon: "/images/statistic_unactive.svg",
		// },
		{
			name: "Transaction",
			path: "/transaction",
			iconActive: "/images/transaction.svg",
			icon: "/images/transaction_unactive.svg",
		},
		{
			name: "Appointment",
			path: "/appointment",
			iconActive: "/images/appointment.svg",
			icon: "/images/appointment_unactive.svg",
		},
		{
			name: "Policy",
			path: "/policy",
			iconActive: "/images/policy.svg",
			icon: "/images/policy_unactive.svg",
		},
	];

	const [hoveredItem, setHoveredItem] = useState<string | null>(null);

	return (
		<div
			className={`mt-1 flex flex-col w-[300px] bg-white`}
			style={{ height }}
		>
			<h2 className="ms-5 my-4 font-semibold tracking-widest text-[12px] text-black">
				MAIN MENU
			</h2>

			{navItems.map((item) => (
				<NavLink
					key={item.name}
					to={item.path}
					className={({ isActive }) =>
						`p-4 text-[16px] flex flex-row gap-3 font-medium rounded-2xl mx-4 my-1 ${
							isActive
								? "bg-[#3563E9] text-white"
								: "bg-white text-[#90A3BF] hover:bg-[#3563E9] hover:text-white"
						}`
					}
					onMouseEnter={() => setHoveredItem(item.name)}
					onMouseLeave={() => setHoveredItem(null)}
				>
					{({ isActive }) => (
						<>
							<img
								src={
									isActive || hoveredItem === item.name
										? item.iconActive
										: item.icon
								}
								alt={item.name}
								sizes="20"
							/>
							{item.name}
						</>
					)}
				</NavLink>
			))}
		</div>
	);
};

export default AdminNavigation;
