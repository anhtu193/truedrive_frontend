import { useUser } from "@/context/UserContext";
import AllListing from "@/pages/AllListing";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import CarAdmin from "@/pages/CarAdmin";
import CarDetail from "@/pages/CarDetail";
import Compare from "@/pages/Compare";
import CustomerAppointment from "@/pages/CustomerAppointment";
import ListingCatalog from "@/pages/ListingCatalog";
import SearchResult from "@/pages/SearchResult";
import Wishlist from "@/pages/Wishlist";
import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./styles/font.css";
import "./styles/index.css";
import "./styles/tailwind.css";

const ProjectRoutes = () => {
	const { user } = useUser();

	const customerRoutes = [
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
		{ path: "my-appointment", element: <CustomerAppointment /> },
		{ path: "wishlist", element: <Wishlist /> },
	];

	const adminRoutes = [{ path: "/", element: <CarAdmin /> }];

	const routes = user?.role === "Admin" ? adminRoutes : customerRoutes;
	const element = useRoutes(routes);

	return element;
};

export default ProjectRoutes;
