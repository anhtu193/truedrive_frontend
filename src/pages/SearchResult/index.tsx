import CarItem from "@/components/CarItem";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@/types/Car";
import { Catalog } from "@/types/Catalog";
import { Make } from "@/types/Make";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResult() {
	const location = useLocation();
	const [cars, setCars] = useState<Car[]>([]);
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [makes, setMakes] = useState<Make[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [query, setQuery] = useState<string>("");
	const [selectedCatalog, setSelectedCatalog] = useState<number | null>(null);
	const [selectedMake, setSelectedMake] = useState<number | null>(null);
	const navigate = useNavigate();
	const { toast } = useToast();
	useEffect(() => {
		async function fetchCatalogs() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Catalog"
				);
				setCatalogs(data);
			} catch (error) {
				console.error("Error fetching catalogs:", error);
			}
		}

		async function fetchMakes() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Make"
				);
				setMakes(data);
			} catch (error) {
				console.error("Error fetching makes:", error);
			}
		}

		fetchCatalogs();
		fetchMakes();
	}, []);

	useEffect(() => {
		if (location.state && location.state.results) {
			setCars(location.state.results);
			setIsLoading(false);
		}
	}, [location.state]);

	const getCatalogName = (catalogId: number) => {
		const catalog = catalogs.find(
			(catalog) => catalog.catalogId === catalogId
		);
		return catalog ? catalog.catalogName : "Unknown Catalog";
	};

	const getMakeName = (makeId: number) => {
		const make = makes.find((make) => make.makeId === makeId);
		return make ? make.makeName : "Unknown Make";
	};

	const handleSearch = async () => {
		if (query === "") {
			toast({
				title: "Uh oh! Something went wrong.",
				description: "Please type some thing to start searching!",
			});
		} else {
			try {
				const params: any = {};
				if (query) params.query = query;
				if (selectedCatalog !== null)
					params.catalogId = selectedCatalog;
				if (selectedMake !== null) params.makeId = selectedMake;

				const response = await axios.get(
					"https://localhost:7174/api/Car/search",
					{ params }
				);

				if (response.status === 200) {
					const searchParams = new URLSearchParams();
					if (query) searchParams.append("query", query);
					if (selectedCatalog !== null)
						searchParams.append(
							"catalogId",
							selectedCatalog.toString()
						);
					if (selectedMake !== null)
						searchParams.append("makeId", selectedMake.toString());

					console.log(searchParams.toString());

					navigate(
						{
							pathname: "/search",
							search: searchParams.toString(),
						},
						{ state: { results: response.data } }
					);
				} else {
					console.error("Search failed");
				}
			} catch (error) {
				toast({
					title: "An error occurred",
					description: "An error occurred during search.",
				});
				console.error("An error occurred during search:", error);
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
			<ToastProvider>
				<Helmet>
					<title>Search result</title>
					<meta
						name="description"
						content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
					/>
				</Helmet>
				<div className="bg-[#050B20] w-full h-fit ">
					<Header />
					<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
						{cars.length > 0 ? (
							<h1 className="text-[30px] font-bold">
								Found {cars.length} match results!
							</h1>
						) : (
							<h1 className="text-[30px] font-bold">
								No results found!
							</h1>
						)}
						<div className="bg-white border self-center mt-5 rounded-full w-[950px] h-[65px] items-center justify-start flex flex-row">
							<Input
								placeholder="Find your dream car"
								className="ms-4 border-none shadow-none focus-visible:ring-0  w-[434px]"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<Select
								onValueChange={(value) =>
									setSelectedCatalog(Number(value))
								}
							>
								<SelectTrigger className="w-[150px] focus:ring-0 border-none shadow-none focus-visible:ring-0">
									<SelectValue placeholder="Any catalog" />
								</SelectTrigger>
								<SelectContent>
									{catalogs.map((catalog) => (
										<SelectItem
											value={catalog.catalogId.toString()}
											key={catalog.catalogId}
										>
											{catalog.catalogName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								onValueChange={(value) =>
									setSelectedMake(Number(value))
								}
							>
								<SelectTrigger className="w-[150px] focus:ring-0 border-none shadow-none focus-visible:ring-0">
									<SelectValue placeholder="Any make" />
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
							<Button
								className="ms-[10px] bg-[#405FF2] hover:bg-[#506cfb] py-6 px-10 rounded-full"
								onClick={handleSearch}
							>
								<Search /> Search cars
							</Button>
						</div>
						{/* Cars item here */}
						<div className="flex gap-8 flex-wrap h-fit py-12">
							{cars.map((carItem, index) => (
								<CarItem
									key={index}
									car={carItem}
								/>
							))}
						</div>
					</div>
					<Footer />
				</div>
			</ToastProvider>
		</>
	);
}

{
	/* <div>
<h1>Search Results</h1>
{cars.length > 0 ? (
    <ul>
        {cars.map((car) => (
            <li key={car.carId}>
                {car.model} - {getCatalogName(car.catalogId)} -{" "}
                {getMakeName(car.makeId)}
            </li>
        ))}
    </ul>
) : (
    <p>No results found</p>
)}
</div> */
}
