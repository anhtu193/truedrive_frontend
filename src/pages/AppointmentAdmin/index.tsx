import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/Appointment";
import axios from "axios";
import {
	CalendarDays,
	CircleCheckBig,
	Clock,
	ListTodo,
	MapPin,
	Search,
	SquareArrowOutUpRight,
	User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function AppointmentAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [customerNames, setCustomerNames] = useState<{
		[key: number]: string;
	}>({});

	const contentRef = useRef<HTMLDivElement>(null);

	async function fetchCustomerName(customerId: string) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Auth/user/${customerId}`
			);

			setAppointments(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching user's appointments:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		async function fetchAppointments() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Appointment/"
				);

				// Sort appointments based on status
				const sortedAppointments = data.sort(
					(a: Appointment, b: Appointment) => {
						const statusOrder: {
							[key in Appointment["status"]]: number;
						} = {
							Scheduled: 1,
							Completed: 2,
							Cancelled: 3,
						};

						return statusOrder[a.status] - statusOrder[b.status];
					}
				);

				setAppointments(sortedAppointments);
				console.log(sortedAppointments);

				// Fetch customer names
				const customerNamesMap: { [key: number]: string } = {};
				for (const appointment of sortedAppointments) {
					const customerResponse = await axios.get(
						`https://localhost:7174/api/Auth/user/${appointment.customerId}`
					);
					customerNamesMap[appointment.customerId] =
						customerResponse.data.fullName;
				}
				setCustomerNames(customerNamesMap);
			} catch (error) {
				console.error("Error fetching appointments:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchAppointments();
	}, []);

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	return (
		<>
			<Helmet>
				<title>Appointments</title>
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
						className="w-full bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-[700px]"
					>
						<h1 className="text-[30px] font-bold mb-2">
							Appointment
						</h1>
						<div className="max-h-[500px] overflow-y-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<User size={15} /> Customer Name
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CalendarDays size={15} /> Date
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<Clock size={15} /> Time
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<ListTodo size={15} /> Purpose
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<MapPin size={15} /> Showroom
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CircleCheckBig size={15} />{" "}
												Status
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<SquareArrowOutUpRight
													size={15}
												/>{" "}
												Action
											</div>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{appointments.map((appointment) => (
										<TableRow
											key={appointment.appointmentId}
										>
											<TableCell>
												{
													customerNames[
														appointment.customerId
													]
												}
											</TableCell>
											<TableCell>
												{appointment.date}
											</TableCell>
											<TableCell>
												{appointment.time}
											</TableCell>
											<TableCell>
												<div
													className={`${cn(
														"px-1 py-1 rounded-lg text-center",
														{
															"bg-[#EFFF85] font-medium":
																appointment.purpose ===
																"Consulting",
															"bg-[#82FF91] font-medium":
																appointment.purpose ===
																"Test Drive",
														}
													)}`}
												>
													{appointment.purpose}
												</div>
											</TableCell>
											<TableCell>
												{appointment.showroom}
											</TableCell>
											<TableCell
												className={`${cn({
													"text-[#FF0000] font-medium":
														appointment.status ===
														"Cancelled",
													"text-[#00ff00] font-medium":
														appointment.status ===
														"Scheduled",
													"text-[#FFA500] font-medium":
														appointment.status ===
														"Completed",
												})}`}
											>
												{appointment.status}
											</TableCell>
											<TableCell>
												<Button
													variant="outline"
													size="icon"
													onClick={() => {
														navigate(
															`/appointment/${appointment.appointmentId}`
														);
													}}
												>
													<Search />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
