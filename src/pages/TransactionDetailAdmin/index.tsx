import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Car } from "@/types/Car";
import { Policy } from "@/types/Policy";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import { ArrowLeft, Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

export default function TransactionDetailAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [transaction, setTransaction] = useState<Transaction>();
	const { id } = useParams();
	const [car, setCar] = useState<Car>();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	async function fetchCarById(carId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${carId}`
			);
			setCar(data);
		} catch (error) {
			console.error("Error fetching car by ID:", error);
		}
	}

	async function getTransactionById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Transaction/${id}`
			);

			setTransaction(data);
			console.log(data);
			await fetchCarById(data.carId);
		} catch (error) {
			console.error("Error fetching transaction:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
		getTransactionById();
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
				<title>Transaction Detail</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="flex flex-col">
				<AdminHeader />
				<div className="flex flex-row h-fit bg-[#DEDEDE]">
					<AdminNavigation height={height} />
					<div
						ref={contentRef}
						className="w-full flex flex-col bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-fit"
					>
						<h1 className="text-[30px] font-bold">
							Transaction Detail
						</h1>
						<div className="flex flex-col gap-7  mt-8 px-8">
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">
									Customer Name:
								</span>
								{transaction?.customerName}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">Email:</span>
								{transaction?.customerEmail}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">
									Phone Number:
								</span>
								{transaction?.customerPhone}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">
									Address:
								</span>
								{transaction?.customerAddress}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">Model:</span>
								{car?.model}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">Price:</span>
								${car?.price.toLocaleString("en-US")}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">
									Payment Method:
								</span>
								{transaction?.paymentMethod}
							</div>
							<div className="flex flex-row text-[20px]">
								<span className="font-medium me-2">
									Transaction Date:
								</span>
								{formatDate(transaction?.date || "")}
							</div>
						</div>
						<Button
							className="bg-[#2563EB] self-center mt-7 w-fit hover:bg-[#5083f2] px-12 py-6 rounded-2xl"
							onClick={() => navigate(-1)}
						>
							<ArrowLeft
								size={15}
								className="mb-0.5"
							/>{" "}
							Back
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
