import { Make } from "../types/Make";

export default function MakeItem({ make }: { make: Make }) {
	return (
		<div className="flex flex-col items-center justify-center w-[16%] md:w-full gap-0.5 p-6 sm:p-4 border-gray-200_01 border border-solid bg-white-a700 rounded-[16px]">
			<img
				src={make.logo}
				className="h-[100px] w-[62%] object-contain"
				alt={`${make.makeId} logo`}
			/>
			<h2 className="text-[18px] font-medium text-black-900">
				{make.makeName}
			</h2>
		</div>
	);
}
