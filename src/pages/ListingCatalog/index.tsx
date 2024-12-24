import CarItem from "@/components/CarItem";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Car } from "@/types/Car";
import { Catalog } from "@/types/Catalog";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

export default function ListingCatalog() {
	const [cars, setCars] = useState<Car[]>([]);
	const [catalog, setCatalog] = useState<Catalog>();
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();

	useEffect(() => {
		async function fetchCars() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Car/catalog/${id}`
				);

				setCars(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching cars:", error);
			} finally {
				setIsLoading(false);
			}
		}

		async function fetchCarCatalog() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Catalog/${id}`
				);

				setCatalog(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching catalog:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCars();
		fetchCarCatalog();
	}, [id]);

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
				<title>{catalog?.catalogName} listings</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold">
						{catalog?.catalogName}
					</h1>
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
		</>
	);
}
