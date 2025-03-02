import CarItem from "@/components/CarItem";
import { Car } from "@/types/Car";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ExploreVehiclesSection() {
	const [car, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCars() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Car",
					{
						params: { limit: 4 },
					}
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
			<div className="flex flex-row justify-between w-full h-fit">
				<h2 className="text-[28px] font-bold text-black-900">
					Explore All Vehicles
				</h2>
				<Link
					to="/listing"
					className="flex flex-row gap-2 mt-3  cursor-pointer"
				>
					<span className="text-[15px] font-medium text-black-900">
						View all
					</span>
					<img
						src="/images/img_arrow_left.svg"
						alt="Left Arrow Image"
						className="h-[14px]"
					/>
				</Link>
			</div>
			<div className="flex gap-9 flex-row h-fit py-12">
				{car.slice(0, 4).map((carItem, index) => (
					<CarItem
						key={index}
						car={carItem}
					/>
				))}
			</div>
		</div>
	);
}
