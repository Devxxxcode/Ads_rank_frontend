import { GoArrowLeft } from "react-icons/go";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../app/service/notifications.service";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
// import Loader from "./components/Load";

const Notification = () => {
    const dispatch = useDispatch();
    const { notifications, isLoading } = useSelector((state) => state.notifications);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedNotifications = notifications.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(notifications.length / itemsPerPage);

    // Fetch notifications on mount and set up polling
    useEffect(() => {
        const fetchNotificationsInterval = () => {
            dispatch(fetchNotifications());
        };

        fetchNotificationsInterval();

        const interval = setInterval(fetchNotificationsInterval, 120000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Mark all notifications as read
    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    // Mark a single notification as read
    const handleMarkAsRead = (id) => {
        dispatch(markNotificationAsRead(id));
    };

    // Navigate to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Navigate to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <div className="p-2 md:mb-24 mb-52">
            {/* Show Loader when loading */}
            {/* {isLoading && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loader />
                </div>
            )} */}

            {/* Content when not loading */}
            {!isLoading && (
                <>
                    {/* Back Button */}
                    <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-lg text-red-600"
                        >
                            <GoArrowLeft />
                            <h2 className="text-xl font-bold text-gray-800 ml-4">Notifications</h2>
                        </button>
                    </div>

                    {/* Notifications Header */}
                    <div className="flex justify-between items-center md:mb-0 mb-8">
                        <p className="text-gray-700 mb-4">
                            {notifications.length} Notification{notifications.length !== 1 ? "s" : ""}
                        </p>
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isLoading || notifications.every((notif) => notif.is_read)}
                            className="text-white bg-red-600 px-4 py-1 rounded-full font-semibold text-sm mt-3 md:mt-0 disabled:bg-gray-400"
                        >
                            Mark all read
                        </button>
                    </div>

                    {/* Notification List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-4"
                    >
                        {paginatedNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center ${!notif.is_read ? "border-l-4 border-red-600" : ""
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className="text-gray-800 text-justify">{notif.message}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                {!notif.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className="text-white bg-red-600 px-4 py-1 rounded-full font-semibold text-sm mt-3 md:mt-0 md:ml-4"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Pagination Controls */}
                    <div className="absolute bottom-0 md:left-[310px] right-1 md:max-w-6xl 
                    mx-auto w-full bg-white p-4 border-t flex justify-between items-center">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-white rounded-lg hover:bg-red-500 disabled:opacity-90"
                        >
                            Previous
                        </button>
                        <p className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </p>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {/* No Notifications */}
                    {notifications.length === 0 && (
                        <p className="text-gray-500 text-center">No notifications available</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Notification;
