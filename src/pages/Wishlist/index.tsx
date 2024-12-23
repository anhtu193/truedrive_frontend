import CarItem from "@/components/CarItem";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { Car } from "@/types/Car";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function Wishlist() {
	const [cars, setCars] = useState<Car[]>([]);
	const user = useUser();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchUserWishlist() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Wishlist/user/${user.user?.userId}`
				);

				setCars(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching user's wishlist:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserWishlist();
	}, []);

	const handleRemove = (carId: number) => {
		setCars((prevCars) => prevCars.filter((car) => car.carId !== carId));
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
				<title>Wishlist</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold mb-4">Wishlist</h1>
					<div className="flex gap-8 flex-wrap h-fit py-12">
						{cars.map((carItem, index) => (
							<CarItem
								key={index}
								car={carItem}
								onRemove={handleRemove}
							/>
						))}
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
