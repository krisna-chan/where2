import CardSlider from "./reusable/CardsSlider";
import JobFinder from "../assets/images/job-finder.jpg";
import LivelihoodBox from "./reusable/LivelihoodBox";
import { useState, useEffect } from "react";
import WrapperComponent from "./reusable/WrapperComponent";
import { Link } from "react-router-dom";
import LiveLihood from "../assets/images/new_livelihood.png";
import FloatingContact from "./reusable/FloatingContact";

const Livelihood = () => {
	const [isMobile, setIsMobile] = useState(false);


	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const cards = [
		{
			title: "Part-time Job",
			image: "https://i.imgur.com/wNSAnFb.png",
			path: "/list/job",
			alt: "Part-time job",
		},
		{
			title: "Student Loan",
			image: "https://i.imgur.com/nbIan17.png",
			path: "/list/student-loan",
			alt: "Student loan",
		},
		{
			title: "Accommodation",
			image: "https://i.imgur.com/uidTbxO.png",
			alt: "Accommodation",
			path: "/list/accommodation",
		},
	];

	// const hero1 = {
	// 	title: "PURSUE YOUR CAREER.",
	// 	subtitle: "By supporting yourself.",
	// 	backgroundGradient: "from-blue-100",
	// 	titleColor: "text-blue-900",
	// 	subtitleColor: "text-blue-600",
	// 	mainImageSrc: "https://i.imgur.com/x4yB3Xz.png",
	// 	mainImageAlt: "University building",
	// 	button: "Find part time jobs",
	// };

    return (
        <section className="mt-[64px]">
             <WrapperComponent>
                    <div className="flex justify-center bg-white max-w-[1440px] mx-auto">
                            {/* <img src={"https://i.imgur.com/x4yB3Xz.png"} className="object-cover" alt="Hero photo of livelidhood page" /> */}
                            <img src={LiveLihood} className="h-full w-full" alt="Livelihood hero"></img> 
                    </div>
                {/* <Hero props={hero1}/> */}
            </WrapperComponent>
            <div className="flex flex-col align-middle justify-center gap-6 p-6  h-max max-w-[1440px] mx-auto">
                <WrapperComponent>
                <CardSlider cards={cards} header={"Conveniently Self-Supporting"} className="h-fit"/>
                </WrapperComponent>
                <section className="flex gap-x-12 mx-auto mb-[64px]">
                    {isMobile ? null : <div className="flex-1 content-center">
                        <h1 className="text-[#367588] pb-[54px]">Ready to discover how we can help you achieve your academic and financial goal?</h1>
                        <img src={JobFinder} className="rounded-full w-96 h-96" alt="Job finder hero"/>
                    </div>}
                    <div className="flex-1 content-center">
                        <div>
                            <Link to={'/list/job'}>
                                <LivelihoodBox title={"Part Time Job"} content={"Invest in your future. Discover part-time jobs that help fund your education goals."} />
                            </Link>
                            <Link to={'/list/student-loan'}>
                                <LivelihoodBox title={"Student Loan"} content={"Simplify your student loan journey. Explore refinancing options and get personalized advice."} />
                            </Link>
                            <Link to={'/list/accommodation'}>
                                <LivelihoodBox title={"Accommodation"} content={"Enhance your learning experience with the perfect living space. Find accommodations that inspire and support your academic journey."} />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
		<FloatingContact />
        </section>
    );
};

export default Livelihood;
