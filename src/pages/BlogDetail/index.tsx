import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { formatDate } from "@/lib/utils";
import { Blog } from "@/types/Blog";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

export default function BlogDetail() {
	const [blog, setBlog] = useState<Blog>();
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();

	async function fetchBlogDetail() {
		try {
			const { data } = await axios.get(
				`https://localhost:7174/api/Blog/${id}`
			);

			setBlog(data);
			console.log(data);
		} catch (error) {
			console.error("Error fetching blog detail:", error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchBlogDetail();
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
				<title>{blog?.title}</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold">{blog?.title}</h1>
					<div className="flex flex-row gap-10 mt-2 text-[#4e4e4f] font-medium">
						<span>{blog?.author}</span>
						<span>{formatDate(blog?.datePublish ?? "")}</span>
					</div>
					<img
						src={blog?.image}
						alt={blog?.title}
						className="w-[700px] h-full self-center rounded-2xl mt-6"
					/>
					<p className="prose prose-lg w-[700px] h-fit self-center whitespace-pre-line mt-4 ">
						<ReactMarkdown>{blog?.content}</ReactMarkdown>
					</p>
				</div>
				<Footer />
			</div>
		</>
	);
}
