import MakeItem from "@/components/MakeItem";
import { Make } from "@/types/Make";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MakeShowcase() {
	const [makes, setMakes] = useState<Make[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
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
				setIsLoading(false);
			}
		}

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
		<div className="flex flex-col w-full h-[300px] mt-[75px] px-[130px]">
			<div className="flex flex-row justify-between w-full h-fit">
				<h2 className="text-[28px] font-bold text-black-900">
					Explore Our Premium Makes
				</h2>
				<div className="flex flex-row gap-2 mt-3 cursor-pointer">
					<span className="text-[15px] font-medium text-black-900">
						Show all makes
					</span>
					<img
						src="images/img_arrow_left.svg"
						alt="Left Arrow Image"
						className="h-[14px]"
					/>
				</div>
			</div>
			<div className="flex flex-row justify-between w-full h-fit mt-6 gap-2">
				{makes.map((make) => (
					<MakeItem
						make={make}
						key={make.makeId}
					/>
				))}
			</div>
		</div>
	);
}
