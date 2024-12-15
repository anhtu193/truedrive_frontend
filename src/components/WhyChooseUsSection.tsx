const financeOffersList = [
	{
		offerImage: "images/img_f1_svg_fill.svg",
		offerTitle: "Special Financing Offers",
		offerDescription:
			"Our stress-free finance department that can find financial solutions to save you money.",
	},
	{
		offerImage: "images/img_f2_svg.svg",
		offerTitle: "Trusted Car Dealership",
		offerDescription:
			"Our stress-free finance department that can find financial solutions to save you money.",
	},
	{
		offerImage: "images/img_f3_svg.svg",
		offerTitle: "Transparent Pricing",
		offerDescription:
			"Our stress-free finance department that can find financial solutions to save you money.",
	},
	{
		offerImage: "images/img_thumbs_up.svg",
		offerTitle: "Expert Car Service",
		offerDescription:
			"Our stress-free finance department that can find financial solutions to save you money.",
	},
];

export default function WhyChooseUsSection() {
	return (
		<div className="flex flex-col w-full h-[300px] my-[30px] px-[130px]">
			<div className="flex flex-row justify-between w-full h-fit cursor-pointer">
				<h2 className="text-[28px] font-bold text-black-900">
					Why Choose Us?
				</h2>
			</div>
			<div className="flex flex-row mt-12 gap-16">
				{financeOffersList.map((d, index) => (
					<div
						className="flex flex-col w-[320px]"
						key={index}
					>
						<img
							src={d.offerImage}
							alt="Special Financing Offers"
							className="w-[60px] h-[60px]"
						/>
						<h3 className="mt-[26px] text-[18px] font-medium text-black-900">
							{d.offerTitle}
						</h3>
						<p className="mt-2 text-[14px] font-normal leading-[27px] text-black-900">
							{d.offerDescription}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
