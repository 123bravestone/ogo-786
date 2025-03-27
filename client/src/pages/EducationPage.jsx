import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { allTopics } from "../data/educationTopics.js";
import { motion } from "framer-motion";
import "./EducationPage.css"; // Import styles for animation

// const topics = [
//     { id: 1, title: "Customer Engagement", content: "Provide excellent in-store service, personalized recommendations, and loyalty programs." },
//     { id: 2, title: "Attractive Offers", content: "Run special discounts, festive sales, and membership programs to attract customers." },
//     { id: 3, title: "Quick Service", content: "Ensure fast billing, home delivery options, and pre-order services for convenience." },
//     { id: 4, title: "Digital Payments", content: "Accept UPI, cards, and mobile wallets for seamless transactions." },
//     { id: 5, title: "Social Media Marketing", content: "Promote your shop on WhatsApp, Facebook, and Instagram to increase reach." },
//     
// ];

const EducationPage = () => {
    const [openTopic, setOpenTopic] = useState(null);
    const [openAction, setOpenAction] = useState(null);
    const [language, setLanguage] = useState("en");
    const [visibleSections, setVisibleSections] = useState([]);
    const [visibleWords, setVisibleWords] = useState({}); // Track words displayed per topic


    // Toggle collapsible section
    const toggleTopic = (id) => {
        setOpenTopic(openTopic === id ? null : id);
        setVisibleWords((prevState) => ({ ...prevState, [id]: 20 }));
    };
    const toggleAction = (id) => {
        setOpenAction(openAction === id ? null : id);
        setVisibleWords((prevState) => ({ ...prevState, [id]: 20 }));
    };

    // Toggle language
    const toggleLanguage = () => {
        setLanguage(language === "en" ? "hi" : "en");
    };

    // Scroll animation effect
    useEffect(() => {

        const handleScroll = () => {
            const sections = document.querySelectorAll(".content-section");
            let newVisibleSections = [];

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95 && rect.bottom > 50) {
                    newVisibleSections.push(section.dataset.id);
                }
            });

            setVisibleSections(newVisibleSections);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Function to handle "Show More" button click
    const handleShowMore = (topicId, fullContent) => {
        setVisibleWords((prevState) => {
            const currentCount = prevState[topicId] || 20; // Default first 80 words
            const newCount = currentCount + 20; // Show next 80 words
            return { ...prevState, [topicId]: newCount };
        });
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto bg-white  p-6 shadow-md">
                {/* Language Toggle */}
                <div className=" flex justify-end">
                    <button
                        // onClick={toggleLanguage}
                        className="fixed px-4 py-2 text-white bg-blue-500 rounded-lg text-[12px] shadow-md z-10"
                    >
                        {language === "en" ? "हिन्दी में पढ़ें" : "English"}
                    </button>
                </div>

                {/* Page Title */}
                <h1 className="text-[20px] sm:text-4xl  mt-[46px] font-bold text-gray-800 text-center border-b-2 my-4">
                    {language === "en"
                        ? "📢 How to Compete with Online E-Commerce & Grow Your Local Shop Business"
                        : "ऑनलाइन व्यवसायों से कैसे प्रतिस्पर्धा करें?"}
                </h1>

                {/* Topics Section */}
                {allTopics.map((topics, idx) => ( // Loop over allTopics topics &&
                    <div key={idx} >
                        <h1 className="text-2xl font-bold text-gray-800 text-center my-4">
                            {idx + 1}.{topics.topTitle[language]}
                        </h1>


                        <motion.div

                            className={`content-section  transition-all duration-500 ${visibleSections.includes(topics.id.toString()) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                                }`}
                            data-id={topics.id}
                        >

                            {/* <div>{topic.icon}</div> */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">

                                <div onClick={() => toggleTopic(topics.id)} className="flex justify-between items-center  cursor-pointer">
                                    <h2 className="text-lg font-semibold py-4 text-blue-600 mt-0">{topics.title[language]}</h2>

                                    {openTopic === topics.id ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                {openTopic === topics.id && (
                                    <div>
                                        <p className="text-slate-700 font-bold text-[16px]">{topics.content[language]}</p>

                                        {
                                            topics.points.map((point, index) => {


                                                return (



                                                    <p key={index} className="mt-2 text-gray-700">
                                                        {point[language]}
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <div onClick={() => toggleAction(topics.id)} className="flex justify-between items-center   cursor-pointer">
                                    <h2 className="text-lg font-semibold text-blue-600">{topics.action[language]}</h2>

                                    {openAction === topics.id ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                                {openAction === topics.id && (
                                    topics.actPoints.map((act, index) => {


                                        return (



                                            <p key={index} className="mt-2 p-2 text-gray-700">
                                                {act[language]}
                                            </p>
                                        )
                                    })


                                )}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationPage;
