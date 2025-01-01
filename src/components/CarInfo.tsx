import AppointmentForm from "@/components/AppointmentForm";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/popoverDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Car } from "@/types/Car";
import { Showroom } from "@/types/Showroom";
import axios from "axios";
import { format } from "date-fns";
import {
	BookCopy,
	Bookmark,
	CalendarIcon,
	CircleUserRound,
	Share,
	Tag,
	UserRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CarInfo({ car }: { car: Car | undefined }) {
	const [saved, setSaved] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [catalog, setCatalog] = useState("");
	const [make, setMake] = useState("");
	const [isConsultDialogOpen, setIsConsultDialogOpen] = useState(false);
	const [isTestDriveDialogOpen, setIsTestDriveDialogOpen] = useState(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const navigate = useNavigate();
	const user = useUser();

	async function fetchCarCatalog() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Catalog/${car?.catalogId}`
			);
			setCatalog(data.catalogName);
			console.log(data);
		} catch (error) {
			console.error("Error fetching catalog:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchCarMake() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Make/${car?.makeId}`
			);
			setMake(data.makeName);
			console.log(data);
		} catch (error) {
			console.error("Error fetching make:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function checkIfCarIsInWishlist() {
		try {
			const response = await axios.get(
				`https://localhost:7174/api/Wishlist/exists?userId=${user.user?.userId}&carId=${car?.carId}`
			);
			setSaved(response.data);
		} catch (error) {
			console.error("Error checking wishlist status:", error);
		}
	}

	useEffect(() => {
		fetchCarCatalog();
		fetchCarMake();
		checkIfCarIsInWishlist();
	}, []);

	const addToWishlist = async () => {
		try {
			await axios.post(
				`https://localhost:7174/api/Wishlist/add?userId=${user.user?.userId}&carId=${car?.carId}`
			);
			setSaved(true);
			toast({
				title: "Added to your wishlist!",
				description: `${car?.model} has been added to your wishlist.`,
			});
		} catch (error) {
			console.error("Error adding to wishlist:", error);
		}
	};

	const removeFromWishlist = async () => {
		try {
			await axios.delete(
				`https://localhost:7174/api/Wishlist/remove?userId=${user.user?.userId}&carId=${car?.carId}`
			);
			setSaved(false);
			toast({
				title: "Model successfully removed from your wishlist",
				description: `${car?.model} has been removed from your wishlist.`,
			});
		} catch (error) {
			console.error("Error removing from wishlist:", error);
		}
	};

	const handleSave = (saved: boolean) => {
		if (user.user?.role !== "Customer") {
			toast({ title: "You need to sign in to perform this action." });
		} else {
			if (!saved) {
				setSaved(!saved);
				addToWishlist();
			} else {
				setIsRemoveDialogOpen(true);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
				<h1 className="text-[30px] font-bold">{car?.model}</h1>
				<span>{make}</span>
				<div className="flex flex-row justify-between mt-5">
					<div className="flex flex-col w-[750px]">
						<img
							src={car?.image}
							alt={car?.model}
							className="object-cover w-full h-full rounded-2xl"
						/>
						<h2 className="text-[20px] mt-7 font-medium">
							Car Overview
						</h2>
						<div className="flex flex-row mt-5 text-[14px]">
							<div className="flex flex-col gap-7">
								<span>
									<img
										src="/images/img_car.svg"
										alt="body"
										className="inline mr-3 mb-1"
									/>
									Body
								</span>
								<span>
									<img
										src="/images/img_fuel.svg"
										alt="fuel"
										className="inline mr-3 mb-1"
									/>
									Fuel Type
								</span>
								<span>
									<img
										src="/images/img_calendar.svg"
										alt="year"
										className="inline mr-3 mb-1"
									/>
									Year
								</span>
								<span>
									<img
										src="/images/img_transmission.svg"
										alt="transmission"
										className="inline mr-3 mb-1"
									/>
									Transmission
								</span>
								<span>
									<img
										src="/images/img_drivetype.svg"
										alt="drivetype"
										className="inline mr-3 mb-1"
									/>
									Drive Type
								</span>
							</div>
							<div className="flex flex-col gap-7 font-medium ms-20">
								<span className="h-[22.68px]">{catalog}</span>
								<span className="h-[22.68px]">{car?.fuel}</span>
								<span className="h-[22.68px]">{car?.year}</span>
								<span className="h-[22.68px]">
									{car?.transmission}
								</span>
								<span className="h-[22.68px]">
									{car?.driveType}
								</span>
							</div>
							<div className="flex flex-col gap-7 ms-24">
								<span>
									<img
										src="/images/img_capacity.svg"
										alt="capacity"
										className="inline mr-3 mb-1"
									/>
									Capacity
								</span>
								<span>
									<img
										src="/images/img_engine_size.svg"
										alt="enginesize"
										className="inline mr-3 mb-1"
									/>
									Engine Size
								</span>
								<span>
									<img
										src="/images/img_door.svg"
										alt="door"
										className="inline mr-3 mb-1"
									/>
									Door
								</span>
								<span>
									<img
										src="/images/img_color.svg"
										alt="color"
										className="inline mr-3 mb-1"
									/>
									Color
								</span>
								<span>
									<img
										src="/images/img_vin.svg"
										alt="vin"
										className="inline mr-3 mb-1"
									/>
									VIN
								</span>
							</div>
							<div className="flex flex-col gap-7 font-medium ms-20">
								<span className="h-[22.68px]">
									{car?.capacity}
								</span>
								<span className="h-[22.68px]">
									{car?.engineSize.toPrecision(2)}
								</span>
								<span className="h-[22.68px]">
									{car?.numberOfDoors}
								</span>
								<span className="h-[22.68px]">
									{car?.color}
								</span>
								<span className="h-[22.68px]">
									{car?.vinNumber}
								</span>
							</div>
						</div>
						<h2 className="text-[20px] mt-10 font-medium">
							Description
						</h2>
						<p className="mt-3  whitespace-pre-line">
							{car?.description}
						</p>
					</div>
					<div className="flex flex-col items-center w-[500px] h-fit">
						<Card className="w-[390px]">
							<CardContent className="mt-5">
								<span className="text-[#050B20]">
									Our price
								</span>
								<p className="text-[#050B20] mt-2 font-bold text-[30px]">
									${car?.price.toLocaleString("en-US")}
								</p>

								{car?.status === "Available" ? (
									<>
										<Button
											onClick={() => {
												if (
													user.user?.role !=
													"Customer"
												) {
													toast({
														title: "You need to sign in to perform this action.",
													});
												} else {
													setIsConsultDialogOpen(
														true
													);
												}
											}}
											className="w-full bg-[#405FF2] hover:bg-[#6880f8] text-[15px] mt-3 rounded-2xl py-7 font-medium"
										>
											<Tag /> Schedule a Consulting
											Session
										</Button>
										<Button
											onClick={() => {
												if (
													user.user?.role !=
													"Customer"
												) {
													toast({
														title: "You need to sign in to perform this action.",
													});
												} else {
													setIsTestDriveDialogOpen(
														true
													);
												}
											}}
											variant="outline"
											className="w-full border-gray-600 text-[15px] mt-3 rounded-2xl py-7 font-medium"
										>
											<img
												src="/images/img_drivetype.svg"
												alt="drivetype"
												className="inline mb-1"
											/>{" "}
											Schedule a Test Drive
										</Button>
									</>
								) : (
									<>
										{" "}
										<Button
											disabled
											onClick={() => {
												if (
													user.user?.role !=
													"Customer"
												) {
													toast({
														title: "You need to sign in to perform this action.",
													});
												} else {
													setIsConsultDialogOpen(
														true
													);
												}
											}}
											className="w-full bg-[#405FF2] hover:bg-[#6880f8] text-[15px] mt-3 rounded-2xl py-7 font-medium"
										>
											<Tag /> Schedule a Consulting
											Session
										</Button>
										<Button
											disabled
											onClick={() => {
												if (
													user.user?.role !=
													"Customer"
												) {
													toast({
														title: "You need to sign in to perform this action.",
													});
												} else {
													setIsTestDriveDialogOpen(
														true
													);
												}
											}}
											variant="outline"
											className="w-full border-gray-600 text-[15px] mt-3 rounded-2xl py-7 font-medium"
										>
											<img
												src="/images/img_drivetype.svg"
												alt="drivetype"
												className="inline mb-1"
											/>{" "}
											Schedule a Test Drive
										</Button>
										<p className="font-medium self-center mt-4 ms-6">
											This car is not available at the
											moment!
										</p>
									</>
								)}
							</CardContent>
						</Card>
						<div className="flex flex-row gap-4 mt-4">
							<div>
								<span className="font-medium">Share</span>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full ms-3"
								>
									<Share />
								</Button>
							</div>
							<div>
								<span className="font-medium">Save</span>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full ms-3"
									onClick={() => {
										handleSave(saved);
									}}
								>
									<Bookmark
										className={`${cn(
											"h-4 w-fit cursor-pointer stroke-black transition-colors duration-300",
											{
												"fill-[#E1C03F] stroke-[#E1C03F] ":
													saved,
												"fill-white ": !saved,
											}
										)}`}
									/>
								</Button>
							</div>
							<div>
								<span className="font-medium">Compare</span>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full ms-3"
									onClick={() => {
										navigate("/compare", {
											state: {
												searchQueryFirst: car?.model,
											},
										});
									}}
								>
									<BookCopy />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<AppointmentForm
				isDialogOpen={isConsultDialogOpen}
				setIsDialogOpen={setIsConsultDialogOpen}
				purpose="Consulting Session"
				carId={car?.carId}
			/>
			<AppointmentForm
				isDialogOpen={isTestDriveDialogOpen}
				setIsDialogOpen={setIsTestDriveDialogOpen}
				purpose="Test Drive"
				carId={car?.carId}
			/>
			<Dialog
				open={isRemoveDialogOpen}
				onOpenChange={setIsRemoveDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove from Wishlist</DialogTitle>
					</DialogHeader>
					<p>
						Are you sure you want to remove this car from your
						wishlist?
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsRemoveDialogOpen(false)}
						>
							No
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								removeFromWishlist();
								setIsRemoveDialogOpen(false);
							}}
						>
							Yes, Remove
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
