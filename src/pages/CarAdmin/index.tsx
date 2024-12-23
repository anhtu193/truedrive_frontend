import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Car } from "@/types/Car";
import axios from "axios";
import {
	BookA,
	CalendarDays,
	CircleCheckBig,
	DollarSign,
	Edit,
	Search,
	SquareArrowOutUpRight,
	Star,
	Trash,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function CarAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const [cars, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [makes, setMakes] = useState<{ [key: number]: string }>({});
	const contentRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	useEffect(() => {
		async function fetchCars() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Car`
				);
				setCars(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching cars:", error);
			} finally {
				setIsLoading(false);
			}
		}

		async function fetchMakes() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Make`
				);
				const makeMap: { [key: number]: string } = {};
				data.forEach((make: { makeId: number; makeName: string }) => {
					makeMap[make.makeId] = make.makeName;
				});
				setMakes(makeMap);
			} catch (error) {
				console.error("Error fetching makes:", error);
			}
		}

		fetchCars();
		fetchMakes();
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
				<title>Cars</title>
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
						className="w-full bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-[700px]"
					>
						<h1 className="text-[30px] font-bold">Cars</h1>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<BookA size={15} /> Model
										</div>
									</TableHead>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<Star size={15} /> Make
										</div>
									</TableHead>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<CalendarDays size={15} /> Year
										</div>
									</TableHead>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<DollarSign size={15} /> Price
										</div>
									</TableHead>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<CircleCheckBig size={15} /> Status
										</div>
									</TableHead>
									<TableHead>
										<div className="flex flex-row gap-2 text-[15px] items-center">
											<SquareArrowOutUpRight size={15} />{" "}
											Action
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cars.map((car) => (
									<TableRow key={car.carId}>
										<TableCell>{car.model}</TableCell>
										<TableCell>
											{makes[car.makeId] || "Unknown"}
										</TableCell>
										<TableCell>{car.year}</TableCell>
										<TableCell>
											${car.price.toLocaleString("en-US")}
										</TableCell>
										<TableCell
											className={`${cn({
												"text-[#FF0000] font-medium":
													car.status === "Sold",
												"text-[#00ff00] font-medium":
													car.status === "Available",
												"text-[#808080] font-medium":
													car.status ===
													"Not Available",
												"text-[#FFA500] font-medium":
													car.status ===
													"Under Inspection",
											})}`}
										>
											{car.status}
										</TableCell>
										<TableCell>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													navigate(
														`/car/${car.carId}`
													)
												}
											>
												<Search />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													navigate(
														`/car/edit/${car.carId}`
													)
												}
											>
												<Edit />
											</Button>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													console.log(
														"Delete car",
														car.carId
													)
												}
											>
												<Trash />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</>
	);
}
