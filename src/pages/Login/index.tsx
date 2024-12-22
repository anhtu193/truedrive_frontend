import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogInForm from "@/components/LogInForm";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	const { setUser } = useUser();

	const from = location.state?.from?.pathname || "/";

	const handleLogin = async () => {
		try {
			const response = await axios.post(
				"https://localhost:7174/api/auth/login",
				{
					email,
					password,
				}
			);

			if (response.status === 200) {
				setUser(response.data.user);
				localStorage.setItem("token", response.data.token);
				navigate(from, { replace: true });
			} else {
				console.error("Login failed");
			}
		} catch (error) {
			console.error("An error occurred during login:", error);
		}
	};

	return (
		<>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<LogInForm />
				<Footer />
			</div>
			<div>
				<h1>Login</h1>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleLogin}>Login</button>
			</div>
		</>
	);
}
