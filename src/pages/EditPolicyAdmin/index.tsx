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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn, formatDate } from "@/lib/utils";
import { Policy } from "@/types/Policy";
import axios from "axios";
import { Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

const policyStatus = ["Active", "Inactive"];

export default function EditPolicyAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [policy, setPolicy] = useState<Policy>();
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [selectedName, setSelectedName] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [selectedContent, setSelectedContent] = useState<string>("");

	async function getPolicyById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Policy/${id}`
			);

			setPolicy(data);
			console.log(data);

			setSelectedName(data.policyName);
			setSelectedStatus(data.status);
			setSelectedContent(data.content);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function savePolicy() {
		try {
			const policyData = {
				policyId: policy?.policyId,
				policyName: selectedName,
				content: selectedContent,
				status: selectedStatus,
				effectiveDate: policy?.effectiveDate,
				lastUpdated: new Date().toISOString(), // Set to current date and time
			};

			await axios.put(
				`https://localhost:7174/api/Policy/${id}`,
				policyData
			);

			console.log("Policy details saved successfully");
			navigate("/policy");
			toast({ title: "Save policy successfully!" });
		} catch (error) {
			console.error("Error saving policy details:", error);
		}
	}

	useEffect(() => {
		if (contentRef.current) {
			setHeight(`${contentRef.current.clientHeight}px`);
		}
		getPolicyById();
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
				<title>Edit Policy</title>
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
						<div className="flex flex-row justify-between items-end">
							<h2 className="text-[20px] font-semibold">
								Policy Name
							</h2>
							<div className="flex flex-row gap-6">
								<Button
									className="w-fit border-[#2563EB] text-[#2563EB] hover:text-[#2563EB] border-2 px-8 py-6 rounded-2xl"
									variant="outline"
									onClick={() => {
										navigate(-1);
									}}
								>
									Cancel
								</Button>
								<Button
									className="bg-[#2563EB] w-fit hover:bg-[#5083f2] px-8 py-6 rounded-2xl"
									onClick={savePolicy}
								>
									Save changes
								</Button>
							</div>
						</div>
						<Input
							value={selectedName}
							placeholder="Type in year"
							inputMode="text"
							className="mt-3 w-[700px]"
							onChange={(e) => setSelectedName(e.target.value)}
						/>
						<div className="flex flex-row justify-between mt-3 items-end">
							<h2 className="text-[20px] font-semibold">
								Policy Content
							</h2>
							<div className="flex flex-row items-center gap-5 w-[280px]">
								<span>Status:</span>
								<Select
									onValueChange={(value) => {
										setSelectedStatus(value);
									}}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={selectedStatus}
										/>
									</SelectTrigger>
									<SelectContent>
										{policyStatus.map((status, index) => (
											<SelectItem
												value={status}
												key={index}
											>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<Textarea
							className="mt-3"
							placeholder="A brief description of this car"
							rows={20}
							value={selectedContent}
							onChange={(e) => setSelectedContent(e.target.value)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
