import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

const user = { userId: "12345", userName: "John Doe" }; // Dummy user data

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [userReview, setUserReview] = useState(null);
    const [error, setError] = useState("");

    const { currentUser } = useSelector((state) => state.user);
    const params = useParams();


    // Fetch all reviews
    useEffect(() => {
        const fetchAllReview = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/listing/all-reviews-rates/${params.listingId}`).then((res) => {
                    setReviews(res.data.reverse());
                    const userExistingReview = res.data.find((r) => r._id === currentUser._id);
                    if (userExistingReview) setUserReview(userExistingReview);
                });
            } catch (err) {
                setError("Error fetching reviews");
            }
        }

        fetchAllReview();
    }, []);

    // Submit a new review
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userReview) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/listing/review-rate/${params.listingId}`, {
                userId: currentUser._id,
                userName: currentUser.username,
                rating,
                reviewText,
            }).then((res) => {
                setReviews(res.data.reverse());
                setUserReview(res.data);
                setError("");
            });


        } catch (err) {
            setError(err.response?.data?.message || "Error submitting review");
        }
    };

    // Delete review
    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/listing/delete-review/${params.listingId}/${currentUser._id}`).then((res) => {
                setReviews(res.data.reverse());
                setUserReview(null);
            });

        } catch (err) {
            setError("Error deleting review");
        }
    };

    return (
        <div className="max-w-lg mt-4 mx-auto p-4 bg-white shadow-md rounded">

            <h2 className="text-xl font-bold mb-4">User Reviews</h2>
            <p className="mb-2 text-2xl">Hi, {currentUser.username}</p>

            {error && <p className="text-red-500">{error}</p>}

            {!userReview ? (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span
                                key={i}
                                className={`cursor-pointer text-5xl ${i <= rating ? (rating < 3 ? "text-red-500" : "text-yellow-500") : "text-gray-400"
                                    }`}
                                onClick={() => setRating(i)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        className="w-full outline-none border-2 border-blue-500 p-2 rounded mt-2"
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    ></textarea>

                    <button
                        type="submit"
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Submit Review
                    </button>
                </form>
            ) : (
                <p className="text-green-500">You have already submitted a review!</p>
            )}

            <h3 className="text-lg font-semibold mt-4">All Reviews</h3>
            {reviews.map((r, index) => (
                <div key={index} className="border-b flex flex-row justify-between items-end py-2">
                    <div className=" ">
                        <p className="font-semibold">{r.userName}</p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <span
                                    key={i}
                                    className={`text-2xl ${i <= r.rating ? (r.rating < 3 ? "text-red-500" : "text-yellow-500") : "text-gray-400"}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <p>{r.reviewText}</p>
                    </div>
                    {
                        r.userId === currentUser._id && (
                            <button type="button" className="text-black cursor-pointer mt-1 bg-red-200 hover:bg-red-500 p-1 rounded-[8px] " onClick={handleDelete}>
                                Delete
                            </button>
                        )
                    }
                </div>
            ))}
        </div>
    );
};

export default ReviewPage;
