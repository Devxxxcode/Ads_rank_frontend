import { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { GiCrown } from "react-icons/gi";
import { motion } from "framer-motion";
import { slideIn } from "../../motion";
import BottomNavMobile from "./components/BottomNavMobile";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentGame, fetchProducts, submitCurrentGame } from "../../app/service/products.service";
import { toast } from "sonner";
import ErrorHandler from "../../app/ErrorHandler";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import Loader from "../dashboard/components/loader"
import LoadingSpinner from "./components/LoadingSpinner";

const slideVariants = {
    enter: (direction) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

const Starting = () => {
    const dispatch = useDispatch();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStar, setSelectedStar] = useState(0);
    const [comments, setComments] = useState("");

    const profile = useSelector((state) => state.profile.user);
    const isLoading = useSelector((state) => state.products.isLoading);
    const products = useSelector((state) => state.products.products);
    const currentGame = useSelector((state) => state.products.currentGame);
    const error_msg = useSelector((state) => state.products.error_msg);

    console.log("currentGame", currentGame)

    // eslint-disable-next-line no-unused-vars
    const images = [
        "https://picsum.photos/id/101/150/150", // Random image 1
        "https://picsum.photos/id/102/150/150", // Random image 2
        "https://picsum.photos/id/103/150/150", // Random image 3
        "https://picsum.photos/id/104/150/150", // Random image 4
        "https://picsum.photos/id/105/150/150", // Random image 5
        "https://picsum.photos/id/106/150/150", // Random image 6
        "https://picsum.photos/id/107/150/150", // Random image 7
        "https://picsum.photos/id/108/150/150", // Random image 8
        "https://picsum.photos/id/109/150/150", // Random image 9
        "https://picsum.photos/id/110/150/150", // Random image 10
        "https://picsum.photos/id/111/150/150", // Random image 11
        "https://picsum.photos/id/112/150/150", // Random image 12
        "https://picsum.photos/id/113/150/150", // Random image 13
        "https://picsum.photos/id/114/150/150", // Random image 14
        "https://picsum.photos/id/115/150/150", // Random image 15
        "https://picsum.photos/id/116/150/150", // Random image 16
        "https://picsum.photos/id/117/150/150", // Random image 17
        "https://picsum.photos/id/118/150/150", // Random image 18
        "https://picsum.photos/id/119/150/150", // Random image 19
        "https://picsum.photos/id/120/150/150", // Random image 20
    ];

    useEffect(() => {
        const fetchProfile = async () => {

            if (!profile) {

                dispatch(fetchProfileStart());
                try {
                    const response = await authService.fetchProfile();
                    if (response.success) {
                        dispatch(fetchProfileSuccess(response.data));
                    } else {
                        dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                        toast.error(response.message || "Failed to load profile.");
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                    toast.error("An error occurred while fetching your profile.");
                }
            }
        };

        fetchProfile();
    }, [dispatch, profile]);



    useEffect(() => {
        const fetchCurrentGameData = async () => {
            if (!currentGame || Object.keys(currentGame).length === 0) {
                dispatch(fetchCurrentGame());
            }
        };

        fetchCurrentGameData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        const fetchProductsData = async () => {
            if (!products || products.length === 0) {
                dispatch(fetchProducts());
            }
        };

        fetchProductsData();
    }, [dispatch, products]);

    const groupProducts = (products, groupSize) => {
        const grouped = [];
        for (let i = 0; i < products.length; i += groupSize) {
            grouped.push(products.slice(i, i + groupSize));
        }
        return grouped;
    };

    const groupedProducts = products?.length > 0 ? groupProducts(products, 7) : [[]];
    const totalSlides = groupedProducts.length;

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        if (currentSlide >= totalSlides) {
            setCurrentSlide(0);
        }
    }, [currentSlide, totalSlides]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextSlide();
        }, 3000); // Autoplay every 3 seconds

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSlide]);

    const toggleModal = () => {
        if (!currentGame.id) {
            setIsModalOpen(false)
            toast.error(error_msg);
            return;
        }
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Greeting and Wallet Information Section */}
            <div className="w-full mx-auto mt-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        {profile?.profile_picture ? (
                            <img
                                src={profile.profile_picture}
                                alt="Profile"
                                className="w-12 h-12 md:mr-6 mr-2 rounded-full object-cover"
                            />
                        ) : (
                            <BiUserCircle className="md:text-6xl text-4xl md:mr-6 mr-2" />
                        )}
                        <p className="font-bold text-lg">Hi, {profile?.first_name} 👋</p>
                    </div>
                    {profile?.wallet?.package?.icon ? (
                        <img
                            src={profile.wallet.package.icon}
                            className="text-5xl ml-6 w-12 h-12 object-contain inline-block mr-4"
                        />
                    ) : (
                        <GiCrown className="text-5xl ml-6" />
                    )}
                </div>

                {/* Wallet Information Cards */}
                <motion.div
                    initial={slideIn("up", null).initial}
                    whileInView={slideIn("up", 1 * 2).animate}
                    className="grid grid-cols-2 gap-4 mt-4">
                    {[{
                        label: "Wallet Balance", amount: `$${profile?.wallet?.balance || "0.00"} USD`, description: "Profits will be added here"
                    },
                    { label: "Today's Profit", amount: `$${profile?.wallet?.commission || "0.00"} USD`, description: "Profit Earned" },
                    { label: "On Hold", amount: `$${profile?.wallet?.on_hold || "0.00"} USD`, description: "Will be added to your balance" },
                    { label: "Salary", amount: `$${profile?.wallet?.salary || "0.00"} USD`, description: "Today's Salary" }].map((item, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg shadow-md">
                            <p className="font-bold text-lg text-gray-700">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            <p className="text-red-500 font-bold text-lg mt-2">{item.amount}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Start Optimization Carousel */}
            <div className="w-full h-auto mx-auto mt-8 bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Start Optimization</h2>
                    <p className="text-red-500 text-xl font-semibold">
                        {currentGame?.current_number_count || 0} / {currentGame?.total_number_can_play || 0}
                    </p>
                </div>
                <div className="relative flex justify-center items-center">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevSlide}
                        className="absolute left-0 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
                    >
                        ❮
                    </button>

                    {/* Carousel Content */}
                    {isLoading ? (
                        <p className="text-lg text-gray-500"><Loader/></p>
                    ) : groupedProducts[0]?.length > 0 ? (
                        <motion.div
                            key={currentSlide}
                            custom={currentSlide}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                            className="grid gap-y-4"
                        >
                            <div className="col-span-4 flex justify-around">
                                {groupedProducts[currentSlide]?.slice(0, 4).map((product, idx) => (
                                    <div
                                        key={product.id || idx}
                                        className="flex justify-center items-center border rounded-full mx-4 md:mx-10 bg-gray-500 p-0.5 h-[70px] md:w-[200px] md:h-[200px]"
                                    >
                                        <img
                                            src={product.image || "https://via.placeholder.com/150"}
                                            alt={product.name || `Product ${idx + 1}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="col-span-4 flex justify-center gap-4 mt-4">
                                {groupedProducts[currentSlide]?.slice(4, 7).map((product, idx) => (
                                    <div
                                        key={product.id || idx}
                                        className="flex justify-center items-center border rounded-full bg-gray-500 p-0.5 mx-4 md:mx-14 w-[70px] h-[70px] md:w-[200px] md:h-[200px]"
                                    >
                                        <img
                                            src={product.image || "https://via.placeholder.com/150"}
                                            alt={product.name || `Product ${idx + 5}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <p className="text-lg text-gray-500">No products available</p>
                    )}

                    {/* Next Button */}
                    <button
                        onClick={handleNextSlide}
                        className="absolute right-0 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
                    >
                        ❯
                    </button>
                </div>
                <button
                    onClick={toggleModal}
                    className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg w-full text-center"
                >
                    Starting
                </button>
            </div>


            {/* Important Hint Section */}
            <div className="w-full md:mb-2 mb-52 mx-auto mt-4 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-lg font-bold">Important Hint</h2>
                <ul className="list-disc ml-4 mt-2 text-gray-600">
                    <li>Working hours: {profile?.settings?.service_availability_start_time || "00:00"} - {profile?.settings?.service_availability_end_time || "23:00:00"}</li>
                    <li>For inquiries about applicants, please consult agency services</li>
                </ul>
            </div>

            {/* Modal */}
            {isModalOpen && currentGame && (
                
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}>
                    { isLoading && <div className=" absolute z-[100]">
                    <LoadingSpinner/>
                    </div>}
                    <motion.div
                        initial={{ opacity: 0, y: 300 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 300 }}
                        className="bg-white p-4 sm:p-8 rounded-3xl shadow-lg max-w-2xl w-full relative overflow-y-auto"
                        style={{ maxHeight: "90vh" }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="absolute top-4 right-4 text-red-500 text-xl font-bold"
                        >
                            ✕
                        </button>

                        {/* Modal Title */}
                        <h2 className="text-2xl font-bold text-center mb-4 sm:mb-6">Task Submission</h2>

                        {/* Product Images and Details */}
                        <div className="flex items-start sm:space-x-6 mb-4">
                            {/* Product Images */}
                            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto w-full sm:w-auto">
                                {currentGame?.products?.slice(0, 3).map((product) => (
                                    <div key={product?.id} className="flex-shrink-0 w-[90px] md:w-[120px] h-auto">
                                        <img
                                            src={product?.image}
                                            alt={product?.name}
                                            className="w-full h-auto object-cover rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Product Details */}
                            <div className="text-right flex-grow md:w-1/4 w-auto">
                                {currentGame?.products?.slice(0, 3).map((product) => (
                                    <p key={product?.id} className="text-sm sm:text-lg font-semibold">
                                        {product?.name}
                                    </p>
                                ))}
                                <p className="text-sm sm:text-lg text-red-500 font-bold mt-1 sm:mt-2">
                                    USD {currentGame?.amount}
                                </p>
                                {!currentGame.pending && (
                                    <>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Star Rating</p>
                                        {/* Stars Section */}
                                        <div className="flex justify-end mt-1 text-gray-400 text-sm sm:text-xl space-x-1">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <span
                                                    key={index}
                                                    onClick={() => setSelectedStar(index + 1)}
                                                    className={`cursor-pointer ${index < selectedStar ? "text-yellow-400" : "text-gray-400"
                                                        }`}
                                                >
                                                    ☆
                                                </span>
                                            ))}
                                        </div>

                                        {/* Comments Section */}
                                        <textarea
                                            placeholder="Leave your comments here..."
                                            className="w-full mt-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        ></textarea>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Amount and Commission Section */}
                        <div className="flex justify-between border-t border-b py-2 sm:py-4 mb-4 text-center">
                            <div>
                                <p className="text-sm sm:text-lg font-semibold text-gray-500">Total amount</p>
                                <p className="text-red-500 font-bold text-sm sm:text-lg">USD {currentGame?.amount}</p>
                            </div>
                            <div>
                                <p className="text-sm sm:text-lg font-semibold text-gray-500">Commission</p>
                                <p className="text-red-500 font-bold text-sm sm:text-lg">USD {currentGame?.commission}</p>
                            </div>
                        </div>

                        {/* Creation Time and Rating Number */}
                        <div className="flex justify-between text-sm sm:text-lg text-gray-600 mb-2 sm:mb-4">
                            <p>Creation time</p>
                            <p>{new Date(currentGame?.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6">
                            <p>Rating No</p>
                            <p className="text-red-500">{currentGame?.rating_no}</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={async () => {
                                // if (!currentGame || !currentGame.pending) {
                                //     toast.error("No new submission available for you. Check back later.");
                                //     return;
                                // }

                                if (!currentGame?.pending) {
                                    if (!selectedStar || selectedStar < 1 || selectedStar > 5) {
                                        toast.error("Please select a valid rating between 1 and 5.");
                                        return;
                                    }
                                }

                                try {
                                    const response = await dispatch(
                                        submitCurrentGame(selectedStar, comments)
                                    );
                                    console.log("response", response.message)
                                    if (response?.success) {
                                        toast.success("Submission successful!");
                                        setSelectedStar(0);
                                        setComments("");
                                        dispatch(fetchProfileStart());
                                        try {
                                            const response = await authService.fetchProfile();
                                            if (response.success) {
                                                dispatch(fetchProfileSuccess(response.data));
                                            } else {
                                                dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                                                toast.error(response.message || "Failed to load profile.");
                                            }
                                        } catch (error) {
                                            console.error("Error fetching profile:", error);
                                            dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                                            toast.error("An error occurred while fetching your profile.");
                                        }
                                        toggleModal();
                                    } else {
                                        ErrorHandler(response.message);
                                        dispatch(fetchProfileStart());
                                        try {
                                            const response = await authService.fetchProfile();
                                            if (response.success) {
                                                dispatch(fetchProfileSuccess(response.data));
                                            } else {
                                                dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                                                toast.error(response.message || "Failed to load profile.");
                                            }
                                        } catch (error) {
                                            console.error("Error fetching profile:", error);
                                            dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                                            toast.error("An error occurred while fetching your profile.");
                                        }
                                        toggleModal()
                                        dispatch(fetchCurrentGame());
                                    }
                                } catch (error) {
                                    ErrorHandler(error);
                                    dispatch(fetchProfileStart());
                                    try {
                                        const response = await authService.fetchProfile();
                                        if (response.success) {
                                            dispatch(fetchProfileSuccess(response.data));
                                        } else {
                                            dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                                            toast.error(response.message || "Failed to load profile.");
                                        }
                                    } catch (error) {
                                        console.error("Error fetching profile:", error);
                                        dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                                        toast.error("An error occurred while fetching your profile.");
                                    }
                                    toggleModal()
                                    dispatch(fetchCurrentGame());
                                }
                            }}
                            className="w-full bg-red-500 text-white font-semibold py-2 sm:py-3 rounded-full flex justify-center items-center "
                        >
                            {isLoading ? <Loader /> : currentGame?.pending ? "Confirm Submission" : "Submit"}
                        </button>


                    </motion.div>
                </div>
            )}
            <BottomNavMobile className="md:hidden" />
        </div>
    );
};

export default Starting;
