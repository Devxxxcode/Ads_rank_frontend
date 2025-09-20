import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchWithdrawalHistory, makeWithdrawal } from "../../app/service/withdraw.service";
import { fetchWithdrawalsStart } from "../../app/slice/withdraw.slice";
import Loader from "./components/loader";
import { GoArrowLeft } from "react-icons/go";
import { fadeIn, slideIn } from "../../motion";
import ErrorHandler from "../../app/ErrorHandler";

const Withdraw = () => {
    const dispatch = useDispatch();
    const { history, isLoading } = useSelector((state) => state.withdrawals);
    const profile = useSelector((state) => state.profile.user);

    // State for inputs
    const [amount, setAmount] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("withdraw");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch withdrawal history initially if the state is empty
    useEffect(() => {
        const fetchWithdrawalsIfEmpty = async () => {
            if (!history || history.length === 0) {
                dispatch(fetchWithdrawalsStart());
                try {
                    await dispatch(fetchWithdrawalHistory());
                    console.log(history)
                } catch (error) {
                    console.error("Error fetching withdrawals:", error);
                }
            }
        };

        fetchWithdrawalsIfEmpty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // Handle Submit
    const handleSubmit = async () => {
        // Frontend validation
        if (!amount || !password) {
            toast.error("Both amount and password are required.");
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        // Show loader on button
        setIsSubmitting(true);

        try {
            const payload = { amount: Number(amount), password };
            const response = await dispatch(makeWithdrawal(payload));

            if (response.success) {
                toast.success(response.message || "Withdrawal request successful.");
                setAmount("");
                setPassword("");
            } else {
                // Extract error message
                ErrorHandler(response.message);
            }
        } catch (error) {
            // Log and display unexpected errors
            // console.error("Unexpected error:", error);
            // toast.error("An unexpected error occurred. Please try again.");
            ErrorHandler(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabChange = (tab) => setActiveTab(tab);

    return (
        <motion.div
            initial={fadeIn("right", null).initial}
            whileInView={fadeIn("right", 1 * 2).animate}
            className="max-w-full mx-auto md:mt-8 md:mb-2 mb-52 md:p-6 p-2 bg-white rounded-lg"
        >
            {/* Back Button */}
            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Withdraw</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-10 border-b">
                <button
                    onClick={() => handleTabChange("withdraw")}
                    className={`pb-2 border-b-2 ${activeTab === "withdraw" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
                        } focus:outline-none`}
                >
                    Withdraw Now
                </button>
                <button
                    onClick={() => handleTabChange("history")}
                    className={`pb-2 border-b-2 ${activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
                        } focus:outline-none`}
                >
                    Withdraw History
                </button>
            </div>

            {/* Withdraw Now */}
            {activeTab === "withdraw" && (
                <motion.div
                    key="withdraw"
                    initial={slideIn("right", null).initial}
                    animate={slideIn("right", 1 * 2).animate}
                >
                    <div className="bg-red-600 text-white p-4 rounded-lg mb-10">
                        <p className="font-semibold text-sm">Total Balance</p>
                        <p className="text-3xl font-bold">{profile?.wallet?.balance} USD</p>
                    </div>

                    <div className="mb-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Withdrawal Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="mb-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Withdrawal Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 flex items-center justify-center"
                    >
                        {isSubmitting ? <Loader /> : "Submit"}
                    </button>
                </motion.div>
            )}

            {/* Withdraw History */}
            {activeTab === "history" && (
                <motion.div
                    key="history"
                    initial={slideIn("left", null).initial}
                    whileInView={slideIn("left", 1 * 2).animate}
                    className="space-y-4"
                >
                    {isLoading ? (
                        <Loader />
                    ) : Array.isArray(history) ? (
                        history.length > 0 ? (
                            history.map((transaction) => (
                                <div
                                    key={transaction.id || transaction.date}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-700">Withdrawal</p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span
                                            className={`${transaction.status === "Processed"
                                                ? "bg-green-500"
                                                : transaction.status === "Pending"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                                } text-white text-sm font-semibold px-3 py-1 rounded-full mb-1`}
                                        >
                                            {transaction.status}
                                        </span>
                                        <p className="text-gray-700 font-bold">
                                            {transaction.amount} USD
                                        </p>
                                        <p className="text-gray-700 font-bold">
                                            {new Date(transaction.created_at || transaction.date).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })} at {new Date(transaction.created_at || transaction.date).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No withdrawal history available.
                            </p>
                        )
                    ) : (
                        <p className="text-red-500 text-center">An error occurred while fetching withdrawal history.</p>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default Withdraw;
