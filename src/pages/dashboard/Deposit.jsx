import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../motion";
import { GoArrowLeft } from "react-icons/go";
import { toast } from "sonner";
import { fetchDeposits, submitDeposit } from "../../app/service/deposit.service";
import { BiCopy } from "react-icons/bi";
import Loader from "./components/loader";
import ErrorHandler from "../../app/ErrorHandler";

const Deposit = () => {
    const dispatch = useDispatch();
    const deposits = useSelector((state) => state.deposits?.deposits || []); // Fallback to empty array
    const profile = useSelector((state) => state.profile.user);
    const isSubmitting = useSelector((state) => state.deposits.isSubmitting);

    const [activeTab, setActiveTab] = useState("deposit");
    const [amount, setAmount] = useState("");
    const [isDepositPage, setIsDepositPage] = useState(false); // State to toggle the new deposit page
    const [receipt, setReceipt] = useState(null); // State for uploaded file


    // Handle Tab Changes
    const handleTabChange = (tab) => setActiveTab(tab);

    // Handle Preset Amount
    const handlePresetAmount = (value) => setAmount(value.toString());

    // Handle Receipt Upload
    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceipt(file); // File for submission
        }
    };

    // Fetch Deposits if State is Empty
    useEffect(() => {
        const fetchDepositsIfEmpty = async () => {
            if (!deposits || deposits.length === 0) {
                try {
                    await dispatch(fetchDeposits());
                } catch (error) {
                    console.error("Error fetching deposits:", error);
                }
            }
        };

        fetchDepositsIfEmpty();
    }, [dispatch, deposits]);

    // Submit Deposit
    const handleConfirmDeposit = async () => {
        if (!amount || !receipt) {
            toast.error("Amount and receipt are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("screenshot", receipt);

            const result = await dispatch(submitDeposit(formData));

            if (result.success) {
                toast.success("Deposit submitted successfully!");
                setIsDepositPage(false);
                setAmount("");
                setReceipt(null);
            }
            //     // Handle backend error messages
            //     const backendErrors = result.message; // Adjust to access `message` object
            //     if (typeof backendErrors === "object") {
            //         // Display all errors in a toast
            //         Object.entries(backendErrors).forEach(([field, errors]) => {
            //             errors.forEach((error) => toast.error(`${field}: ${error}`));
            //         });
            else {
                ErrorHandler(result.message);
            }

        } catch (error) {
            // const errorMessage =
            //     error.response?.data?.message || "An unexpected error occurred.";
            // if (typeof errorMessage === "object") {
            //     // Parse backend error messages
            //     Object.entries(errorMessage).forEach(([field, errors]) => {
            //         errors.forEach((error) => toast.error(`${field}: ${error}`));
            //     });
            ErrorHandler(error)
            // } else {
            //     toast.error(errorMessage);
            // }
            // console.error("Deposit submission error:", error.response || error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Address copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <motion.div
            initial={fadeIn("right", null).initial}
            whileInView={fadeIn("right", 1 * 2).animate}
            className="mx-w-full mx-auto md:p-6 p-2 md:mb-2 mb-52 bg-white rounded-lg"
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

            <h1 className="text-2xl font-bold text-gray-800 mb-4">Deposit</h1>

            {isDepositPage ? (
                <motion.div
                    key="deposit-confirmation"
                    initial={slideIn("right", null).initial}
                    whileInView={slideIn("right", 1 * 2).animate}
                >
                    {/* ETH/TRC20 Addresses */}
                    <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
                        <p>
                            <span className="font-bold">ETH address:</span>{" "}
                            {profile?.settings?.erc_address || "0x2835a3a46a193946b395d877a29dc3bc51bd49"}
                            <button
                                onClick={() => copyToClipboard(profile?.settings?.erc_address)}>
                                <BiCopy className="ml-2 cursor-pointer"></BiCopy>
                            </button>
                        </p>
                        <p>
                            <span className="font-bold">TRC20 address:</span>{" "}

                            {profile?.settings?.trc_address || "TTXWm4XjoRXem2Ce1KeevUcBrzK2Whpv61"}
                            <button
                                onClick={() => copyToClipboard(profile?.settings?.trc_address)}>
                                <BiCopy className="ml-2 cursor-pointer"></BiCopy>
                            </button>
                        </p>
                    </div>

                    {/* Deposit Amount */}
                    <div className="border p-4 rounded-lg text-center text-lg font-bold mb-4">
                        Deposit: {amount || "N/A USD"}
                    </div>

                    {/* Upload Deposit Receipt */}
                    <div className="mb-6">
                        <label className="block text-gray-600 font-semibold mb-2">Deposit receipt</label>
                        {receipt && (
                            <img
                                src={typeof receipt === "string" ? receipt : URL.createObjectURL(receipt)}
                                alt="Receipt Preview"
                                className="w-full max-h-64 mb-4 object-cover rounded-lg"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptUpload}
                            className="block w-full border p-2 rounded-lg"
                        />
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirmDeposit}
                        disabled={isSubmitting}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 flex justify-center items-center"
                    >
                        {isSubmitting ? <Loader /> : "Confirm Deposit"}
                    </button>
                </motion.div>
            ) : (
                <>
                    {/* Tabs for Deposit Now and Deposit History */}
                    <div className="flex space-x-4 mb-10 border-b">
                        <button
                            onClick={() => handleTabChange("deposit")}
                            className={`pb-2 border-b-2 ${activeTab === "deposit"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500"
                                } focus:outline-none`}
                        >
                            Deposit Now
                        </button>
                        <button
                            onClick={() => handleTabChange("history")}
                            className={`pb-2 border-b-2 ${activeTab === "history"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500"
                                } focus:outline-none`}
                        >
                            Deposit History
                        </button>
                    </div>

                    {/* Deposit Now Tab */}
                    {activeTab === "deposit" && (
                        <motion.div
                            key="deposit"
                            initial={slideIn("right", null).initial}
                            whileInView={slideIn("right", 1 * 2).animate}
                        >
                            {/* Balance Section */}
                            <div className="bg-red-600 text-white p-4 rounded-lg mb-10">
                                <p className="font-semibold text-sm">Total Balance</p>
                                <p className="text-3xl font-bold">{profile?.wallet?.profit_today || "0.00"} USD</p>
                            </div>

                            {/* Preset Amount Buttons */}
                            <div className="flex justify-between mb-10 gap-3">
                                {[100, 200, 500].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => handlePresetAmount(value)}
                                        className="bg-white border border-gray-300 rounded-lg p-4 w-full shadow text-gray-700 font-semibold hover:bg-gray-100 transition"
                                    >
                                        USD <br /> {value}.00
                                    </button>
                                ))}
                            </div>

                            {/* Input Field for Custom Deposit Amount */}
                            <div className="mb-10">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                    Deposit Amount
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

                            {/* Submit Button */}
                            <button
                                onClick={() => setIsDepositPage(true)}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
                            >
                                Next
                            </button>
                        </motion.div>
                    )}

                    {/* Deposit History Tab */}
                    {activeTab === "history" && (
                        <motion.div
                            key="history"
                            initial={slideIn("left", null).initial}
                            whileInView={slideIn("left", 1 * 2).animate}
                            className="space-y-4"
                        >
                            {deposits.length > 0 ? (
                                deposits.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-gray-200"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-700">Deposit</p>
                                            <p className="text-sm text-gray-500">{transaction.date}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span
                                                className={`${transaction.status === "Confirmed"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    } text-white text-sm font-semibold px-3 py-1 rounded-full mb-1`}
                                            >
                                                {transaction.status}
                                            </span>
                                            <p className="text-gray-700 font-bold">
                                                {transaction.amount} USD
                                            </p>
                                            <p className="text-gray-700 font-bold">
                                                {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })} at {new Date(transaction.created_at).toLocaleTimeString('en-US', {
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
                                    No deposit history available.
                                </p>
                            )}
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
};

export default Deposit;
