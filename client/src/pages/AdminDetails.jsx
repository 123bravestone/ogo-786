import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaChartBar } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDetails = () => {
    const [shops, setShops] = useState([]);
    const [showStats, setShowStats] = useState(false);
    const [shopStats, setShopStats] = useState({});

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/shops`);
            setShops(res.data);
            processStatistics(res.data);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };
    // Process statistics for daily shop listings
    const processStatistics = (shops) => {
        const stats = {};
        shops.forEach((shop) => {
            const date = new Date(shop.createdAt).toLocaleDateString();
            stats[date] = (stats[date] || 0) + 1;
        });

        setShopStats(stats);
    };

    const deleteShop = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/listing/delete-shop/${id}`);
            setShops(shops.filter(shop => shop._id !== id));
            processStatistics(updatedShops);
        } catch (error) {
            console.error("Error deleting shop:", error);
        }
    };

    // Prepare data for the Chart
    const chartData = {
        labels: Object.keys(shopStats),
        datasets: [
            {
                label: "Shops Listed Per Day",
                data: Object.values(shopStats),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto p-4">
            {/* Statistics Toggle Button */}
            <button
                onClick={() => setShowStats(!showStats)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 flex items-center"
            >
                <FaChartBar className="mr-2" />
                {showStats ? "Hide Statistics" : "Show Statistics"}
            </button>

            {/* Statistics Graph */}
            {showStats && (
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <h2 className="text-lg font-semibold mb-2">Daily Shop Listings</h2>
                    <div className="w-full md:w-3/4 mx-auto">
                        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            )}

            {/* Shop List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shops.map((shop) => (
                    <div key={shop._id} className="bg-white shadow-md rounded-lg p-4">
                        <img src={shop.imageUrls[1].url} alt={shop.shopname} className="w-full h-40 object-cover rounded-md" />
                        <h3 className="text-lg font-bold mt-2">{shop.shopname}</h3>
                        <p className="text-gray-600">{shop.shoptype}</p>
                        <p className="text-gray-500 text-sm">📍 {shop.latitude}, {shop.longitude}</p>
                        <p className="text-gray-500 text-sm">📅 {new Date(shop.createdAt).toLocaleString()}</p>
                        <p className="text-gray-700 font-semibold">📞 {shop.whatsAppNo}</p>

                        <button
                            onClick={() => deleteShop(shop._id)}
                            className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md flex items-center cursor-pointer"
                        >
                            <FaTrash className="mr-1" /> Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDetails;
