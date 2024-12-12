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
import { ChevronDown, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-pink-700">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<header className="fixed z-50 top-0 left-0 right-0 px-[60px] py-[20px] bg-transparent h-[60px] ">
			<div className="justify-start w-full flex flex-row items-center ">
				<Link to="/">
					<img
						src="/images/logo.png"
						className="h-[20px] w-fit "
					/>
				</Link>
				<div className="flex ms-[720px] flex-row gap-6">
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
					<Button
						className="rounded-3xl px-8 py-4 cursor-pointer"
						variant="secondary"
						onClick={() => {
							naviagte("/login");
						}}
					>
						<User /> Login
					</Button>
				</div>
			</div>
		</header>
	);
}