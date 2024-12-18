import { Separator } from "@/components/ui/separator";
import { Catalog } from "@/types/Catalog";
import { Make } from "@/types/Make";
import { Policy } from "@/types/Policy";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Footer() {
	const [makes, setMakes] = useState<Make[]>([]);
	const [catalogs, setCatalogs] = useState<Catalog[]>([]);
	const [policies, setPolicies] = useState<Policy[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchMakes() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Make"
				);
				setMakes(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching make:", error);
			} finally {
				setIsLoading(false);
			}
		}
		async function fetchCatalogs() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Catalog"
				);
				setCatalogs(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching catalogs:", error);
			} finally {
				setIsLoading(false); // Set loading to false after fetching data
			}
		}
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

		fetchCatalogs();
		fetchMakes();
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
		<div className="w-full h-fit bg-[#050B20] flex flex-col text-white">
			<div className="flex flex-row my-10 justify-between  px-[180px]">
				<div className="flex flex-col text-[14px] gap-3">
					<h4 className="text-[16px] font-semibold cursor-default">
						Company
					</h4>
					<span className="cursor-pointer">About us</span>
					<span className="cursor-pointer">Blog</span>
					<span className="cursor-pointer">Services</span>
					<span className="cursor-pointer">FAQs</span>
					<span className="cursor-pointer">Contact us</span>
				</div>
				<div className="flex flex-col text-[14px] gap-3">
					<h4 className="text-[16px] font-semibold cursor-default">
						Showroom Policy
					</h4>
					{policies.map((policy) => (
						<span
							className="cursor-pointer"
							key={policy.policyId}
						>
							{policy.policyName}
						</span>
					))}
				</div>
				<div className="flex flex-col text-[14px] gap-3">
					<h4 className="text-[16px] font-semibold cursor-default">
						Our Brands
					</h4>
					{makes.map((make) => (
						<span
							className="cursor-default"
							key={make.makeId}
						>
							{make.makeName}
						</span>
					))}
				</div>
				<div className="flex flex-col text-[14px] gap-3">
					<h4 className="text-[16px] font-semibold cursor-default">
						Vehicle Types
					</h4>
					{catalogs.map((catalog) => (
						<span
							className="cursor-default"
							key={catalog.catalogId}
						>
							{catalog.catalogName}
						</span>
					))}
				</div>
				<div className="flex flex-col text-[14px] gap-3">
					<h4 className="text-[16px] mb-2 font-semibold cursor-default">
						Our Mobile App
					</h4>
					<img
						src="/images/apple_store.png"
						alt="apple-store"
						className="h-[50px] cursor-pointer"
					/>
					<img
						src="/images/google_play.png"
						alt="apple-store"
						className="h-[50px] cursor-pointer"
					/>
					<h4 className="text-[16px] mt-2 font-semibold cursor-default">
						Connect With Us
					</h4>
					<div className="flex flex-row -ml-3">
						<img
							src="images/facebook.svg"
							alt="facebook"
							className="cursor-pointer"
						/>
						<img
							src="images/twitter.svg"
							alt="twitter"
							className="cursor-pointer"
						/>
						<img
							src="images/instagram.svg"
							alt="instagram"
							className="cursor-pointer"
						/>
						<img
							src="images/linkedin.svg"
							alt="linkedin"
							className="cursor-pointer"
						/>
					</div>
				</div>
			</div>
			<Separator className="opacity-10" />
			<div className="h-fit flex flex-row px-[180px] justify-between text-[14px] my-5">
				<span>© 2024 TrueDrive.com ∙ All rights reserved.</span>
				<span>Terms & Conditions ∙ Privacy Notice</span>
			</div>
		</div>
	);
}
