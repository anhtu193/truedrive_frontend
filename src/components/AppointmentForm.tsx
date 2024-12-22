import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/popoverDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { cn, generateTimeOptions } from "@/lib/utils";
import { Showroom } from "@/types/Showroom";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface AppointmentFormProps {
	isDialogOpen: boolean;
	setIsDialogOpen: (isOpen: boolean) => void;
	purpose: string;
	carId: number | undefined;
}

export default function AppointmentForm({
	isDialogOpen,
	setIsDialogOpen,
	purpose,
	carId,
}: AppointmentFormProps) {
	const user = useUser();
	const [showrooms, setShowrooms] = useState<Showroom[]>([]);
	const [selectedShowroom, setSelectedShowroom] = useState("");
	const [selectedTime, setSelectedTime] = useState("");
	const [note, setNote] = useState("");
	const [date, setDate] = React.useState<Date>();
	const [isLoading, setIsLoading] = useState(true);

	async function fetchShowrooms() {
		try {
			const { data } = await axios.get(
				"https://localhost:7174/api/Showroom"
			);
			setShowrooms(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching showrooms:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchShowrooms();
	}, []);

	const handleClose = () => {
		setIsDialogOpen(false);
		setSelectedShowroom("");
		setSelectedTime("");
		setNote("");
		setDate(undefined);
	};

	const handleSubmitForm = async () => {
		if (!date || !selectedTime || !selectedShowroom) {
			alert("Please fill in all required fields.");
			return;
		}

		const formattedDate = format(date, "MMM dd yyyy");

		const appointmentData = {
			customerId: user.user?.userId,
			carId: carId,
			date: formattedDate,
			time: selectedTime,
			showroom: selectedShowroom,
			status: "Scheduled",
			purpose:
				purpose === "Consulting Session" ? "Consulting" : "Test Drive",
			note: note,
		};

		try {
			const response = await axios.post(
				"https://localhost:7174/api/Appointment",
				appointmentData
			);

			if (response.status === 201) {
				handleClose();
				toast({
					title: "Appointment scheduled successfully!",
				});
			} else {
				console.log(appointmentData);
				alert("Failed to schedule appointment.");
			}
		} catch (error) {
			console.error("Error scheduling appointment:", error);
			alert("An error occurred while scheduling the appointment.");
		}
	};

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={handleClose}
		>
			<DialogContent className="max-w-[700px] z-50">
				<DialogHeader>
					<DialogTitle>Schedule a {purpose}</DialogTitle>
					<DialogDescription>
						Please provide your details to schedule a consulting
						session.
					</DialogDescription>
				</DialogHeader>
				{/* Add form fields here */}
				<div className="flex flex-col">
					<h2 className="text-[18px] font-semibold">
						Personal Information
					</h2>
					<div className="flex flex-row mt-2 gap-8">
						<div className="flex flex-col gap-2">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Full Name
							</Label>
							<Input
								className="w-[300px]"
								disabled
								value={user.user?.fullName}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Email
							</Label>
							<Input
								className="w-[300px]"
								disabled
								value={user.user?.email}
							/>
						</div>
					</div>
					<div className="flex flex-row mt-2 gap-8">
						<div className="flex flex-col gap-2">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Phone Number
							</Label>
							<Input
								className="w-[300px]"
								disabled
								value={user.user?.phone}
							/>
						</div>
						<div className="flex flex-col gap-2 w-[300px]">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Showroom
							</Label>
							<Select
								onValueChange={(value) =>
									setSelectedShowroom(value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a showroom" />
								</SelectTrigger>
								<SelectContent>
									{showrooms.map((showroom) => (
										<SelectItem
											value={showroom.address}
											key={showroom.showroomId}
										>
											{showroom.address}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<h2 className="text-[18px] mt-6 font-semibold">
						Appointment Details
					</h2>
					<div className="flex flex-row mt-2 gap-8">
						<div className="flex flex-col gap-2 w-[300px]">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Preferred Date
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-[240px] justify-start text-left font-normal",
											!date && "text-muted-foreground"
										)}
									>
										<CalendarIcon />
										{date ? (
											format(date, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-auto p-0"
									align="start"
								>
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="flex flex-col gap-2 w-[300px]">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Preferred Time
							</Label>
							<Select
								onValueChange={(value) =>
									setSelectedTime(value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a time" />
								</SelectTrigger>
								<SelectContent>
									{generateTimeOptions().map((time) => (
										<SelectItem
											value={time}
											key={time}
										>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex flex-row mt-2 gap-8">
						<div className="flex flex-col gap-2 w-full">
							<Label className="flex flex-row items-end font-medium gap-1 text-[15px]">
								Additional Note
							</Label>
							<Textarea
								placeholder="Tell us if you need anything"
								rows={6}
								value={note}
								onChange={(e) => setNote(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<DialogFooter className="flex justify-center">
					<Button
						className="bg-[#2563EB] hover:bg-[#5083f2] px-14 py-6 rounded-2xl"
						onClick={handleSubmitForm}
					>
						Schedule
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
