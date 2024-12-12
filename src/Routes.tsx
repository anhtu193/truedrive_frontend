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
	]);

	return element;
};

export default ProjectRoutes;
