import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Car } from "@/types/Car";
import axios from "axios";
import { Bookmark, Calendar, Car as CarIcon, Fuel } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CarItem({
	car,
	onRemove,
}: {
	car: Car;
	onRemove?: (carId: number) => void;
}) {
	const [saved, setSaved] = useState(false);
	const [catalog, setCatalog] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const user = useUser();

	useEffect(() => {
		async function fetchCarCatalog() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Catalog/${car.catalogId}`
				);
				setCatalog(data.catalogName); // Assuming 'name' is a property of the catalog object
				console.log(data);
			} catch (error) {
				console.error("Error fetching catalog:", error);
			} finally {
				setIsLoading(false);
			}
		}

		async function checkIfCarIsInWishlist() {
			try {
				const response = await axios.get(
					`https://localhost:7174/api/Wishlist/exists?userId=${user.user?.userId}&carId=${car.carId}`
				);
				setSaved(response.data);
			} catch (error) {
				console.error("Error checking wishlist status:", error);
			}
		}

		fetchCarCatalog();
		checkIfCarIsInWishlist();
	}, [car.catalogId, car.carId, user.user?.userId]);

	const addToWishlist = async () => {
		try {
			await axios.post(
				`https://localhost:7174/api/Wishlist/add?userId=${user.user?.userId}&carId=${car.carId}`
			);
			setSaved(true);
			toast({
				title: "Added to your wishlist!",
				description: `${car.model} has been added to your wishlist.`,
			});
		} catch (error) {
			console.error("Error adding to wishlist:", error);
		}
	};

	const removeFromWishlist = async () => {
		try {
			await axios.delete(
				`https://localhost:7174/api/Wishlist/remove?userId=${user.user?.userId}&carId=${car.carId}`
			);
			setSaved(false);
			toast({
				title: "Model successfully removed from your wishlist",
				description: `${car.model} has been removed from your wishlist.`,
			});
			if (onRemove) {
				onRemove(car.carId);
			}
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
			<Link to={`/car/${car.carId}`}>
				<Card className="rounded-lg shadow-md max-w-[290px]">
					{/* Image and Bookmark */}
					<div className="relative">
						<img
							src={car.image}
							alt={car.model}
							className="w-full h-48 object-cover rounded-t-lg"
						/>
						<button
							onClick={(e) => {
								e.preventDefault();

								handleSave(saved);
							}}
							className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
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
						</button>
					</div>

					{/* Card Header */}
					<CardHeader className="-my-3">
						<CardTitle className="text-lg font-semibold">
							{car.model}
						</CardTitle>
						<p className="text-sm text-gray-500 text-ellipsis line-clamp-1">
							{car.description}
						</p>
					</CardHeader>
					<Separator />
					{/* Card Content */}
					<CardContent className="flex justify-between items-center text-sm text-gray-600 mt-3 -mb-3">
						<div className="flex flex-col items-center mt-1 w-[77px] ">
							<img
								src="images/img_car.svg"
								alt="Feature Icon"
								className="h-[18px] mb-1"
							/>
							<p className="font-medium">{catalog}</p>
						</div>
						<div className="flex flex-col items-center w-[77px] ">
							<img
								src="images/img_fuel.svg"
								alt="Feature Icon"
								className="h-[18px] mb-2"
							/>
							<p className="font-medium">{car.fuel}</p>
						</div>
						<div className="flex flex-col items-center w-[77px] ">
							<img
								src="images/img_calendar.svg"
								alt="Feature Icon"
								className="h-[18px] mb-2"
							/>
							<p className="font-medium">{car.year}</p>
						</div>
					</CardContent>
					<Separator />
					{/* Card Footer */}
					<CardFooter className="flex justify-between items-center mt-3 -mb-3 pr-3">
						<p className="text-xl font-bold">
							${car.price.toLocaleString("en-US")}
						</p>
						<Button
							variant="link"
							className="text-blue-500"
						>
							View Details →
						</Button>
					</CardFooter>
				</Card>
			</Link>

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
