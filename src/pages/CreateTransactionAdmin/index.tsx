import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Car } from "@/types/Car";
import axios from "axios";
import {
	CreditCard,
	DollarSign,
	Inbox,
	MapPin,
	Phone,
	Search,
	SquarePen,
	User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const paymentMethod = ["Cash", "Credit Card", "Internet Banking"];

export default function CreateTransactionAdmin() {
	const [cars, setCars] = useState<Car[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [filteredCars, setFilteredCars] = useState<Car[]>([]);
	const navigate = useNavigate();
	const [customerName, setCustomerName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [car, setCar] = useState<string>("");
	const [price, setPrice] = useState<number | undefined>(undefined);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
	const [selectedCarId, setSelectedCarId] = useState<number | undefined>(
		undefined
	);

	const handleCarClick = async (carModel: string) => {
		setCar(carModel);
		console.log(carModel);
		setFilteredCars([]);

		const carId = getCarIdByModel(carModel);
		setSelectedCarId(carId);
		if (carId) {
			await fetchCarById(carId);
		}
	};

	const getCarIdByModel = (carModel: string): number | undefined => {
		const car = cars.find((car) => car.model === carModel);
		return car?.carId;
	};

	async function fetchCarById(carId: number) {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Car/${carId}`
			);
			setPrice(data.price);
		} catch (error) {
			console.error("Error fetching car by ID:", error);
		}
	}

	const handleSearchCar = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value.toLowerCase();
		setCar(query);
		if (query === "") {
			setFilteredCars([]);
			return;
		}
		const filtered = cars.filter((car) =>
			car.model.toLowerCase().includes(query)
		);
		setFilteredCars(filtered);
	};

	const createTransaction = async () => {
		console.log(selectedCarId);
		if (!customerName || !email || !phone || !address || !price) {
			toast({ title: "Please fill in all fields." });
			return;
		}
		if (!selectedCarId) {
			toast({ title: "Please select a valid car model." });
			return;
		}

		const transactionData = {
			carId: selectedCarId,
			customerName,
			customerEmail: email,
			customerPhone: phone,
			customerAddress: address,
			amount: price,
			paymentMethod: selectedPaymentMethod,
			date: new Date().toISOString(),
		};

		try {
			await axios.post(
				`https://localhost:7174/api/Transaction`,
				transactionData
			);

			const newStatus = "Sold";
			// Update car status to "Sold"
			await axios.patch(
				`https://localhost:7174/api/Car/${selectedCarId}/status`,
				{ status: newStatus }
			);

			console.log("Transaction created successfully");
			navigate("/transaction");
			toast({ title: "Transaction created successfully!" });
		} catch (error) {
			console.error("Error creating transaction:", error);
			toast({ title: "Failed to create transaction." });
		}
	};

	useEffect(() => {
		async function fetchCars() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Car/status/Available`
				);

				setCars(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching cars:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchCars();
	}, []);

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
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
				<title>New Transaction</title>
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
							New Transaction
						</h1>
						<div className="flex flex-row px-16 py-5 justify-between">
							<div className="flex flex-col gap-7">
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<User
											size={18}
											className="mb-0.5"
										/>{" "}
										Customer Name
									</div>
									<Input
										value={customerName}
										placeholder="Type in customer's name"
										inputMode="text"
										className="mt-3 w-[450px]"
										onChange={(e) =>
											setCustomerName(e.target.value)
										}
									/>
								</div>
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<Inbox
											size={18}
											className="mb-0.5"
										/>{" "}
										Email
									</div>
									<Input
										value={email}
										placeholder="Type in customer's email"
										inputMode="text"
										className="mt-3 w-[450px]"
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</div>
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<Phone
											size={18}
											className="mb-0.5"
										/>{" "}
										Phone Number
									</div>
									<Input
										value={phone}
										placeholder="Type in customer's phone number"
										inputMode="text"
										className="mt-3 w-[450px]"
										onChange={(e) =>
											setPhone(e.target.value)
										}
									/>
								</div>
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<MapPin
											size={18}
											className="mb-0.5"
										/>{" "}
										Address
									</div>
									<Input
										value={address}
										placeholder="Type in customer's address"
										inputMode="text"
										className="mt-3 w-[450px]"
										onChange={(e) =>
											setAddress(e.target.value)
										}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-7">
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<img
											src="/images/img_car.svg"
											alt="body"
											className="mb-0.5"
										/>
										Model
									</div>
									<div className="flex flex-row items-center">
										<Input
											placeholder="Select a available model"
											className="bg-white w-[450px] mt-3"
											value={car}
											onChange={handleSearchCar}
										/>
										<Search
											size={18}
											className="text-[#DCDCDC] absolute right-[146px] mt-3"
										/>
									</div>
									{filteredCars.length > 0 && (
										<div className="w-full absolute h-fit bg-white rounded-2xl py-3 px-5 mt-2">
											{filteredCars.map((car) => (
												<p
													key={car.carId}
													className="cursor-pointer"
													onClick={() =>
														handleCarClick(
															car.model
														)
													}
												>
													{car.model}
												</p>
											))}
										</div>
									)}
								</div>
								<div>
									<div className="flex items-center flex-row gap-2 text-[16px] font-medium">
										<DollarSign
											size={18}
											className="mb-0.5"
										/>{" "}
										Price
									</div>
									<Input
										value={
											price
												? price.toLocaleString("en-US")
												: "Price of selected model"
										}
										placeholder="Price of selected model"
										inputMode="numeric"
										className="mt-3 w-[450px]"
										readOnly
									/>
								</div>
								<div>
									<div className="flex mb-3 items-center flex-row gap-2 text-[16px] font-medium">
										<CreditCard
											size={18}
											className="mb-0.5"
										/>{" "}
										Payment Method
									</div>
									<Select
										onValueChange={(value) => {
											setSelectedPaymentMethod(value);
										}}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={
													selectedPaymentMethod
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{paymentMethod.map(
												(method, index) => (
													<SelectItem
														value={method}
														key={index}
													>
														{method}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						<div className="flex mt-4 self-center flex-row gap-6">
							<Button
								className="w-fit border-[#2563EB] text-[#2563EB] hover:text-[#2563EB] border-2 px-12 py-6 rounded-2xl"
								variant="outline"
								onClick={() => {
									navigate(-1);
								}}
							>
								Cancel
							</Button>
							<Button
								className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-12 py-6 rounded-2xl"
								onClick={createTransaction}
							>
								Create
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
