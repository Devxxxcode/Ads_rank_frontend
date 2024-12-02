import { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
// import BottomNavMobile from "./components/BottomNavMobile";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameRecords, submitCurrentGame } from "../../app/service/products.service";
import { toast } from "sonner";
import ErrorHandler from "../../app/ErrorHandler";
import Loader from "./components/Load";

const statusColors = {
    Completed: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Freeze: "bg-blue-100 text-blue-600",
};

// Function to derive status
const getStatus = (record) => {
    if (record.pending) return "Pending";
    if (!record.pending && record.rating_score === 0) return "Freeze";
    return "Completed";
};

const Records = () => {
    const dispatch = useDispatch();
    const records = useSelector((state) => state.products.gameRecords); // Access game records from the state
    const isLoading = useSelector((state) => state.products.isLoading);

    const [activeTab, setActiveTab] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 2;

    // Filter Records Based on Active Tab
    const filteredRecords =
        activeTab === "All" ? records : records.filter((record) => getStatus(record) === activeTab);

    // Paginate Records
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    // Fetch Game Records
    useEffect(() => {
        if (!records || records.length === 0) {
            dispatch(fetchGameRecords());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // Handle Submit Button for Pending Products
    const handleSubmit = async () => {
        try {
            const response = await dispatch(submitCurrentGame(1, ''));
            if (response.success) {
                toast.success("Submission successful!");
                dispatch(fetchGameRecords()); // Refresh the game records
            } else {
                ErrorHandler(response.message)
            }
        } catch (error) {
            ErrorHandler(error)
        }
    };

    // Handle Page Change
    const handlePageChange = (direction) => {
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="md:p-4 p-2 md:max-w-7xl mx-auto md:mb-2 mb-24">
            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>

            {/* Tabs */}
            <motion.div
                initial={fadeIn("right", null).initial}
                animate={fadeIn("right", 1 * 2).animate}
                className="flex justify-center space-x-4 md:space-x-8 mb-4 md:mb-6"
            >
                {["All", "Completed", "Pending", "Freeze"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setCurrentPage(1); // Reset to page 1 when switching tabs
                        }}
                        className={`px-3 pb-1 text-sm md:text-base ${activeTab === tab
                            ? "text-red-600 font-semibold border-b-2 border-red-600"
                            : "text-gray-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Records List */}
            {isLoading ? (
                <p className="text-center text-gray-500"><Loader /></p>
            ) : paginatedRecords.length > 0 ? (
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 md:space-y-6 md:mb-24 mb-52"
                >
                    {paginatedRecords.map((record) => {
                        const status = getStatus(record); // Derive status
                        return (
                            <div
                                key={record.id}
                                className="bg-white rounded-lg shadow-lg p-4 md:p-5 flex items-start space-x-4 md:space-x-6 relative"
                            >
                                {/* Status Badge */}
                                <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center space-x-2">
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                                        {status}
                                    </div>
                                    {/* Submit Button for Pending Status */}
                                    {status === "Pending" && (
                                        <button
                                            onClick={() => handleSubmit(record.id)}
                                            className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full"
                                        >
                                            Submit
                                        </button>
                                    )}
                                </div>

                                {/* Product Image */}
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                                    <img
                                        src={record.products[0]?.image}
                                        alt={record.products[0]?.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow">
                                    <p className="text-gray-500 text-xs md:text-sm mb-1">
                                        {new Date(record.updated_at).toLocaleString()}
                                    </p>
                                    <p className="text-md md:text-lg font-bold text-gray-800">
                                        {record.products[0]?.name}
                                    </p>
                                    <div className="flex items-center text-yellow-500 my-1">
                                        <span className="text-xs md:text-sm mr-1">Score Ranking</span>
                                        {Array(record.rating_score)
                                            .fill()
                                            .map((_, i) => (
                                                <BsStarFill key={i} className="text-xs md:text-sm" />
                                            ))}
                                    </div>

                                    {/* Amounts */}
                                    <div className="flex justify-between mt-2 md:mt-4">
                                        <div>
                                            <p className="text-gray-500 text-xs md:text-sm">Total Amount</p>
                                            <p className="text-sm md:text-lg font-bold text-gray-800">USD {record.amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs md:text-sm">Commission</p>
                                            <p className="text-sm md:text-lg font-bold text-red-600">USD {record.commission}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            ) : (
                <p className="text-center text-gray-500">
                    No {activeTab} Records
                </p>
            )}

            {/* Pagination */}
            {filteredRecords.length > recordsPerPage && (
                <div
                    className="absolute bottom-0 md:left-[310px] right-1 md:max-w-6xl mx-auto w-full bg-white p-4 border-t flex justify-between items-center"
                >
                    <button
                        onClick={() => handlePageChange("prev")}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <p className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </p>
                    <button
                        onClick={() => handlePageChange("next")}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
            {/* <BottomNavMobile className="md:hidden" /> */}
        </div>
    );
};

export default Records;
