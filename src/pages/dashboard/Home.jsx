import { BsArrowRightShort } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { BsCalendar2Event } from "react-icons/bs";
import { BiBook } from "react-icons/bi";
import { FaCcMastercard } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";
import { MdRestartAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { motion } from "framer-motion";
import videoSource from "../../assets/home_video.mp4";
import { CiCreditCard1 } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { about, certificate, deposit, events, faq, starting, terms, withdraw } from "../../constants/app.routes";
import BottomNavMobile from "./components/BottomNavMobile";
import { useSelector, useDispatch } from "react-redux";
import { fetchActivePacks } from "../../app/service/packs.service"; // Import the service
import { setPacks } from "../../app/slice/packs.slice";
import Loader from "./components/Load";
import { toast } from "sonner";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess, setWelcomeState, toggleWelcomeState } from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";
import { fetchNotifications } from "../../app/service/notifications.service";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const showWelcome = useSelector((state) => state.profile.showWelcome); // Use Redux state for showWelcome
    // eslint-disable-next-line no-unused-vars
    const [Notifications, setNotifications] = useState(3);

    const profile = useSelector((state) => state.profile.user);
    const { notifications } = useSelector((state) => state.notifications);

    // Unread notifications count
    const unreadNotifications = notifications.filter(notification => !notification.is_read).length;

    // Fetch packs data from Redux state
    const { packs, isLoading, error } = useSelector((state) => state.packs);

    // Adjust the packs mapping logic
    const packItems = packs?.data || []; // Access the data array safely

    useEffect(() => {
        const fetchPacks = async () => {
            if (!packs || !packs.data || packs.data.length === 0) {
                try {
                    // Dispatch the action and await the promise
                    const response = dispatch(fetchActivePacks());

                    // Check if the action returned the expected data
                    if (response.payload?.success) {
                        dispatch(setPacks(response.payload.data)); // Update state with fetched packs
                    } else {
                        return
                    }
                } catch (error) {
                    console.error("Error fetching packs:", error);
                    ErrorHandler(error); // Handle the error
                }
            }
        };
        fetchPacks();
    }, [dispatch, packs]);

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
        const fetchNotificationsInterval = () => {
            dispatch(fetchNotifications());
        };

        fetchNotificationsInterval();

        const interval = setInterval(fetchNotificationsInterval, 120000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Automatically hide the welcome message after 5 seconds
    useEffect(() => {
        if (showWelcome) {
            const timer = setTimeout(() => {
                dispatch(setWelcomeState(false)); // Hide welcome message using Redux
            }, 5000); // 5000ms = 5 seconds

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [showWelcome, dispatch]);

    const toggleWelcome = () => {
        dispatch(toggleWelcomeState()); // Use Redux action to toggle welcome message
    };

    return isLoading ? (
        <Loader />
    ) : (
        <div className="min-h-screen bg-white flex flex-col relative">
            {/* Video Section */}
            <div className="relative w-full md:h-96 h-[15rem] md:mt-0 mt-2 overflow-hidden">
                <video
                    className="w-full h-full object-fill"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                        console.error("Video failed to load:", e);
                        e.target.src = videoSource; // Fallback to the default video
                    }}
                >
                    <source
                        src={profile?.settings?.video || videoSource} // Use the provided video link or fallback
                        type="video/mp4"
                    />
                    Your browser does not support HTML5 video.
                </video>
            </div>

            {/* Sliding Notification Bar */}
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="absolute top-[375px] left-[5%] bg-white text-black py-2 px-4 rounded-full shadow-md z-30 flex items-center justify-center"
                style={{ width: "90%", maxWidth: "90%", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative flex items-center">
                    <IoMdNotificationsOutline
                        onClick={() => navigate("/home/notifications")}
                        className={`text-lg cursor-pointer mr-1 ${unreadNotifications > 0 ? "shake" : ""}`}
                    />
                    {unreadNotifications > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                            {unreadNotifications}
                        </span>
                    )}
                </div>
                <marquee direction="">
                    Welcome to Adsterra! We collaborate with you to drive better exposure and
                    create proven value with Adsterra platform strategy and product solutions.
                </marquee>
            </motion.div>

            {/* Links Section with Red Background */}
            <div className="bg-red-600 py-12">
                <div className="container mx-auto grid grid-cols-4 md:flex justify-around md:flex-wrap gap-4 px-4">
                    {[
                        { label: "Starting", icon: MdRestartAlt, route: (starting) },
                        { label: "Cert", icon: TbCertificate, route: (certificate) },
                        { label: "Withdraw", icon: FaCcMastercard, route: (withdraw) },
                        { label: "Deposit", icon: CiCreditCard1, route: (deposit) },
                        { label: "T & C", icon: BiBook, route: (terms) },
                        { label: "Events", icon: BsCalendar2Event, route: (events) },
                        { label: "FAQ", icon: RiQuestionAnswerLine, route: (faq) },
                        { label: "About Us", icon: FiUsers, route: (about) },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => item.route && navigate(item.route)}
                            className="bg-white cursor-pointer rounded-lg shadow-lg p-3 md:w-[120px] md:h-[80px] text-center flex flex-col items-center justify-center"
                        >
                            <item.icon className="text-2xl text-red-600 mb-1" />
                            <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {showWelcome && (
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-24 left-4 md:left-80 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center cursor-pointer z-10 md:bottom-4"
                    onClick={toggleWelcome}
                    style={{
                        width: showWelcome ? "auto" : "10px",
                        padding: showWelcome ? "12px" : "8px",
                        height: showWelcome ? "auto" : "70px",
                    }}
                >
                    {showWelcome ? (
                        <>
                            <FaUserCircle className="mr-2" />
                            <div>
                                <p className="text-lg font-bold">Hi, {profile?.first_name} 👋</p>
                                <p>Welcome Back</p>
                            </div>
                            <MdChevronLeft className="ml-2 text-2xl" />
                        </>
                    ) : (
                        <MdChevronRight className="text-2xl" />
                    )}
                </motion.div>
            )}

            {/* Packs Section */}
            <div className="container mx-auto mt-8 px-2 md:mb-2 mb-52">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">VIP Levels</h2>
                    <button
                        onClick={() => navigate("/home/level")}
                        className="font-semibold rounded-full border p-2 flex items-center">
                        View More
                        <BsArrowRightShort className="text-2xl text-red-600" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isLoading ? (
                        <p>Loading packs...</p>
                    ) : error ? (
                        toast.error
                    ) : packItems.length > 0 ? (
                        packItems.map((pack, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate("/home/level")}
                                className="bg-white p-5 rounded-lg cursor-pointer shadow-lg flex flex-col justify-center items-center h-auto md:h-40 relative"
                            >
                                <div className="flex justify-between w-full items-center mb-2">
                                    {/* Use <img> to render the image */}
                                    <img
                                        src={pack.icon}
                                        alt={pack.name}
                                        className="w-10 h-10 object-contain" // Adjust size as needed
                                    />
                                    <span className="text-white rounded-lg px-3 py-1 border text-center bg-red-600 w-[70px] text-xs flex items-center justify-center">
                                        ${pack.usd_value}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-800 md:text-lg text-[15px] text-center mb-4">
                                    {pack.name}
                                </h3>
                                <p className="text-gray-600 text-sm text-center">
                                    {pack.short_description || "No description available."}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <p>No packs available.</p>
                    )}
                </div>
            </div>
            <BottomNavMobile className="md:hidden" />
        </div>
    );
};

export default Home;
