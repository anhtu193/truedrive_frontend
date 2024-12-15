import CarItem from "@/components/CarItem";
import { Car } from "@/types/Car";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ExploreVehiclesSection() {
	const [car, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCars() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Car"
				);
				setCars(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching cars:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchCars();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col w-full h-fit mt-[30px] px-[130px]">
			<div className="flex flex-row justify-between w-full h-fit cursor-pointer">
				<h2 className="text-[28px] font-bold text-black-900">
					Explore All Vehicles
				</h2>
				<div className="flex flex-row gap-2 mt-3">
					<span className="text-[15px] font-medium text-black-900">
						View all
					</span>
					<img
						src="images/img_arrow_left.svg"
						alt="Left Arrow Image"
						className="h-[14px]"
					/>
				</div>
			</div>
			<div className="flex flex-row h-fit py-12">
				<CarItem car={car[4]} />
			</div>
		</div>
	);
}
