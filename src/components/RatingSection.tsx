import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Feedback } from "@/types/Feedback";
import { Rating } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function RatingSection() {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchFeedbacks() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Feedback"
				);
				setFeedbacks(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching feedbacks:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchFeedbacks();
	}, []);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	return (
		<div className="flex flex-row h-[400px] my-20">
			<div className="w-[795px] ">
				<div className="flex flex-col">
					<h2 className="text-[28px] pl-[130px]  font-bold text-black-900">
						What Our Customers Say
					</h2>
					<Carousel className="px-[130px]">
						<CarouselContent className="w-[535px]">
							{feedbacks.map((feedback, index) => (
								<CarouselItem key={index}>
									<p className="mt-1 text-base">
										{formatDate(feedback.dateSubmitted)}
									</p>
									<div className="flex flex-row -ml-0.5 mt-10">
										<Rating
											value={feedback.rating}
											precision={0.5}
											size="small"
											readOnly
											className="mt-1 mr-2"
										/>
										<div className="text-[12px] bg-[#FAAF00] font-medium text-white px-2 py-1 rounded-full">
											{feedback.rating}
										</div>
									</div>
									<p className="font-medium text-[18px] mt-3">
										{feedback.customerName}
									</p>
									<p className="font-semibold mt-10">
										{feedback.text}
									</p>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="ml-[100px]" />
						<CarouselNext className="mr-[100px]" />
					</Carousel>
				</div>
			</div>
			<div className="w-[465px] bg-purple-400"></div>
		</div>
	);
}
