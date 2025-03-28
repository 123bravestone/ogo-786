import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield, FaUsers } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ProfileImg from "../assets/Profile.png";
import { Bar } from "react-chartjs-2"; // Graph
import "chart.js/auto";

const UsersDetail = () => {
    const [users, setUsers] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [adminView, setAdminView] = useState(false);
    const [nonAdminView, setNonAdminView] = useState(true);
    const params = useParams();

    // Fetch Users from Backend
    const fetchUsers = async () => {
        // console.log("param", params.userId);
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/user/all-users/${params.userId}`);
            setUsers(response.data);
        } catch (error) {
            console.log("Error fetching users:", error);
        }


    }
    useEffect(() => {

        fetchUsers();
    }, [adminView, nonAdminView]);

    // Separate Admin & Non-Admin Users
    const adminUsers = users.filter((user) => user.isAdmin);
    const nonAdminUsers = users.filter((user) => !user.isAdmin);

    // Graph Data
    const userStats = {
        labels: ["Admins", "Non-Admins"],
        datasets: [
            {
                label: "User Count",
                data: [adminUsers.length, nonAdminUsers.length],
                backgroundColor: ["#FFB300", "#1E88E5"],
            },
        ],
    };

    return (
        <div className="max-w-6xl mx-auto p-5">
            {/* Graph Toggle Button */}
            <button
                onClick={() => setShowGraph(!showGraph)}
                className="mb-5 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                {showGraph ? "Hide Statistics" : "Show Statistics"}
            </button>

            {/* Show Graph */}
            {showGraph && (
                <div className="bg-gray-100 p-5 rounded-lg mb-5">
                    <Bar data={userStats} />
                </div>
            )}

            {/* Large Screen - Two Column Layout */}
            <div className="hidden md:grid grid-cols-2 gap-5">
                {/* Admin Users */}
                <div className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FaUserShield className="text-yellow-500" /> Admins
                    </h2>
                    {adminUsers.map((user, index) => (
                        <UserCard key={index} user={user} />
                    ))}
                </div>

                {/* Non-Admin Users */}
                <div className="bg-gray-50 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FaUsers className="text-blue-500" /> Non-Admins
                    </h2>
                    {nonAdminUsers.map((user, index) => (
                        <UserCard key={index} user={user} />
                    ))}
                </div>
            </div>

            {/* Small Screen - Toggle Views */}
            <div className="md:hidden">
                <div className="flex gap-3 mb-5">
                    <button
                        className={`px-4 py-2 rounded-md ${adminView ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
                        onClick={() => {
                            setAdminView(true);
                            setNonAdminView(false);
                        }}
                    >
                        Admins
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${nonAdminView ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => {
                            setAdminView(false);
                            setNonAdminView(true);
                        }}
                    >
                        Non-Admins
                    </button>
                </div>

                {adminView && adminUsers.map((user, index) => <UserCard key={index} user={user} />)}
                {nonAdminView && nonAdminUsers.map((user, index) => <UserCard key={index} user={user} />)}
            </div>
        </div>
    );
};

// User Card Component
const UserCard = ({ user }) => {
    return (
        <div className="bg-white shadow-md rounded-md p-3 flex items-center gap-4 mb-3">
            <img
                src={user.imageUrl || ProfileImg}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <p className="text-lg font-semibold">{user.username}</p>
                <p className="text-sm text-gray-600">ID: {user._id}</p>
                <p className="text-sm text-gray-600">Mobile: {user.mobileNum}</p>
                <p className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default UsersDetail;
