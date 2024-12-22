import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(dateString).toLocaleDateString("en-US", options);
}

export function generateTimeOptions() {
	const times = [];
	for (let hour = 8; hour <= 17; hour++) {
		for (let minutes = 0; minutes < 60; minutes += 30) {
			const time = `${hour.toString().padStart(2, "0")}:${minutes
				.toString()
				.padStart(2, "0")}`;
			times.push(time);
		}
	}
	return times;
}
