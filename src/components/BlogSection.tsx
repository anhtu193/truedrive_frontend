import BlogItem from "@/components/BlogItem";
import { Blog } from "@/types/Blog";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function BlogSection() {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchBlogs() {
			try {
				const { data } = await axios.get(
					"https://localhost:7174/api/Blog",
					{
						params: { limit: 3 },
					}
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
		<div className="flex flex-col w-full h-[300px] mt-[75px] px-[130px]">
			<div className="flex flex-row justify-between w-full h-fit">
				<h2 className="text-[28px] font-bold text-black-900">
					Latest Blog Posts
				</h2>
				<div className="flex flex-row gap-2 mt-3 cursor-pointer">
					<span className="text-[15px] font-medium text-black-900">
						View all
					</span>
					<img
						src="images/img_arrow_left.svg"
						alt="Left Arrow Image"
						className="h-[14px]"
					/>
				</div>
			</div>
			<div className="flex flex-row justify-between w-full h-fit mt-6 gap-2">
				{blogs.map((blog) => (
					<BlogItem
						blog={blog}
						key={blog.blogId}
					/>
				))}
			</div>
		</div>
	);
}
