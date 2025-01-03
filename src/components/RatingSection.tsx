import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Feedback } from "@/types/Feedback";
import { Box, Rating } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const labels: { [index: string]: string } = {
	0.5: "(0.5)",
	1: "(1.0)",
	1.5: "(1.5)",
	2: "(2.0)",
	2.5: "(2.5)",
	3: "(3.0)",
	3.5: "(3.5)",
	4: "(4.0)",
	4.5: "(4.5)",
	5: "(5.0)",
};

function getLabelText(value: number) {
	return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function RatingSection() {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [value, setValue] = useState<number | null>(2.5);
	const [hover, setHover] = useState(-1);
	const [reviewText, setReviewText] = useState("");
	const user = useUser();

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

	const handleSubmitFeedback = async () => {
		if (user.user?.role != "Customer") {
			toast({
				title: "You need to sign in to perform this action!",
			});
			return;
		}
		if (!value || !reviewText) {
			toast({
				title: "Please fill in all fields.",
			});
			return;
		}

		const feedbackData = {
			customerName: user.user?.fullName,
			rating: value,
			text: reviewText,
		};

		try {
			const response = await axios.post(
				"https://localhost:7174/api/Feedback",
				feedbackData
			);

			if (response.status === 201) {
				toast({
					title: "Feedback submitted successfully!",
				});
				setFeedbacks([...feedbacks, response.data]);
				setValue(2.5);
				setReviewText("");
			} else {
				toast({
					title: "Failed to submit feedback.",
					description: "Thanks for your feedback about us.",
				});
			}
		} catch (error) {
			console.error("Error submitting feedback:", error);
			toast({
				title: "An error occurred while submitting feedback.",
			});
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
		<div className="flex flex-row h-[400px] my-20">
			<div className="w-[795px] ">
				<div className="flex flex-col">
					<h2 className="text-[28px] pl-[130px]  font-bold text-black-900">
						What Our Customers Say
					</h2>
					<Carousel className="px-[130px] select-none">
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
			<div className="w-[550px] ml-[40px]">
				<div className="flex flex-col mt-3">
					<h2 className="text-[22px] font-bold text-black-900">
						Leave a feedback!
					</h2>
					<p className="text-base mt-2">Rating</p>
					<div className="flex flex-row">
						<Rating
							value={value}
							precision={0.5}
							getLabelText={getLabelText}
							onChange={(event, newValue) => {
								setValue(newValue);
							}}
							onChangeActive={(event, newHover) => {
								setHover(newHover);
							}}
							className="-ml-0.5 mt-2"
						/>
						{value !== null && (
							<Box sx={{ ml: 1, mt: 1 }}>
								{labels[hover !== -1 ? hover : value]}
							</Box>
						)}
					</div>
					<p className="text-base mt-6">Review</p>
					<Textarea
						className="mt-3 "
						placeholder="Tell us what you think"
						rows={6}
						value={reviewText}
						onChange={(e) => setReviewText(e.target.value)}
					/>

					<Button
						className="w-[100px] bg-[#405FF2] hover:bg-[#617af6] rounded-lg text-[12px] mt-6"
						onClick={handleSubmitFeedback}
					>
						Submit
					</Button>
				</div>
			</div>
		</div>
	);
}
