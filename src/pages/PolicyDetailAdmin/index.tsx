import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Policy } from "@/types/Policy";
import axios from "axios";
import { Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

export default function PolicyDetailAdmin() {
	const [height, setHeight] = useState<string>("auto");
	const contentRef = useRef<HTMLDivElement>(null);
	const [policy, setPolicy] = useState<Policy>();
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	async function getPolicyById() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Policy/${id}`
			);

			setPolicy(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching car:", error);
		} finally {
			setIsLoading(false);
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
				<title>{policy?.policyName}</title>
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
							<div className="flex flex-row items-center gap-2">
								<h1 className="text-[30px] font-bold">
									{policy?.policyName}
								</h1>
								<Edit
									size={32}
									className="cursor-pointer"
									onClick={() =>
										navigate(
											`/policy/edit/${policy?.policyId}`
										)
									}
								/>
							</div>
							<div className="flex flex-row gap-1">
								<span className="font-semibold">Status:</span>
								<span
									className={`${cn({
										"text-[#FF0000] font-medium":
											policy?.status === "Inactive",
										"text-[#00ff00] font-medium":
											policy?.status === "Active",
									})}`}
								>
									{policy?.status}
								</span>
							</div>
						</div>
						<div className="flex flex-row justify-between items-end mt-3">
							<div className="flex flex-row gap-1">
								<span className="font-semibold">
									Last Updated:
								</span>
								<span className="font-medium">
									{formatDate(policy?.lastUpdated || "")}
								</span>
							</div>
							<div className="flex flex-row gap-1">
								<span className="font-semibold">
									Effective Date:
								</span>
								<span className="font-medium">
									{formatDate(policy?.effectiveDate || "")}
								</span>
							</div>
						</div>
						<p className="whitespace-pre-line mt-4 ">
							{policy?.content}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
