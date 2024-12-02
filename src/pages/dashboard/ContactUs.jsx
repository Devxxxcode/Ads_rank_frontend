import { FaHeadset, FaWhatsapp, FaTelegramPlane, FaCommentDots } from "react-icons/fa";
import logo from "../../assets/logo-light.png";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect } from "react";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ErrorHandler from "../../app/ErrorHandler";
import { fetchSettingsFailure, fetchSettingsStart, fetchSettingsSuccess } from "../../app/slice/auth.slice";

const ContactUs = () => {
    const settings = useSelector((state) => state.auth.settings);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSettings = async () => {
            if (!settings) {
                dispatch(fetchSettingsStart());
                try {
                    const response = await authService.fetchSettings();
                    if (response.success) {
                        dispatch(fetchSettingsSuccess(response.data));
                    } else {
                        dispatch(fetchSettingsFailure(response.message || "Failed to load profile."));
                        toast.error(response.message || "Failed to load profile.");
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    dispatch(fetchSettingsFailure("An error occurred while fetching your profile."));
                    // toast.error("An error occurred while fetching your profile.");
                    ErrorHandler(error)
                }
            }
        };

        fetchSettings();
    }, [dispatch, settings]);

    const handleNavigation = (url) => {
        if (url) {
            window.open(url, "_blank"); // Open the URL in a new tab
        } else {
            toast.error("Unable to navigate. URL is invalid."); // Provide user feedback if URL is invalid
        }
    };

    if (!settings) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col items-center justify-center mt-10 md:2 mb-52 text-gray-800">
            {/* Back Button */}
            <div className="w-full">
                <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-lg text-red-600"
                    >
                        <GoArrowLeft />
                        <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                    </button>
                </div>
            </div>

            {/* Logo and Heading */}
            <div className="text-center mb-10">
                <div className="flex flex-col items-center">
                    <img src={logo} alt="Adsterra Logo" className="w-24 mb-4" />
                    <FaHeadset className="text-6xl text-gray-300 mb-4" />
                </div>
                <h1 className="text-2xl font-bold text-gray-700">Welcome to Customer Service</h1>
                <p className="text-gray-600 mt-2">
                    We&apos;re here to provide you with all your services, needs, and inquiries or issues 24/7.
                </p>
            </div>

            {/* Chat Options */}
            <div className="bg-white p-8 rounded-lg shadow-md w-80 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose a Support Option</h2>
                <div className="space-y-4">
                    {/* Online Chat */}
                    <button
                        onClick={() => settings?.online_chat_url && handleNavigation(settings.online_chat_url)}
                        className="w-full bg-red-500 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-red-600 transition duration-200"
                    >
                        <FaCommentDots />
                        Online Chat
                    </button>

                    {/* WhatsApp Chat */}
                    <button
                        onClick={() => {
                            const whatsappNumber = settings?.whatsapp_contact?.replace(/[^\d]/g, "");
                            console.log(whatsappNumber)
                            if (whatsappNumber) {
                                handleNavigation(`https://wa.me/${whatsappNumber}`);
                            } else {
                                console.error("WhatsApp contact is missing or invalid.");
                                console.log(whatsappNumber)
                            }
                        }}
                        className="w-full bg-green-500 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-green-600 transition duration-200"
                    >
                        <FaWhatsapp />
                        WhatsApp Chat
                    </button>

                    {/* Telegram Chat */}
                    <button
                        onClick={() => {
                            const telegramUsername = settings?.telegram_username?.replace("@", "");
                            if (telegramUsername) {
                                handleNavigation(`https://t.me/${telegramUsername}`);
                            } else {
                                console.error("Telegram username is missing or invalid.");
                            }
                        }}
                        className="w-full bg-blue-500 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-blue-600 transition duration-200"
                    >
                        <FaTelegramPlane />
                        Telegram Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
