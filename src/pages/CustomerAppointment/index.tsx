import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/Appointment";
import axios from "axios";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function CustomerAppointment() {
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [selectedAppointmentId, setSelectedAppointmentId] = useState<
		number | null
	>(null);
	const user = useUser();

	useEffect(() => {
		async function fetchUserAppointment() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Appointment/user/${user.user?.userId}`
				);

				setAppointments(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching user's appointments:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserAppointment();
	}, []);

	const handleCancel = async () => {
		if (selectedAppointmentId === null) return;

		const appointment = appointments.find(
			(appointment) => appointment.appointmentId === selectedAppointmentId
		);

		if (!appointment) {
			console.error("Appointment not found");
			return;
		}

		const updatedAppointment = {
			...appointment,
			status: "Cancelled",
		};

		try {
			const response = await axios.put(
				`https://localhost:7174/api/Appointment/${selectedAppointmentId}`,
				updatedAppointment
			);

			if (response.status === 204) {
				setAppointments((prevAppointments) =>
					prevAppointments.map((appointment) =>
						appointment.appointmentId === selectedAppointmentId
							? { ...appointment, status: "Cancelled" }
							: appointment
					)
				);
				setIsCancelDialogOpen(false);
			} else {
				console.error("Failed to cancel appointment");
			}
		} catch (error) {
			console.error(
				"An error occurred while cancelling the appointment:",
				error
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60px] bg-transparent">
				<p className="text-white text-sm">Loading...</p>
			</div>
		);
	}

	const sortedAppointments = [...appointments].sort((a, b) => {
		if (a.status === "Cancelled" && b.status !== "Cancelled") return 1;
		if (a.status !== "Cancelled" && b.status === "Cancelled") return -1;
		return 0;
	});

	return (
		<>
			<Helmet>
				<title>My Appointments</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold mb-4">
						My Appointments
					</h1>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Time</TableHead>
								<TableHead>Purpose</TableHead>
								<TableHead>Showroom</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedAppointments.map((appointment) => (
								<TableRow key={appointment.appointmentId}>
									<TableCell>{appointment.date}</TableCell>
									<TableCell>{appointment.time}</TableCell>
									<TableCell>{appointment.purpose}</TableCell>
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
										})}`}
									>
										{appointment.status}
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="icon"
											onClick={() => {
												setSelectedAppointmentId(
													appointment.appointmentId
												);
												setIsCancelDialogOpen(true);
											}}
											disabled={
												appointment.status ===
												"Cancelled"
											}
										>
											<Trash />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<Footer />
			</div>

			<Dialog
				open={isCancelDialogOpen}
				onOpenChange={setIsCancelDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Appointment</DialogTitle>
					</DialogHeader>
					<p>Are you sure you want to cancel this appointment?</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCancelDialogOpen(false)}
						>
							No
						</Button>
						<Button
							variant="destructive"
							onClick={handleCancel}
						>
							Yes, Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
