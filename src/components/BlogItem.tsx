import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Blog } from "@/types/Blog";
import React from "react";
import { Link } from "react-router-dom";

export default function BlogItem({ blog }: { blog: Blog }) {
	return (
		<Link to={`/blog/${blog.blogId}`}>
			<Card className="w-[400px] h-fit border-none shadow-none cursor-pointer">
				<CardContent className="p-0">
					<img
						src={blog.image}
						alt={blog.title}
						className="object-cover h-[267px] rounded-xl"
					/>
					<p className="text-base mt-3">
						{formatDate(blog.datePublish)}
					</p>
					<p className="font-medium text-[20px] mt-3">{blog.title}</p>
				</CardContent>
			</Card>
		</Link>
	);
}
