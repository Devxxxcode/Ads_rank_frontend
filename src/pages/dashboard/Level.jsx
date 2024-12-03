import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { GoArrowLeft } from "react-icons/go";
import { fetchActivePacks } from "../../app/service/packs.service"; // Import fetch action
import BottomNavMobile from "./components/BottomNavMobile";
import setPacks from "../../app/slice/packs.slice"
import Loader from "./components/Load";

const Level = () => {
    const dispatch = useDispatch();

    // Access the packs state
    const { packs, isLoading, error } = useSelector((state) => state.packs);

    // Safely access the packs data
    const packItems = packs?.data || [];

    // Fetch packs if state is empty
    useEffect(() => {
        const fetchPacks = async () => {
            if (!packs || !packs.data || packs.data.length === 0) {
                try {
                    const packData = await dispatch(fetchActivePacks()).unwrap(); // Fetch data
                    dispatch(setPacks(packData)); // Update state
                } catch (error) {
                    console.error("Error fetching packs:", error);
                }
            }
        };
        fetchPacks();
    }, [dispatch, packs]);
    
    if (isLoading){
        return <><Loader/></>
    }

    return (

        <div className="min-h-screen bg-white p-2 md:p-8">
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
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">VIP Levels</h2>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:mb-1 mb-52">
                {isLoading ? (
                    <p className="text-center"></p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : packItems.length > 0 ? (
                    packItems.map((pack, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start"
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Icon */}
                            <div className="text-3xl mb-2">
                                <img
                                    src={pack.icon}
                                    alt={`${pack.name} icon`}
                                    className="w-16 h-16 object-contain"
                                />
                            </div>

                            {/* Name and Member Info */}
                            <h3 className="text-lg font-semibold text-gray-800">{pack.name}</h3>
                            <p className="text-red-500 font-bold mb-2">${pack.usd_value}</p>
                            <p className="text-gray-700 font-medium mb-4">
                                {pack.name.split(" ")[0]} Member
                            </p>

                            {/* Description */}
                            <div className="space-y-1">
                                {pack.description.split(/\r\n/).map((sentence, i) => (
                                    <p key={i} className="text-gray-600 text-sm">
                                        {sentence.trim()}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center"></p>
                )}
            </div>

            {/* Bottom Navigation for Mobile */}
            <BottomNavMobile className="md:hidden" />
        </div>
    );
};

export default Level;
