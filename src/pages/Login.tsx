import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const { setUser } = useUser();
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);

		try {
			const response = await axios.post(
				"https://localhost:7174/api/Auth/login",
				{
					email: email,
					password: password,
				}
			);

			if (response.status === 200) {
				const data = response.data;
				console.log("Login successful:", data);
				// Store the JWT token in local storage or a cookie
				localStorage.setItem("token", data.token);
				console.log("Token stored:", data.token);
				console.log("User:", data.user);
				setUser(data.user);
				navigate("/");
			} else {
				console.error("Login failed:", response.statusText);
				setError("Login failed. Please check your credentials.");
			}
		} catch (error: any) {
			if (error.response && error.response.status === 400) {
				setError("Invalid email or password.");
			} else {
				setError("An error occurred during login. Please try again.");
			}
			console.error("Login error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="password">Password:</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit">Login</button>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</form>
	);
};

export default Login;
