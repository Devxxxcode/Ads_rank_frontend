import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import Loader from "./components/Load";
import ButtonLoader from "./components/loader";
import {
    fetchPaymentStart,
    fetchPaymentSuccess,
    fetchPaymentFailure,
    postPaymentStart,
    postPaymentSuccess,
    postPaymentFailure,
} from "../../app/slice/payments.slice";
import paymentsService from "../../app/service/payments.service";
import { toast } from "sonner"; // Toast for notifications
import ErrorHandler from "../../app/ErrorHandler";

const Payment = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useSelector((state) => state.payments);

    // Fetch payment method on component mount, only if not already fetched
    useEffect(() => {
        if (!data) {
            const fetchPaymentData = async () => {
                dispatch(fetchPaymentStart());
                try {
                    const response = await paymentsService.fetchPaymentMethod(dispatch);
                    if (response.success) {
                        dispatch(fetchPaymentSuccess(response.data));
                    }
                } catch (error) {
                    console.error("Failed to fetch payment data:", error);
                    dispatch(fetchPaymentFailure("Failed to fetch payment data."));
                    toast.error("Failed to fetch payment data.");
                }
            };

            fetchPaymentData();
        }
    }, [dispatch, data]);

    // Handle input changes (for wallet and exchange)
    const handleInputChange = (field, value) => {
        dispatch(fetchPaymentSuccess({ ...data, [field]: value }));
    };

    // Handle confirm button click with validation
    const handleConfirm = async () => {
        if (!data?.wallet || !data?.exchange) {
            toast.error("Both Wallet Address and Exchange fields are required.");
            return;
        }

        const payload = {
            wallet: data.wallet,
            exchange: data.exchange,
        };

        dispatch(postPaymentStart());
        try {
            const response = await paymentsService.postPaymentMethod(dispatch, payload);
            if (response.success) {
                dispatch(postPaymentSuccess("Payment details updated successfully!"));
                toast.success("Payment details updated successfully!");
            }
        } catch (error) {
            console.error("Failed to post payment data:", error);
            dispatch(postPaymentFailure("Failed to update payment details."));
            // toast.error("Failed to update payment details.");
            ErrorHandler(error);
        }
    };

    // Show the page loader while fetching
    if (isLoading && !data) {
        return <Loader />;
    }

    return (
        <div className="bg-gray-50 p-2 md:p-6">
            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <p className="text-green-600 mb-4">
                    Dear user, for your security please do not enter your bank details.
                </p>
                <div>
                    <label className="text-gray-600 font-semibold">Name</label>
                    <input
                        type="text"
                        value={data?.name || ""}
                        readOnly
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-gray-600 font-semibold">Phone Number</label>
                    <input
                        type="text"
                        value={data?.phone_number || ""}
                        readOnly
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-gray-600 font-semibold">Email Address</label>
                    <input
                        type="email"
                        value={data?.email_address || ""}
                        readOnly
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-gray-600 font-semibold">Wallet Address</label>
                    <input
                        type="text"
                        value={data?.wallet || ""}
                        onChange={(e) => handleInputChange("wallet", e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>

                <div>
                    <label className="text-gray-600 font-semibold">Exchange</label>
                    <input
                        type="text"
                        value={data?.exchange || ""}
                        onChange={(e) => handleInputChange("exchange", e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
            </div>

            <button
                onClick={handleConfirm}
                className="w-full bg-red-600 md:mb-2 mb-52 text-white font-semibold py-3 rounded-lg mt-6 flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? <ButtonLoader /> : "Confirm"}
            </button>
        </div>
    );
};

export default Payment;
