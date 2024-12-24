import CarInfo from "@/components/CarInfo";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Car } from "@/types/Car";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

export default function CarDetail() {
	const [car, setCar] = useState<Car>();
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();
	async function getCarById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${id}`
			);

			setCar(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
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
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<CarInfo car={car} />
				<Footer />
			</div>
		</>
	);
}
