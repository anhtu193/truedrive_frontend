import BlogItem from "@/components/BlogItem";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Blog } from "@/types/Blog";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

export default function BlogPage() {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchBlogs() {
			try {
				const { data } = await axios.get(
					`https://localhost:7174/api/Blog`
				);

				setBlogs(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching blogs:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchBlogs();
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
				<title>
					Blogs - Get the latest News and Trends in the Auto Industry
				</title>
				<meta
					name="description"
					content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
				/>
			</Helmet>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<div className="mt-[76px] flex flex-col h-fit bg-white rounded-[50px] px-[130px] py-[70px]">
					<h1 className="text-[30px] font-bold">Blogs</h1>
					<span className="mt-1">
						Get the latest News and Trends in the Auto Industry
					</span>
					<div className="flex gap-7 flex-wrap h-fit py-12">
						{blogs.map((blog) => (
							<BlogItem
								blog={blog}
								key={blog.blogId}
							/>
						))}
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
