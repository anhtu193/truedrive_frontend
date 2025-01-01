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
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types/Transaction";
import axios from "axios";
import {
	BookA,
	CalendarDays,
	CreditCard,
	DollarSign,
	Search,
	SquareArrowOutUpRight,
	SquarePen,
	User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function TransactionAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [carModels, setCarModels] = useState<{ [key: number]: string }>({});

	const navigate = useNavigate();

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	useEffect(() => {
		async function fetchTransactions() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Transaction"
				);
				setTransactions(data);
				console.log(data);

				// Fetch car models
				const carModelsMap: { [key: number]: string } = {};
				for (const transaction of data) {
					const carResponse = await axios.get(
						`https://localhost:7174/api/Car/${transaction.carId}`
					);
					carModelsMap[transaction.carId] = carResponse.data.model;
				}
				setCarModels(carModelsMap);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchTransactions();
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
				<title>Transaction</title>
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
						className="w-full flex flex-col bg-white px-12 py-10 mx-6 my-6 rounded-2xl h-[1000px]"
					>
						<div className="flex flex-row justify-between">
							<h1 className="text-[30px] font-bold">
								Transaction
							</h1>
							<Button
								className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-8 py-6 rounded-2xl"
								onClick={() => navigate("/transaction/new")}
							>
								Create <SquarePen />{" "}
							</Button>
						</div>
						<div className="max-h-[500px] mt-2 overflow-y-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<BookA size={15} /> Model
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<DollarSign size={15} /> Price
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<User size={15} /> Customer Name
											</div>
										</TableHead>

										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CreditCard size={15} /> Payment
												Method
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CalendarDays size={15} /> Date
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
									{transactions.map((transaction) => (
										<TableRow
											key={transaction.transactionId}
										>
											<TableCell>
												{carModels[transaction.carId]}
											</TableCell>
											<TableCell>
												{transaction.amount.toLocaleString(
													"en-US"
												)}
											</TableCell>
											<TableCell>
												{transaction.customerName}
											</TableCell>
											<TableCell>
												{transaction.paymentMethod}
											</TableCell>
											<TableCell>
												{formatDate(transaction.date)}
											</TableCell>
											<TableCell>
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														navigate(
															`/transaction/${transaction.transactionId}`
														)
													}
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
