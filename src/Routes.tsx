import AllListing from "@/pages/AllListing";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import CarDetail from "@/pages/CarDetail";
import Compare from "@/pages/Compare";
import ListingCatalog from "@/pages/ListingCatalog";
import SearchResult from "@/pages/SearchResult";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./styles/font.css";
import "./styles/index.css";
import "./styles/tailwind.css";

const ProjectRoutes = () => {
	let element = useRoutes([
		{ path: "/", element: <Home /> },
		{ path: "*", element: <NotFound /> },
		{ path: "login", element: <Login /> },
		{ path: "car/:id", element: <CarDetail /> },
		{ path: "blog/:id", element: <BlogDetail /> },
		{ path: "search", element: <SearchResult /> },
		{ path: "listing/:id", element: <ListingCatalog /> },
		{ path: "listing", element: <AllListing /> },
		{ path: "blogs", element: <Blog /> },
		{ path: "compare", element: <Compare /> },
	]);

	return element;
};

export default ProjectRoutes;
