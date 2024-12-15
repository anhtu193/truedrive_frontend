import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Catalog } from "@/types/Catalog";
import { Make } from "@/types/Make";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Hero() {
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [makes, setMakes] = useState<Make[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
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
				setIsLoading(false); // Set loading to false after fetching data
			}
		}
		async function fetchMakes() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Make"
				);
				setMakes(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching make:", error);
			} finally {
				setIsLoading(false); // Set loading to false after fetching data
			}
		}
		fetchCatalogs();
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
			<div className="relative w-full">
				<img
					src="/images/hero.png"
					className="object-cover select-none"
				/>
				<span className="select-none absolute inset-0 flex items-center mb-80 justify-center text-white text-base">
					Find your dream car today - Explore our latest models!
				</span>
				<h1 className="select-none absolute inset-0 flex items-center mb-52 justify-center text-white text-[50px] font-bold ">
					Find your perfect car
				</h1>
				<div className="bg-white rounded-full w-[950px] left-[290px] h-[65px] absolute inset-0 top-[350px] items-center justify-start flex flex-row">
					<Input
						placeholder="Find your dream car"
						className="ms-4 border-none shadow-none focus-visible:ring-0  w-[434px]"
					/>
					<Select>
						<SelectTrigger className="w-[150px] focus:ring-0 border-none shadow-none focus-visible:ring-0">
							<SelectValue placeholder="Any catalog" />
						</SelectTrigger>
						<SelectContent>
							{catalogs.map((catalog) => (
								<SelectItem
									value={catalog.catalogName}
									key={catalog.catalogId}
								>
									{catalog.catalogName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger className="w-[150px] focus:ring-0 border-none shadow-none focus-visible:ring-0">
							<SelectValue placeholder="Any make" />
						</SelectTrigger>
						<SelectContent>
							{makes.map((make) => (
								<SelectItem
									value={make.makeName}
									key={make.makeId}
								>
									{make.makeName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button className="ms-[10px] bg-[#405FF2] hover:bg-[#506cfb] py-6 px-10 rounded-full">
						<Search /> Search cars
					</Button>
				</div>
			</div>
		</>
	);
}
