import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Car } from "@/types/Car";
import { Catalog } from "@/types/Catalog";
import { Make } from "@/types/Make";
import axios from "axios";
import { totalmem } from "os";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

const carStatus = ["Available", "Not Available", "Under Inspection", "Sold"];
const carFuelType = ["Diesel", "Gasoline", "Electric"];
const carTransmisson = ["Manual", "Automatic", "CVT"];
const carDriveType = [
	"Rear-Wheel Drive",
	"Front-Wheel Drive",
	"Four-Wheel Drive",
	"All-Wheel Drive",
];

export default function EditCarAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const navigate = useNavigate();
	const contentRef = useRef<HTMLDivElement>(null);
	const [catalog, setCatalog] = useState("");
	const [make, setMake] = useState("");
	const [car, setCar] = useState<Car>();
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();
	const [makes, setMakes] = useState<Make[]>([]);
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);

	const [selectedModel, setSelectedModel] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [selectedCatalog, setSelectedCatalog] = useState<number>();
	const [selectedMake, setSelectedMake] = useState<number>();
	const [selectedPrice, setSelectedPrice] = useState<number>();
	const [selectedFuelType, setSelectedFuelType] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedTransmission, setSelectedTransmission] =
		useState<string>("");
	const [selectedDriveType, setSelectedDriveType] = useState<string>("");
	const [selectedCapacity, setSelectedCapacity] = useState<number>();
	const [selectedEngineSize, setSelectedEngineSize] = useState<string>("");
	const [selectedNumberOfDoors, setSelectedNumberOfDoors] =
		useState<number>();
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedVinNumber, setSelectedVinNumber] = useState<string>("");
	const [selectedDescription, setSelectedDescription] = useState<string>("");

	async function getCarById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${id}`
			);

			setCar(data);
			console.log(data);

			await fetchCarCatalog(data.catalogId);
			await fetchCarMake(data.makeId);
			setSelectedCatalog(data.catalogId);
			setSelectedMake(data.makeId);
			setSelectedModel(data.model);
			setSelectedPrice(data.price);
			setSelectedStatus(data.status);
			setSelectedFuelType(data.fuel);
			setSelectedYear(data.year);
			setSelectedTransmission(data.transmission);
			setSelectedDriveType(data.driveType);
			setSelectedCapacity(data.capacity);
			setSelectedEngineSize(data.engineSize.toFixed(1));
			setSelectedNumberOfDoors(data.numberOfDoors);
			setSelectedColor(data.color);
			setSelectedVinNumber(data.vinNumber);
			setSelectedDescription(data.description);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchCarCatalog(catalogId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Catalog/${catalogId}`
			);
			setCatalog(data.catalogName);
			console.log(data);
		} catch (error) {
			console.error("Error fetching catalog:", error);
		}
	}

	async function fetchCarMake(makeId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Make/${makeId}`
			);
			setMake(data.makeName);
			console.log(data);
		} catch (error) {
			console.error("Error fetching make:", error);
		}
	}

	async function fetchMakes() {
		try {
			const { data } = await axios.get("https://localhost:7174/api/Make");
			setMakes(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching make:", error);
		} finally {
			setIsLoading(false);
		}
	}

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
			setIsLoading(false);
		}
	}

	async function saveCar() {
		try {
			const carData = {
				carId: car?.carId,
				catalogId: selectedCatalog,
				makeId: selectedMake,
				model: selectedModel,
				color: selectedColor,
				fuel: selectedFuelType,
				transmission: selectedTransmission,
				driveType: selectedDriveType,
				capacity: selectedCapacity,
				engineSize: parseFloat(selectedEngineSize),
				numberOfDoors: selectedNumberOfDoors,
				vinNumber: selectedVinNumber,
				price: selectedPrice,
				status: selectedStatus,
				year: parseInt(selectedYear),
				description: selectedDescription,
				image: car?.image,
			};

			await axios.put(`https://localhost:7174/api/Car/${id}`, carData);

			console.log("Car details saved successfully");
			navigate("/");
			toast({ title: "Save car successfully!" });
		} catch (error) {
			console.error("Error saving car details:", error);
		}
	}

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
		fetchMakes();
		fetchCatalogs();
		getCarById();
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
						<div className="flex flex-row">
							<div className="flex flex-col w-[650px]">
								<Input
									style={{
										fontSize: "25px",
										fontWeight: "700",
									}}
									value={selectedModel}
									inputMode="text"
									onChange={(e) =>
										setSelectedModel(e.target.value)
									}
								/>
								<div className="flex flex-row mt-5 items-center gap-5 w-[280px]">
									<span>Make:</span>
									<Select
										onValueChange={(value) => {
											setSelectedMake(Number(value));
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder={make} />
										</SelectTrigger>
										<SelectContent>
											{makes.map((make) => (
												<SelectItem
													value={make.makeId.toString()}
													key={make.makeId}
												>
													{make.makeName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<img
									src={car?.image}
									alt={car?.model}
									className="object-cover h-fit rounded-2xl mt-5 "
								/>
								<div className="flex flex-row mt-7 items-center gap-8 w-[280px]">
									<span className="text-xl">Price:</span>
									<Input
										value={selectedPrice}
										style={{
											fontSize: "16px",
											fontWeight: "500",
										}}
										placeholder="Type in price"
										inputMode="numeric"
										onChange={(e) =>
											setSelectedPrice(
												Number(e.target.value)
											)
										}
									/>
								</div>
								<div className="flex flex-row mt-6 items-center gap-5 w-[280px]">
									<span className="text-xl">Status:</span>
									<Select
										onValueChange={(value) => {
											setSelectedStatus(value);
										}}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={selectedStatus}
											/>
										</SelectTrigger>
										<SelectContent>
											{carStatus.map((status, index) => (
												<SelectItem
													value={status}
													key={index}
												>
													{status}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex flex-col w-[500px]">
								<div className="flex flex-row justify-end gap-6">
									<Button
										className="w-fit border-[#2563EB] text-[#2563EB] hover:text-[#2563EB] border-2 px-8 py-6 rounded-2xl"
										variant="outline"
										onClick={() => {
											navigate(-1);
										}}
									>
										Cancel
									</Button>
									<Button
										className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-8 py-6 rounded-2xl"
										onClick={saveCar}
									>
										Save changes
									</Button>
								</div>
								<div className="flex flex-col mt-[54px] ms-[70px]">
									<h2 className="text-[20px] mt-0 font-medium">
										Car Overview
									</h2>
									<div className="flex flex-row mt-5 text-[14px]">
										<div className="flex flex-col gap-[33px] mt-2">
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
										<div className="flex flex-col gap-5 font-medium ms-20 w-[210px]">
											<Select
												onValueChange={(value) => {
													setSelectedCatalog(
														Number(value)
													);
												}}
											>
												<SelectTrigger>
													<SelectValue
														placeholder={catalog}
													/>
												</SelectTrigger>
												<SelectContent className="">
													{catalogs.map((catalog) => (
														<SelectItem
															value={
																catalog.catalogName
															}
															key={
																catalog.catalogId
															}
														>
															{
																catalog.catalogName
															}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Select
												onValueChange={(value) => {
													setSelectedFuelType(value);
												}}
											>
												<SelectTrigger>
													<SelectValue
														placeholder={
															selectedFuelType
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{carFuelType.map(
														(fuel, index) => (
															<SelectItem
																value={fuel}
																key={index}
															>
																{fuel}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<Input
												value={selectedYear}
												placeholder="Type in year"
												inputMode="text"
												onChange={(e) =>
													setSelectedYear(
														e.target.value
													)
												}
											/>
											<Select
												onValueChange={(value) => {
													setSelectedTransmission(
														value
													);
												}}
											>
												<SelectTrigger>
													<SelectValue
														placeholder={
															selectedTransmission
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{carTransmisson.map(
														(
															transmission,
															index
														) => (
															<SelectItem
																value={
																	transmission
																}
																key={index}
															>
																{transmission}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<Select
												onValueChange={(value) => {
													setSelectedDriveType(value);
												}}
											>
												<SelectTrigger>
													<SelectValue
														placeholder={
															selectedDriveType
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{carDriveType.map(
														(driveType, index) => (
															<SelectItem
																value={
																	driveType
																}
																key={index}
															>
																{driveType}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<Input
												value={selectedCapacity}
												placeholder="Type in car capacity"
												inputMode="numeric"
												onChange={(e) =>
													setSelectedCapacity(
														Number(e.target.value)
													)
												}
											/>
											<Input
												value={selectedEngineSize}
												placeholder="Type in car engine size"
												inputMode="numeric"
												onChange={(e) =>
													setSelectedEngineSize(
														parseFloat(
															e.target.value
														).toFixed(1)
													)
												}
											/>

											<Input
												value={selectedNumberOfDoors}
												placeholder="Type in number of doors"
												inputMode="text"
												onChange={(e) =>
													setSelectedNumberOfDoors(
														Number(e.target.value)
													)
												}
											/>
											<Input
												value={selectedColor}
												placeholder="Type in car color"
												inputMode="text"
												onChange={(e) =>
													setSelectedColor(
														e.target.value
													)
												}
											/>
											<Input
												value={selectedVinNumber}
												placeholder="Type in car VIN number"
												inputMode="text"
												onChange={(e) =>
													setSelectedVinNumber(
														e.target.value
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<span className="text-xl">Description</span>
						<Textarea
							className="mt-3"
							placeholder="A brief description of this car"
							rows={10}
							value={selectedDescription}
							onChange={(e) =>
								setSelectedDescription(e.target.value)
							}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
