import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Car } from "@/types/Car";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

export default function Compare() {
	const [cars, setCars] = useState<Car[]>([]);
	const [filteredCars, setFilteredCars] = useState<Car[]>([]);
	const [filteredCarsSecond, setFilteredCarsSecond] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQueryFirst, setSearchQueryFirst] = useState("");
	const [searchQuerySecond, setSearchQuerySecond] = useState("");
	const [openComparison, setOpenComparison] = useState<boolean>(false);
	const [firstCar, setFirstCar] = useState<Car>();
	const [secondCar, setSecondCar] = useState<Car>();
	const [firstCarCatalog, setFirstCarCatalog] = useState("");
	const [secondCarCatalog, setSecondCarCatalog] = useState("");
	const comparisonRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

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

		fetchCars();
	}, []);

	useEffect(() => {
		if (location.state && location.state.searchQueryFirst) {
			setSearchQueryFirst(location.state.searchQueryFirst);
		}
	}, [location.state]);

	useEffect(() => {
		if (openComparison && comparisonRef.current) {
			const offset = 100; // Adjust this value as needed
			const topPosition =
				comparisonRef.current.getBoundingClientRect().top +
				window.pageYOffset -
				offset;
			window.scrollTo({ top: topPosition, behavior: "smooth" });
		}
	}, [openComparison]);

	const handleSearchFirst = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value.toLowerCase();
		setSearchQueryFirst(query);
		if (query === "") {
			setFilteredCars([]);
			return;
		}
		const filtered = cars.filter((car) =>
			car.model.toLowerCase().includes(query)
		);
		setFilteredCars(filtered);
	};

	const handleSearchSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value.toLowerCase();
		setSearchQuerySecond(query);
		if (query === "") {
			setFilteredCarsSecond([]);
			return;
		}
		const filtered = cars.filter((car) =>
			car.model.toLowerCase().includes(query)
		);
		setFilteredCarsSecond(filtered);
	};

	const handleCarClickFirst = (carModel: string) => {
		setSearchQueryFirst(carModel);
		console.log(carModel);
		setFilteredCars([]);
	};

	const handleCarClickSecond = (carModel: string) => {
		setSearchQuerySecond(carModel);
		console.log(carModel);
		setFilteredCarsSecond([]);
	};

	const getCarIdByModel = (carModel: string): number | undefined => {
		const car = cars.find((car) => car.model === carModel);
		return car?.carId;
	};

	const getCarById = async (carId: number): Promise<Car | undefined> => {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${carId}`
			);
			return data;
		} catch (error) {
			console.error("Error fetching car by ID:", error);
			return undefined;
		}
	};

	const getCatalogNameById = async (
		catalogId: number
	): Promise<string | undefined> => {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Catalog/${catalogId}`
			);
			return data.catalogName;
		} catch (error) {
			console.error("Error fetching catalog by ID:", error);
			return undefined;
		}
	};

	const handleComparison = async (): Promise<void> => {
		const firstCarId = getCarIdByModel(searchQueryFirst);
		const secondCarId = getCarIdByModel(searchQuerySecond);

		if (firstCarId === undefined || secondCarId === undefined) {
			toast({ title: "Cars not found!" });
			return;
		}

		const firstCarData = await getCarById(firstCarId);
		const secondCarData = await getCarById(secondCarId);

		if (firstCarData && secondCarData) {
			setFirstCar(firstCarData);
			setSecondCar(secondCarData);

			const { data: firstCatalogData } = await axios.get(
				`https://localhost:7174/api/Catalog/${firstCarData.catalogId}`
			);

			setFirstCarCatalog(firstCatalogData.catalogName);

			const { data: secondCatalogData } = await axios.get(
				`https://localhost:7174/api/Catalog/${secondCarData.catalogId}`
			);

			setSecondCarCatalog(secondCatalogData.catalogName);

			setOpenComparison(true);
		} else {
			toast({ title: "Error fetching car details!" });
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
			<Helmet>
				<title>Compare cars</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold">Compare cars</h1>
					<span className="mt-1">
						Choose two cars to compare side-by-side.
					</span>
					<div className="flex flex-row justify-between px-8 mt-10">
						<div className="relative w-[570px] h-fit">
							<div className="bg-[#2563EB] w-full h-[190px] rounded-t-2xl"></div>
							<img
								src="images/first_car.png"
								alt="first car"
								className="w-[85%] absolute top-2 left-11"
							/>
							<div className="bg-[#F1F1F1] w-full h-[220px] rounded-b-2xl pt-[87px] px-12">
								<h2 className="font-bold text-[28px] mb-2">
									Add first car
								</h2>
								<div className="flex flex-row items-center">
									<Input
										placeholder="Select your first car"
										className="bg-white"
										value={searchQueryFirst}
										onChange={handleSearchFirst}
									/>
									<Search className="text-[#DCDCDC] absolute right-14" />
								</div>
								{filteredCars.length > 0 && (
									<div className="w-full h-fit bg-white rounded-2xl py-3 px-5 mt-2">
										{filteredCars.map((car) => (
											<p
												key={car.carId}
												className="cursor-pointer"
												onClick={() =>
													handleCarClickFirst(
														car.model
													)
												}
											>
												{car.model}
											</p>
										))}
									</div>
								)}
							</div>
						</div>
						<div className="relative w-[570px] h-fit">
							<div className="bg-[#2563EB] w-full h-[190px] rounded-t-2xl"></div>
							<img
								src="images/second_car.png"
								alt="second car"
								className="w-[85%] absolute top-2 left-11"
							/>
							<div className="bg-[#F1F1F1] w-full h-[220px] rounded-b-2xl pt-[87px] px-12">
								<h2 className="font-bold text-[28px] mb-2">
									Add second car
								</h2>
								<div className="flex flex-row items-center">
									<Input
										placeholder="Select your second car"
										className="bg-white"
										value={searchQuerySecond}
										onChange={handleSearchSecond}
									/>
									<Search className="text-[#DCDCDC] absolute right-14" />
								</div>
								{filteredCarsSecond.length > 0 && (
									<div className="w-full h-fit bg-white rounded-2xl py-3 px-5 mt-2">
										{filteredCarsSecond.map((car) => (
											<p
												key={car.carId}
												className="cursor-pointer"
												onClick={() =>
													handleCarClickSecond(
														car.model
													)
												}
											>
												{car.model}
											</p>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
					<Button
						onClick={() => {
							if (
								searchQueryFirst != "" &&
								searchQuerySecond != ""
							) {
								handleComparison();
							} else {
								toast({
									title: "Please choose two cars to compare!",
								});
							}
						}}
						className="bg-[#2563EB] ml-8 w-fit mt-6 hover:bg-[#5083f2] px-8 py-6 rounded-3xl"
					>
						See the comparison
					</Button>
					{openComparison && (
						<div
							ref={comparisonRef}
							className="h-fit w-full px-8 mt-6 flex flex-col"
						>
							<h1 className="text-[30px] font-bold mb-5">
								Your car comparison
							</h1>
							<div className="flex flex-row gap-20">
								<div className="flex flex-col gap-3">
									<img
										src={firstCar?.image}
										alt={firstCar?.model}
										className="w-[410px] h-[273px] object-cover rounded-2xl"
									/>
									<span className="font-semibold text-[20px]">
										{firstCar?.model}
									</span>
									<span className="font-semibold text-[20px]">
										$
										{firstCar?.price.toLocaleString(
											"en-US"
										)}
									</span>
								</div>
								<div className="flex flex-col gap-3">
									<img
										src={secondCar?.image}
										alt={secondCar?.model}
										className="w-[410px] h-[273px] object-cover rounded-2xl"
									/>
									<span className="font-semibold text-[20px]">
										{secondCar?.model}
									</span>
									<span className="font-semibold text-[20px]">
										$
										{secondCar?.price.toLocaleString(
											"en-US"
										)}
									</span>
								</div>
							</div>
							<h2 className="mt-7 text-[18px] font-medium mb-5">
								Highlights
							</h2>
							<div className="flex flex-row gap-[200px]">
								<div className="flex flex-col">
									<span className="font-semibold mb-2">
										{firstCarCatalog}
									</span>
									<span className="text-[#929292] ">
										Body
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.fuel}
									</span>
									<span className="text-[#929292] ">
										Petrol Type
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.transmission}
									</span>
									<span className="text-[#929292] ">
										Transmission
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.driveType}
									</span>
									<span className="text-[#929292] ">
										Drive Type
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.capacity}
									</span>
									<span className="text-[#929292] ">
										Capacity
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.engineSize.toPrecision(2)}
									</span>
									<span className="text-[#929292] ">
										Engine Size
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.numberOfDoors} Doors
									</span>
									<span className="text-[#929292] ">
										Door
									</span>
									<span className="mt-8 font-semibold mb-2">
										{firstCar?.color}
									</span>
									<span className="text-[#929292] ">
										Color
									</span>
								</div>
								<div className="flex flex-col">
									<span className="font-semibold mb-2">
										{secondCarCatalog}
									</span>
									<span className="text-[#929292] ">
										Body
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.fuel}
									</span>
									<span className="text-[#929292] ">
										Petrol Type
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.transmission}
									</span>
									<span className="text-[#929292] ">
										Transmission
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.driveType}
									</span>
									<span className="text-[#929292] ">
										Drive Type
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.capacity}
									</span>
									<span className="text-[#929292] ">
										Capacity
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.engineSize.toPrecision(2)}
									</span>
									<span className="text-[#929292] ">
										Engine Size
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.numberOfDoors} Doors
									</span>
									<span className="text-[#929292] ">
										Door
									</span>
									<span className="mt-8 font-semibold mb-2">
										{secondCar?.color}
									</span>
									<span className="text-[#929292] ">
										Color
									</span>
								</div>
							</div>
							<Button
								className="bg-[#2563EB] w-fit mt-6 hover:bg-[#5083f2] px-8 py-6 rounded-3xl"
								onClick={() => window.location.reload()}
							>
								New comparison
							</Button>
						</div>
					)}
				</div>
				<Footer />
			</div>
		</>
	);
}
