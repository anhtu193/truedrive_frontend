import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LogInForm() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const { user, setUser } = useUser();
	const navigate = useNavigate();
	const [tab, setTab] = useState("1");

	const [fullName, setFullName] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [registerEmail, setRegisterEmail] = useState<string>("");
	const [registerPassword, setRegisterPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [registerError, setRegisterError] = useState<string | null>(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, [setUser]);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
		setTab(newValue);
	};

	const handleLogin = async (event: React.FormEvent) => {
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
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
				setUser(data.user);
				navigate("/");
			} else {
				setError("Login failed. Please check your credentials.");
			}
		} catch (error: any) {
			if (error.response && error.response.status === 400) {
				setError("Invalid email or password.");
			} else {
				setError("An error occurred during login. Please try again.");
			}
		}
	};

	const handleRegister = async (event: React.FormEvent) => {
		event.preventDefault();
		setRegisterError(null);

		if (registerPassword !== confirmPassword) {
			setRegisterError("Passwords do not match.");
			return;
		}

		try {
			const response = await axios.post(
				"https://localhost:7174/api/Auth/register",
				{
					fullName,
					address,
					phoneNumber,
					email: registerEmail,
					password: registerPassword,
				}
			);

			if (response.status === 200) {
				const data = response.data;
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));
				setUser(data.user);
				navigate("/");
			} else {
				setRegisterError("Registration failed. Please try again.");
			}
		} catch (error: any) {
			if (error.response && error.response.status === 400) {
				setRegisterError("Invalid email or password.");
			} else {
				setRegisterError(
					"An error occurred during registration. Please try again."
				);
			}
		}
	};

	return (
		<>
			{tab === "1" ? (
				<Helmet>
					<title>Sign in</title>
					<meta
						name="description"
						content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
					/>
				</Helmet>
			) : (
				<Helmet>
					<title>Sign up</title>
					<meta
						name="description"
						content="Discover your perfect car with our extensive listings. From SUVs to Sedans, find the best deals on the latest models and premium makes like Audi, BMW, and Ford. Start your search now!"
					/>
				</Helmet>
			)}
			<div className="mt-[76px] flex flex-col h-fit items-center bg-white rounded-[50px] px-[130px] py-[70px]">
				<TabContext value={tab}>
					<Box
						sx={{
							borderBottom: 1,
							borderColor: "divider",
							width: 500,
						}}
					>
						<TabList
							onChange={handleChangeTab}
							aria-label="lab API tabs example"
						>
							<Tab
								label="Sign In"
								value="1"
							/>
							<Tab
								label="Sign Up"
								value="2"
							/>
						</TabList>
					</Box>
					<TabPanel
						className="w-[500px] h-fit"
						value="1"
					>
						<form onSubmit={handleLogin}>
							<div className="mb-3">
								<Label htmlFor="email">Email</Label>
								<Input
									className="mt-2"
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder="Type your email"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="password">Password</Label>
								<Input
									className="mt-2"
									type="password"
									id="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									placeholder="Type your password"
								/>
							</div>
							<div className="flex flex-row justify-between">
								<div className="flex items-center space-x-2">
									<Checkbox id="remember" />
									<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										Keep me signed in
									</label>
								</div>
								<span className="text-[#405FF2] underline cursor-pointer font-medium text-[15px]">
									Forgot your password?
								</span>
							</div>
							<Button
								className="mt-7 w-full bg-[#405FF2] hover:bg-[#6880f8] text-[15px] rounded-2xl py-7 font-medium"
								type="submit"
							>
								Sign in <ExternalLink />
							</Button>
							{error && (
								<p className="text-red-500 mt-2">{error}</p>
							)}
						</form>
					</TabPanel>
					<TabPanel
						className="w-[500px] h-fit"
						value="2"
					>
						<form onSubmit={handleRegister}>
							<div className="mb-4">
								<Label htmlFor="fullName">Full Name</Label>
								<Input
									className="mt-2"
									type="text"
									id="fullName"
									value={fullName}
									onChange={(e) =>
										setFullName(e.target.value)
									}
									required
									placeholder="Type your full name"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="address">Address</Label>
								<Input
									className="mt-2"
									type="text"
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									required
									placeholder="Type your address"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="phoneNumber">
									Phone Number
								</Label>
								<Input
									className="mt-2"
									type="text"
									id="phoneNumber"
									value={phoneNumber}
									onChange={(e) =>
										setPhoneNumber(e.target.value)
									}
									required
									placeholder="Type your number"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="registerEmail">Email</Label>
								<Input
									className="mt-2"
									type="email"
									id="registerEmail"
									value={registerEmail}
									onChange={(e) =>
										setRegisterEmail(e.target.value)
									}
									required
									placeholder="Type your email"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="registerPassword">
									Password
								</Label>
								<Input
									className="mt-2"
									type="password"
									id="registerPassword"
									value={registerPassword}
									onChange={(e) =>
										setRegisterPassword(e.target.value)
									}
									required
									placeholder="Type your password"
								/>
							</div>
							<div className="mb-4">
								<Label htmlFor="confirmPassword">
									Confirm Password
								</Label>
								<Input
									className="mt-2"
									type="password"
									id="confirmPassword"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
									placeholder="Confirm your password"
								/>
							</div>
							<Button
								className="mt-4 w-full bg-[#405FF2] hover:bg-[#6880f8] text-[15px] rounded-2xl py-7 font-medium"
								type="submit"
							>
								Sign up <ExternalLink />
							</Button>
							{registerError && (
								<p className="text-red-500 mt-2">
									{registerError}
								</p>
							)}
						</form>
					</TabPanel>
				</TabContext>
			</div>
		</>
	);
}
