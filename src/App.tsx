import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { UserProvider } from "./context/UserContext";

function App() {
	return (
		<UserProvider>
			<Router>
				<Toaster />
				<Routes />
			</Router>
		</UserProvider>
	);
}

export default App;
