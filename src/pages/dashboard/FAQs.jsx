import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { FaTasks, FaDollarSign, FaMoneyBillWave, FaUserShield, FaBox, FaBoxes, FaMoneyCheckAlt, FaHandshake, FaUserFriends } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";

const FAQs = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-2 md:p-12 font-sans text-gray-700">
            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>

            <h1 className="text-4xl font-bold text-center mb-10 text-red-600">FAQ</h1>

            {/* I. Start Optimization Task */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 1 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaTasks className="text-red-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">I. Start Optimization Task</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>A minimum <span className="font-semibold text-red-500">100 USD</span> recharge is required to reset the account to start a new task.</li>
                    <li>Once all tasks are completed, the user must request a full withdrawal before resetting the account.</li>
                </ul>
            </motion.section>

            {/* II. Withdrawals */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 2 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaDollarSign className="text-blue-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">II. Withdrawals</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>If the withdrawal amount is <span className="font-semibold text-blue-500">10,000 USD</span> or more, please contact customer service.</li>
                    <ul className="ml-8 list-disc list-inside">
                        <li>VIP1: Max withdrawal is 5,000 USD</li>
                        <li>VIP2: Max withdrawal is 10,000 USD</li>
                        <li>VIP3: Max withdrawal is 20,000 USD</li>
                        <li>VIP4: Max withdrawal is 100,000 USD</li>
                    </ul>
                    <li>After all tasks are completed, users can apply for a full withdrawal.</li>
                    <li>Withdrawals cannot be requested without task completion.</li>
                </ul>
            </motion.section>

            {/* III. Funds */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 3 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaMoneyBillWave className="text-green-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">III. Funds</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Funds are securely held in the user’s account.</li>
                    <li>All data processing is handled automatically to prevent losses.</li>
                    <li>The platform assumes responsibility for any accidental losses.</li>
                </ul>
            </motion.section>

            {/* IV. Account Security */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 4 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaUserShield className="text-purple-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">IV. Account Security</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Do not disclose your password or security code.</li>
                    <li>Avoid using personal information as security codes.</li>
                    <li>If you forget your credentials, contact customer service for reset.</li>
                </ul>
            </motion.section>

            {/* V. Normal Products */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 5 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaBox className="text-yellow-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">V. Normal Products</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Normal and combined earnings vary based on user type (VIP1 to VIP4).</li>
                    <li>VIP1: 0.6% profit on normal products; 15% on combined products.</li>
                    <li>Funds and earnings are credited after each completed task.</li>
                </ul>
            </motion.section>

            {/* VI. Combination Tasks */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 6 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaBoxes className="text-teal-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">VI. Combination Tasks</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Combination products may include multiple items, with higher returns.</li>
                    <li>All funds are used for product trade submissions in combination tasks.</li>
                    <li>Combination products cannot be canceled or skipped.</li>
                </ul>
            </motion.section>

            {/* VII. Deposit */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 7 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaMoneyCheckAlt className="text-indigo-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">VII. Deposit</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>The deposit amount is decided by the user.</li>
                    <li>Confirm deposit addresses with customer service.</li>
                    <li>The platform is not responsible for incorrect deposits.</li>
                </ul>
            </motion.section>

            {/* VIII. Cooperation of Merchants */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 8 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaHandshake className="text-pink-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">VIII. Cooperation of Merchants</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Delays in completing tasks may impact merchant operations.</li>
                    <li>Merchants provide deposit details for user deposits.</li>
                </ul>
            </motion.section>

            {/* IX. Invitation */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 9 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-52 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaUserFriends className="text-orange-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">IX. Invitation</h2>
                </div>
                <ul className="ml-8 list-disc list-inside">
                    <li>Only VIP3 users with 10 days of activity can invite new users.</li>
                    <li>All product optimizations must be complete before inviting others.</li>
                </ul>
            </motion.section>
        </div>
    );
};

export default FAQs;
