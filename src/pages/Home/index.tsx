import React from "react";
import { useUser } from "../../context/UserContext";

export default function Home() {
	const user = useUser();
	return (
		<>{user == null ? <p>Loading...</p> : <p>{user.user?.fullName}</p>}</>
	);
}
