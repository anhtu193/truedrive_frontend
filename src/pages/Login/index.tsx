import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogInForm from "@/components/LogInForm";
import { Helmet } from "react-helmet";

export default function Login() {
	return (
		<>
			<div className="bg-[#050B20] w-full h-fit ">
				<Header />
				<LogInForm />
				<Footer />
			</div>
		</>
	);
}
