import { Button } from "@/components/ui/button";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { useUser } from "@/context/UserContext";
import { Catalog } from "@/types/Catalog";
import axios from "axios";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [scrolled, setScrolled] = useState(false);
	const user = useUser();
	const naviagte = useNavigate();

	useEffect(() => {
		async function fetchCatalogs() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Catalog"
				);
				setCatalogs(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching catalogs:", error);
			} finally {
				setIsLoading(false); // Set loading to false after fetching data
			}
		}
		fetchCatalogs();
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 700) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	const handleLogout = () => {
		console.log(localStorage.getItem("token"));
		// Remove the JWT token from local storage or cookies
		localStorage.removeItem("token");
		window.location.href = "/login";
	};

	return (
		<header
			className={`fixed transition-colors duration-300 z-50 top-0 left-0 right-0 px-[60px] py-[20px] h-fit ${
				scrolled ? "bg-[#050B20]" : "bg-transparent"
			}`}
		>
			<div className="justify-between w-full flex flex-row items-center">
				<Link to="/">
					<img
						src="/images/logo.png"
						className="h-[20px] w-fit "
					/>
				</Link>
				<div className="flex flex-row gap-6">
					<Menubar className="gap-3 bg-transparent border-0 text-white shadow-none">
						<MenubarMenu>
							<MenubarTrigger className="rounded-xl px-3 py-2 cursor-pointer">
								Home
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger className="rounded-xl px-3 py-2 cursor-pointer">
								Listing <ChevronDown className="h-4 w-4 ms-1" />{" "}
							</MenubarTrigger>
							<MenubarContent
								align="end"
								className="-mt-1"
							>
								{catalogs.map((catalog) => (
									<MenubarItem
										className="flex flex-row items-center"
										key={catalog.catalogId}
									>
										<img
											src={catalog.illustration}
											alt={catalog.catalogName}
											className="mr-3 h-[20px] w-[20px] "
										/>{" "}
										<span className="text-[15px] font-medium capitalize text-white-a700">
											{catalog.catalogName}
										</span>
									</MenubarItem>
								))}
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger className="rounded-xl px-3 py-2 cursor-pointer">
								Blog
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger className="rounded-xl px-3 py-2 cursor-pointer">
								About
							</MenubarTrigger>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger className="rounded-xl px-3 py-2 cursor-pointer">
								Contact
							</MenubarTrigger>
						</MenubarMenu>
						{user.user?.role == "Customer" && (
							<>
								<MenubarMenu>
									<MenubarTrigger>Wishlist</MenubarTrigger>
								</MenubarMenu>
								<MenubarMenu>
									<MenubarTrigger>Appointment</MenubarTrigger>
								</MenubarMenu>
							</>
						)}
					</Menubar>
					{user.user?.role == "Customer" ||
					user.user?.role == "Admin" ? (
						<Button
							className="rounded-3xl px-8 py-4 cursor-pointer"
							variant="secondary"
							onClick={() => {
								handleLogout();
							}}
						>
							<LogOut /> Sign out
						</Button>
					) : (
						<Button
							className="rounded-3xl px-8 py-4 cursor-pointer"
							variant="secondary"
							onClick={() => {
								naviagte("/login");
							}}
						>
							<User /> Sign in
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
