import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";

const PriceRequest = () => {
    const [requests, setRequests] = useState([]);
    const [showPending, setShowPending] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [ID, setID] = useState('');

    const params = useParams();

    useEffect(() => {
        // console.log()

        fetchRequests();
        window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
        return () =>
            window.removeEventListener("resize", () =>
                setWindowWidth(window.innerWidth)
            );
    }, [params.userId, showPending]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/main/all-requests/${params.userId}`);
            // console.log(res.data)
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const approveRequest = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/main/user-request/approve/${id}/${params.userId}`);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteRequest = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/main/user-request/delete/${ID}/${params.userId} `);
            setIsAlertOpen(false);
            fetchRequests();
        } catch (err) {
            setIsAlertOpen(false);
            console.error(err);
        }
    };


    const pendingRequests = requests.filter((req) => req.status === "pending");
    const approvedRequests = requests.filter((req) => req.status === "approved");
    const requestStats = {
        labels: ["Pending", "Approved"],
        datasets: [
            {
                label: "User Requests",
                data: [pendingRequests.length, approvedRequests.length],
                backgroundColor: ["#FF6384", "#36A2EB"],
            },
        ],
    };
    const fetchExpireDate = () => {
        const today = new Date();

        const updatedUsers = approvedRequests.map((user) => {

            const startDate = new Date(user.approvedTime);
            let expirationDate = new Date(startDate);

            // Calculate expiration date based on plan type
            if (user.planType === "1 month") {
                expirationDate.setMonth(startDate.getMonth() + 1);
            } else if (user.planType === "6 months") {
                expirationDate.setMonth(startDate.getMonth() + 6);
            } else if (user.planType === "1 year") {
                expirationDate.setFullYear(startDate.getFullYear() + 1);
            }

            // Calculate remaining days and months
            const remainingTime = expirationDate - today;
            const daysLeft = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const monthsLeft = Math.floor(daysLeft / 30);

            return {
                ...user,
                daysLeft: daysLeft > 0 ? daysLeft : 0,
                monthsLeft: monthsLeft > 0 ? monthsLeft : 0,
            };
        });

        // Sort users by nearest expiration
        updatedUsers.sort((a, b) => a.daysLeft - b.daysLeft);
        setUserSubscriptions(updatedUsers);
    };

    useEffect(() => {
        if (approvedRequests.length > 0) {
            fetchExpireDate();
        }
    }, [approvedRequests.length > 0]);





    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Toggle Statistics Button */}
            <div className="text-center mb-4">
                <button
                    className={`px-4 py-2 rounded ${showStats ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                        }`}
                    onClick={() => setShowStats(!showStats)}
                >
                    {showStats ? "Hide Statistics" : "Show Statistics"}
                </button>
            </div>

            {/* Graphical Stats (Only if showStats is true) */}
            {showStats && (
                <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center">
                        User Requests Statistics
                    </h2>
                    <Bar data={requestStats} />
                </div>
            )}

            {/* Layout Switch for Small Screens */}
            {windowWidth < 768 && (
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className={`py-2 px-4 rounded ${showPending ? "bg-blue-500 text-white" : "bg-gray-300"
                            }`}
                        onClick={() => setShowPending(true)}
                    >
                        Pending Requests
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${!showPending ? "bg-green-500 text-white" : "bg-gray-300"
                            }`}
                        onClick={() => setShowPending(false)}
                    >
                        Approved Requests
                    </button>
                </div>
            )}

            {/* Pending & Approved Requests */}
            <div
                className={`grid ${windowWidth >= 768 ? "grid-cols-2" : "grid-cols-1"
                    } gap-6`}
            >
                {(windowWidth >= 768 || showPending) && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-red-500 mb-4">
                            Pending Requests
                        </h3>
                        {pendingRequests.length === 0 ? (
                            <p className="text-gray-500">No pending requests</p>
                        ) : (
                            pendingRequests.map((req) => (
                                <div
                                    key={req._id}
                                    className="p-4 bg-gray-50 rounded-lg shadow-md mb-3 flex flex-col sm:flex-row justify-between items-center"
                                >
                                    <div>
                                        <p>
                                            <strong>Name:</strong> {req.userName}
                                        </p>
                                        <p>
                                            <strong>Model:</strong> {req.planName}
                                        </p>
                                        <p>
                                            <strong>Plan:</strong> {req.planType}
                                        </p>
                                        <p>
                                            <strong>price:</strong> {req.pricing}
                                        </p>
                                        <p>
                                            <strong>Mobile:</strong> {req.userMobile}
                                        </p>
                                        <p>
                                            <strong>Created:</strong>{" "}
                                            {new Date(req.requestedTime).toLocaleString().slice(0, 10)}

                                        </p>
                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {new Date(req.requestedTime).toLocaleString().slice(11, 16)}
                                            <span>{new Date(req.requestedTime).toLocaleString().slice(19, 23)}</span>

                                        </p>
                                    </div>
                                    <div className="flex sm:flex-col flex-row gap-2">
                                        {req.planType !== "Expired" && (
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 cursor-pointer rounded-md"
                                                onClick={() => approveRequest(req._id)}
                                            >
                                                ✅ Approve
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 cursor-pointer rounded-md"
                                            onClick={() => {
                                                setID(req._id);
                                                setIsAlertOpen(true);
                                            }}
                                        >
                                            ❌ Delete
                                        </button>
                                        {/* Alert Box */}
                                        {isAlertOpen && (
                                            <DeleteByTopAdmin
                                                onClose={() => setIsAlertOpen(false)}
                                                onDelete={handleDeleteRequest}
                                            />
                                        )}
                                        {/* <button
                                            className="bg-red-500 text-white px-3 py-1 cursor-pointer rounded-md"
                                            onClick={() => deleteRequest(req._id)}
                                        >
                                            ❌ Delete
                                        </button> */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {(windowWidth >= 768 || !showPending) && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-green-500 mb-4">
                            Approved Requests
                        </h3>
                        {userSubscriptions && userSubscriptions.length > 0 ? (
                            userSubscriptions.map((req, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-gray-50 rounded-lg shadow-md mb-3"
                                >
                                    <p>
                                        <strong>Name:</strong> {req.userName}
                                    </p>
                                    <p>
                                        <strong>Model:</strong> {req.planName}
                                    </p>
                                    <p>
                                        <strong>Plan:</strong> {req.planType}
                                    </p>
                                    <p>
                                        <strong>price:</strong> {req.pricing}
                                    </p>
                                    <p>
                                        <strong>Mobile:</strong> {req.userMobile}
                                    </p>
                                    <p>
                                        <strong>Approve Admin:</strong>{" "}
                                        {new Date(req.approvedTime).toLocaleString().slice(0, 10)}

                                    </p>
                                    <p>
                                        <strong>Time:</strong>{" "}
                                        {new Date(req.approvedTime).toLocaleString().slice(11, 16)}
                                        <span>{new Date(req.approvedTime).toLocaleString().slice(19, 23)}</span>

                                    </p>



                                    <p className="text-white font-semibold mt-3 bg-blue-500 rounded-md p-2 text-center ">
                                        {req.monthsLeft > 0
                                            ? `${req.monthsLeft} months and ${req.daysLeft % 30} days left`
                                            : `${req.daysLeft} days left`}
                                    </p>
                                    {req.daysLeft === 0 && (
                                        <p className="text-white font-bold mt-3 bg-red-500 rounded-md p-2 text-center">No Plan Exist</p>
                                    )}

                                </div>

                            ))
                        ) : (
                            <p className="text-gray-500">No approved requests</p>

                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceRequest;
