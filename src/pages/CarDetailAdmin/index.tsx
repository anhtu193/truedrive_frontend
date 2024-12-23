import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Car } from "@/types/Car";
import axios from "axios";
import { SquarePen } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

export default function CarDetailAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [catalog, setCatalog] = useState("");
	const [make, setMake] = useState("");
	const [car, setCar] = useState<Car>();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const { id } = useParams();
	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	async function fetchCar() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${id}`
			);

			setCar(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			fetchCarCatalog();
			fetchCarMake();
			setIsLoading(false);
		}
	}

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

	useEffect(() => {
		fetchCar();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>{car?.model}</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="flex flex-col">
				<AdminHeader />
				<div className="flex flex-row h-fit bg-[#DEDEDE]">
					<AdminNavigation height={height} />
					<div
						ref={contentRef}
						className="w-full flex flex-col bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-fit"
					>
						<div className="flex flex-row justify-between">
							<div className="flex flex-col">
								<h1 className="text-[30px] font-bold">
									{car?.model}
								</h1>
								<span>{make}</span>
							</div>
							<Button
								className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-8 py-6 rounded-2xl"
								onClick={() =>
									navigate(`/car/edit/${car?.carId}`)
								}
							>
								Edit <SquarePen />{" "}
							</Button>
						</div>
						<div className="flex flex-row gap-20">
							<div className="flex flex-col">
								<img
									src={car?.image}
									alt={car?.model}
									className="object-cover w-[650px] h-fit rounded-2xl mt-3"
								/>
								<div className="flex flex-row mt-6 justify-between">
									<span className="text-[20px]">
										Price:{" "}
										<strong className="text-[24px]">
											$
											{car?.price.toLocaleString("en-US")}
										</strong>
									</span>
									<span className="text-[20px]">
										Status:{" "}
										<strong
											className={`${cn({
												"text-[#FF0000] text-[24px]":
													car?.status === "Sold",
												"text-[#00ff00] text-[24px]":
													car?.status === "Available",
												"text-[#808080] text-[24px]":
													car?.status ===
													"Not Available",
												"text-[#FFA500] text-[24px]":
													car?.status ===
													"Under Inspection",
											})}`}
										>
											{car?.status}
										</strong>
									</span>
								</div>
							</div>
							<div className="flex flex-col">
								<h2 className="text-[20px] mt-0 font-medium">
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
											{catalog}
										</span>
										<span className="h-[22.68px]">
											{car?.fuel}
										</span>
										<span className="h-[22.68px]">
											{car?.year}
										</span>
										<span className="h-[22.68px]">
											{car?.transmission}
										</span>
										<span className="h-[22.68px]">
											{car?.driveType}
										</span>
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
							</div>
						</div>
						<div className="flex flex-col -mt-6">
							<h2 className="text-[20px] mt-10 font-bold">
								Description
							</h2>
							<p className="mt-3  whitespace-pre-line">
								{car?.description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
