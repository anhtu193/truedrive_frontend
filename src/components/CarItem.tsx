import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Car } from "@/types/Car";
import { Bookmark, Calendar, Car as CarIcon, Fuel } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function CarItem({ car }: { car: Car }) {
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		setSaved(saved);
	}, [saved]);

	const handleSave = (saved: boolean) => {
		// if (!saved) bookmarkMutation.mutate(liteId);
		// else unBookmarkMutation.mutate(liteId);
	};

	return (
		<Card className="rounded-lg shadow-md max-w-[290px]">
			{/* Image and Bookmark */}
			<div className="relative">
				<img
					src={car.image}
					alt={car.model}
					className="w-full h-48 object-cover rounded-t-lg"
				/>
				<button
					onClick={() => {
						setSaved(!saved);
						handleSave(saved);
					}}
					className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
				>
					<Bookmark
						className={`${cn(
							"h-4 w-fit cursor-pointer stroke-black transition-colors duration-300",
							{
								"fill-[#E1C03F] stroke-[#E1C03F] ": saved,
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
			<CardContent className="flex justify-between items-center text-sm text-gray-600 px-10 mt-3 -mb-3">
				<div className="flex flex-col items-center mt-1 ">
					<img
						src="images/img_car.svg"
						alt="Feature Icon"
						className="h-[18px] mb-1"
					/>
					<p className="font-medium">Sedan</p>
				</div>
				<div className="flex flex-col items-center">
					<img
						src="images/img_fuel.svg"
						alt="Feature Icon"
						className="h-[18px] mb-2"
					/>
					<p className="font-medium">{car.fuel}</p>
				</div>
				<div className="flex flex-col items-center">
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
					${car.price.toLocaleString()}
				</p>
				<Button
					variant="link"
					className="text-blue-500"
				>
					View Details →
				</Button>
			</CardFooter>
		</Card>
	);
}
