import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/Appointment";
import { Car } from "@/types/Car";
import { User } from "@/types/User";
import axios from "axios";
import { ArrowLeft, Undo, Undo2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

export default function AppointmentDetailAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [appointment, setAppointment] = useState<Appointment>();
	const [car, setCar] = useState<Car>();
	const [customer, setCustomer] = useState<User>();
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();
	const navigate = useNavigate();

	async function getAppointmentById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Appointment/${id}`
			);

			setAppointment(data);
			console.log(data);

			await fetchCar(data.carId);
			await fetchCustomerInfo(data.customerId);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchCar(carId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${carId}`
			);
			setCar(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching car:", error);
		}
	}

	async function fetchCustomerInfo(customerId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Auth/user/${customerId}`
			);
			setCustomer(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching customer info:", error);
		}
	}

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	useEffect(() => {
		getAppointmentById();
	}, []);

	return (
		<>
			<Helmet>
				<title>Appointment</title>
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
						<div className="flex flex-row gap-56">
							<div className="flex flex-col">
								<h2 className="text-[24px] font-semibold mt-2 ms-3">
									Customer Information
								</h2>
								<div className="text-[20px] ms-10 mt-3">
									<span className="font-medium me-2">
										Full name:
									</span>
									{customer?.fullName}
								</div>
								<div className="text-[20px] ms-10 mt-3">
									<span className="font-medium me-2">
										Phone number:
									</span>
									{customer?.phoneNumber}
								</div>
								<h2 className="text-[24px] font-semibold mt-3 ms-3">
									Appointment Detail
								</h2>
								<div className="text-[20px] ms-10 mt-3">
									<span className="font-medium me-2">
										Date:
									</span>
									{appointment?.date}
								</div>
								<div className="text-[20px] mt-3 ms-10">
									<span className="font-medium me-2">
										Time:
									</span>
									{appointment?.time}
								</div>
							</div>
							<div className="flex flex-col mt-[45px]">
								<div className="text-[20px] mt-3">
									<span className="font-medium me-2 ">
										Email:
									</span>
									{customer?.email}
								</div>
								<div className="text-[20px] mt-3">
									<span className="font-medium me-2">
										Address:
									</span>
									{customer?.address}
								</div>
								<div className="text-[20px] mt-[52px] ">
									<span className="font-medium me-2">
										Purpose:
									</span>
									{appointment?.purpose}
								</div>
								<div className="text-[20px] mt-3">
									<span className="font-medium me-2">
										Status:
									</span>
									<span
										className={`${cn({
											"text-[#FF0000] font-medium":
												appointment?.status ===
												"Cancelled",
											"text-[#00ff00] font-medium":
												appointment?.status ===
												"Scheduled",
											"text-[#FFA500] font-medium":
												appointment?.status ===
												"Completed",
										})}`}
									>
										{appointment?.status}
									</span>
								</div>
							</div>
						</div>
						<div className="text-[20px] ms-10 mt-3">
							<span className="font-medium me-2">
								Car reserved:
							</span>
							{car?.model}
						</div>
						<div className="text-[20px] ms-10 mt-3">
							<span className="font-medium me-2">Showroom:</span>
							{appointment?.showroom}
						</div>
						<div className="text-[20px] ms-10 mt-3">
							<span className="font-medium me-2">
								Additional note:
							</span>
							{appointment?.note}
						</div>
						<div className="flex flex-row justify-center mt-8">
							<Button
								className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-12 py-6 rounded-2xl"
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
			</div>
		</>
	);
}
