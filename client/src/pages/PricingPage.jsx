import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

const PricingPage = () => {
    // Language state (default: English)
    const [isEnglish, setIsEnglish] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    const navigate = useNavigate();



    // Pricing plans
    const pricingPlans = [
        {
            name: { en: "Basic", hi: "बेसिक" },
            price: "₹100",
            planType: "1 month",
            features: {
                en: ["List your shop", "Close/Open anytime", "Basic support"],
                hi: ["अपनी दुकान सूचीबद्ध करें", "कभी भी बंद/खोलें", "बेसिक समर्थन"],
            },
        },
        {
            name: { en: "Premium", hi: "प्रीमियम" },
            price: "₹499",
            planType: "6 months",
            features: {
                en: [
                    "All Basic features",
                    "Create discount offers",
                    "Better visibility",
                ],
                hi: [
                    "सभी बेसिक सुविधाएँ",
                    "डिस्काउंट ऑफर बनाएँ",
                    "बेहतर दृश्यता",
                ],
            },
        },
        {
            name: { en: "Super Premium", hi: "सुपर प्रीमियम" },
            price: "₹999",
            planType: "1 year",
            features: {
                en: [
                    "All Premium features",
                    "Priority support",
                    "Business growth guidance",
                ],
                hi: [
                    "सभी प्रीमियम सुविधाएँ",
                    "प्राथमिकता समर्थन",
                    "व्यापार वृद्धि मार्गदर्शन",
                ],
            },
        },
    ];

    const handlePricingRequest = async (pricing, planType, planName) => {

        if (currentUser && currentUser._id) {

            // Implement your pricing request logic here
            // console.log("Pricing request submitted", price, planType, planName);
            try {
                await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/main/pricing-request`, { userId: currentUser._id, userMobile: currentUser.mobileNum, userName: currentUser.username, pricing, planType, planName }).then(async (res) => {
                    if (res.data) {
                        alert(res.data.message)
                        // console.log(res.data)
                        // dispatchEvent(userCodeSet(res.data))
                        // setUserCode(res.data)
                        // setShops([])

                    }
                })
            } catch (err) {
                alert("Error", err.response.data.message);
            }
        } else {
            navigate("/auth-user")
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

            <SEO
                title="Affordable Listing Plans - Monthly & Yearly | OfflineGo"
                description="Choose the best subscription plan for listing your shop on OfflineGo. Get more visibility with our monthly and yearly pricing options."
                keywords="listing plans, shop subscription, monthly pricing, yearly subscription, OfflineGo pricing"
                ogImage="https://offlinego.in/store.png"
                url="https://offlinego.in/price-user"
            />
            {/* Language Toggle */}
            <div className="mb-6 flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-700">
                    {isEnglish ? "English" : "हिन्दी"}
                </span>
                <div
                    className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-all duration-300 ${isEnglish ? "justify-start" : "justify-end bg-green-500"
                        }`}
                    onClick={() => setIsEnglish(!isEnglish)}
                >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md transition-all"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    {isEnglish ? "Why Choose Us?" : "हमें क्यों चुनें?"}
                </h2>
                <p className="text-gray-600 text-left leading-relaxed">
                    {isEnglish
                        ? "You can list your shop, close or open your shop anytime. We support local businesses to grow by creating job opportunities and building relationships with shopkeepers. We help customers with immediate purchases, easy returns, and better discounts."
                        : "आप अपनी दुकान सूचीबद्ध कर सकते हैं, कभी भी बंद या खोल सकते हैं। हम स्थानीय व्यवसायों को बढ़ने में मदद करते हैं, रोजगार के अवसर बनाते हैं और दुकानदारों से संबंध बनाते हैं। हम ग्राहकों को तुरंत खरीदारी, आसान रिटर्न और बेहतर छूट में सहायता करते हैं।"}
                </p>
            </div>

            {/* Pricing Section */}
            <div className="mt-8  grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, index) => (
                    <div
                        key={index}
                        className="bg-white overflow-hidden rounded-[20px] shadow-lg  text-center"
                    >
                        <h3 className="text-xl sm:text-2xl p-4 border-b  font-semibold text-white  bg-blue-500">
                            {isEnglish ? plan.name.en : plan.name.hi}
                        </h3>
                        <p className="text-2xl sm:text-4xl  font-bold text-blue-600 mt-4">
                            {plan.price}<span className="text-sm font-semibold text-gray-500">
                                ,{plan.planType}
                            </span>
                        </p>
                        <ul className="mt-4 text-left p-6 space-y-2">
                            {plan.features[isEnglish ? "en" : "hi"].map((feature, idx) => (
                                <li key={idx} className="text-gray-600">
                                    ✔ {feature}
                                </li>
                            ))}
                        </ul>
                        <button type="button" onClick={() => handlePricingRequest(plan.price, plan.planType, plan.name.en)} className="my-6 p-6  bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all">
                            {isEnglish ? "Send Request" : "शुरू करें"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPage;
