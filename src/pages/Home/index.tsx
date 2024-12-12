import axios from "axios";
import React, { useEffect, useState } from "react";
import MakeItem from "../../components/MakeItem";
import { useUser } from "../../context/UserContext";
import { Make } from "../../types/Make";

export default function Home() {
	const [makes, setMakes] = useState<Make[]>([]);
	async function fetchMakes() {
		const { data } = await axios.get("https://localhost:7174/api/Make");
		console.log(data);
		setMakes(data);
	}

	useEffect(() => {
		fetchMakes();
	}, []);
	return (
		<div className="flex w-full gap-[30px] md:flex-col">
			{makes.map((make) => (
				<MakeItem
					make={make}
					key={make.makeId}
				/>
			))}
		</div>
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
