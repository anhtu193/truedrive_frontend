import { useUser } from "@/context/UserContext";
import AllListing from "@/pages/AllListing";
import AppointmentAdmin from "@/pages/AppointmentAdmin";
import AppointmentDetailAdmin from "@/pages/AppointmentDetailAdmin";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import CarAdmin from "@/pages/CarAdmin";
import CarDetail from "@/pages/CarDetail";
import CarDetailAdmin from "@/pages/CarDetailAdmin";
import Compare from "@/pages/Compare";
import CustomerAppointment from "@/pages/CustomerAppointment";
import EditCarAdmin from "@/pages/EditCarAdmin";
import EditPolicyAdmin from "@/pages/EditPolicyAdmin";
import ListingCatalog from "@/pages/ListingCatalog";
import PolicyAdmin from "@/pages/PolicyAdmin";
import PolicyDetailAdmin from "@/pages/PolicyDetailAdmin";
import SearchResult from "@/pages/SearchResult";
import StatisticAdmin from "@/pages/StatisticAdmin";
import TransactionAdmin from "@/pages/TransactionAdmin";
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

	const adminRoutes = [
		{ path: "/", element: <CarAdmin /> },
		{ path: "car/:id", element: <CarDetailAdmin /> },
		{ path: "car/edit/:id", element: <EditCarAdmin /> },
		{ path: "policy", element: <PolicyAdmin /> },
		{ path: "policy/:id", element: <PolicyDetailAdmin /> },
		{ path: "policy/edit/:id", element: <EditPolicyAdmin /> },
		{ path: "transaction", element: <TransactionAdmin /> },
		{ path: "statistic", element: <StatisticAdmin /> },
		{ path: "appointment", element: <AppointmentAdmin /> },
		{ path: "appointment/:id", element: <AppointmentDetailAdmin /> },
	];

	const routes = user?.role === "Admin" ? adminRoutes : customerRoutes;
	const element = useRoutes(routes);

	return element;
};

export default ProjectRoutes;
