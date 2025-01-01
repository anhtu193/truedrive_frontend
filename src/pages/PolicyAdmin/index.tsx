import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
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
import { toast } from "@/hooks/use-toast";
import { cn, formatDate } from "@/lib/utils";
import { Policy } from "@/types/Policy";
import axios from "axios";
import {
	CalendarDays,
	CircleCheckBig,
	Edit,
	LetterText,
	Search,
	SquareArrowOutUpRight,
	Trash,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function PolicyAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [policies, setPolicies] = useState<Policy[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(
		null
	);

	const handleDelete = async () => {
		if (selectedPolicyId === null) return;

		try {
			const response = await axios.delete(
				`https://localhost:7174/api/Policy/${selectedPolicyId}`
			);

			if (response.status === 204) {
				setPolicies((prevPolicies) =>
					prevPolicies.filter(
						(policy) => policy.policyId !== selectedPolicyId
					)
				);
				setIsDeleteDialogOpen(false);
				toast({ title: "Delete policy successfully!" });
			} else {
				console.error("Failed to delete policy");
				toast({ title: "Failed to delete policy!" });
			}
		} catch (error) {
			console.error(
				"An error occurred while deleting the policy:",
				error
			);
		}
	};

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
	}, []);

	useEffect(() => {
		async function fetchPolicies() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Policy"
				);
				setPolicies(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching policies:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchPolicies();
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
				<title>Policy</title>
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
						<h1 className="text-[30px] font-bold">Policy</h1>
						<div className="max-h-[500px] mt-2 overflow-y-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<LetterText size={15} /> Policy
												Name
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CalendarDays size={15} />{" "}
												Effective Date
											</div>
										</TableHead>
										<TableHead>
											<div className="flex flex-row gap-2 text-[15px] items-center">
												<CalendarDays size={15} /> Last
												Updated
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
									{policies.map((policy) => (
										<TableRow key={policy.policyId}>
											<TableCell>
												{policy.policyName}
											</TableCell>
											<TableCell>
												{formatDate(
													policy.effectiveDate
												)}
											</TableCell>
											<TableCell>
												{formatDate(policy.lastUpdated)}
											</TableCell>
											<TableCell
												className={`${cn({
													"text-[#FF0000] font-medium":
														policy.status ===
														"Inactive",
													"text-[#00ff00] font-medium":
														policy.status ===
														"Active",
												})}`}
											>
												{policy.status}
											</TableCell>

											<TableCell>
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														navigate(
															`/policy/${policy.policyId}`
														)
													}
												>
													<Search />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() =>
														navigate(
															`/policy/edit/${policy?.policyId}`
														)
													}
												>
													<Edit />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => {
														setSelectedPolicyId(
															policy.policyId
														);
														setIsDeleteDialogOpen(
															true
														);
													}}
												>
													<Trash />
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
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Policy</DialogTitle>
					</DialogHeader>
					<p className="text-center">
						Are you sure you want to delete this policy?
						<br />
						You can change this policy status into{" "}
						<span className="font-semibold text-[#FF0000]">
							Inactive
						</span>{" "}
						instead.
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							No
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
						>
							Yes, Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
