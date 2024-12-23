import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { LogOut, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function AdminHeader() {
	const user = useUser();

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				"https://localhost:7174/api/auth/logout",
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			if (response.status === 200) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				window.location.href = "/login";
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("An error occurred during logout:", error);
		}
	};
	return (
		<header className="z-50 top-0 left-0 right-0 px-[60px] py-[20px] h-fit">
			<div className="justify-between w-full flex flex-row items-center">
				<Link to="/">
					<img
						src="/images/logo_black.png"
						className="h-[20px] w-fit "
					/>
				</Link>
				<img
					src="/images/dashboard.png"
					className="h-[20px] w-fit "
				/>
				<div className="flex flex-row items-center">
					<User size={20} />
					<span className="ml-2 mr-6">{user.user?.fullName}</span>
					<Button
						className="rounded-3xl bg-white border-2 px-6 py-4 cursor-pointer"
						variant="secondary"
						onClick={() => {
							handleLogout();
						}}
					>
						<LogOut /> Sign out
					</Button>
				</div>
			</div>
		</header>
	);
}
