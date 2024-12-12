import { useRoutes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const ProjectRoutes = () => {
	let element = useRoutes([
		{ path: "/", element: <Home /> },
		{ path: "*", element: <NotFound /> },
		{ path: "login", element: <Login /> },
	]);

	return element;
};

export default ProjectRoutes;
