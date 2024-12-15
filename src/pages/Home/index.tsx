import ExploreVehiclesSection from "@/components/ExploreVehiclesSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MakeShowcase from "@/components/MakeShowcase";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import MakeItem from "../../components/MakeItem";
import { useUser } from "../../context/UserContext";
import { Make } from "../../types/Make";

export default function Home() {
	// const [makes, setMakes] = useState<Make[]>([]);
	// async function fetchMakes() {
	// 	const { data } = await axios.get("https://localhost:7174/api/Make");
	// 	console.log(data);
	// 	setMakes(data);
	// }

	// useEffect(() => {
	// 	fetchMakes();
	// }, []);
	return (
		<>
			<Helmet>
				<title>TrueDrive - Find Your Dream Vehicle Today</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="w-full h-fit ">
				<Header />
				<Hero />
				<MakeShowcase />
				<ExploreVehiclesSection />
				<WhyChooseUsSection />
			</div>
		</>
	);
}

// const user = useUser();
// const handleLogout = () => {
// 	console.log(localStorage.getItem("token"));
// 	// Remove the JWT token from local storage or cookies
// 	localStorage.removeItem("token");
// 	// Optionally, you can redirect the user to the login page
// 	window.location.href = "/login";
// };
