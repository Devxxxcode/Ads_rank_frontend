import { FaRegCheckCircle, FaLock, FaTasks, FaUserShield, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { GoArrowLeft } from "react-icons/go";

const Terms = () => {
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

            <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Contract Rules</h1>

            {/* 1. Account Reset */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 1 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaRegCheckCircle className="text-red-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">1. Account Reset</h2>
                </div>
                <p className="ml-8 mb-2">To reset your account, you must complete all improvement tasks. The minimum reset amount is <span className="font-semibold text-red-500">100 USD</span>, excluding the account balance.</p>
                <p className="ml-12">Contact customer service after task completion and withdrawal to reset your account.</p>
            </motion.section>

            {/* 2. Withdrawals & Security */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 2 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaLock className="text-blue-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">2. User Withdrawals & Security</h2>
                </div>
                <ul className="ml-12 list-disc list-inside">
                    <li>Complete all optimization tasks to meet withdrawal requirements.</li>
                    <li>Withdrawals are processed automatically by the system to avoid any loss of funds.</li>
                    <li>The Platform ensures user funds&apos; safety, covering any accidental loss.</li>
                </ul>
            </motion.section>

            {/* 3. Security & Privacy */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 3 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaUserShield className="text-green-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">3. Security & Privacy</h2>
                </div>
                <ul className="ml-12 list-disc list-inside">
                    <li>Keep your account password and security code private. The Platform is not liable for losses due to disclosure.</li>
                    <li>All users are advised to keep accounts secure to avoid accidental disclosure.</li>
                    <li>Avoid using easily guessable passwords like birthdays or ID numbers.</li>
                    <li>If you forget your password, reset it by contacting customer service and change it afterward.</li>
                </ul>
            </motion.section>

            {/* 4. Optimization Tasks */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 4 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaTasks className="text-yellow-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">4. Optimization Tasks</h2>
                </div>
                <ul className="ml-12 list-disc list-inside">
                    <li>Optimization tasks are randomly assigned and cannot be changed, canceled, controlled, or skipped.</li>
                    <li>The system distributes improvement products randomly without manual changes.</li>
                </ul>
            </motion.section>

            {/* 5. Legal Compliance */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 5 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">5. Legal Compliance</h2>
                </div>
                <p className="ml-8">Legal action will be taken if there is any misuse of the account.</p>
            </motion.section>

            {/* 6. Merchant Rules */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 6 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaRegCheckCircle className="text-purple-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">6. Merchant Rules</h2>
                </div>
                <p className="ml-8">Each deposit must be confirmed with customer service within 30 minutes to ensure the correct merchant&apos;s USD address.</p>
            </motion.section>

            {/* 7. Deposit Responsibility */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 7 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaLock className="text-indigo-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">7. Deposit Responsibility</h2>
                </div>
                <p className="ml-8">The platform will not be held responsible for any deposits made to the wrong account.</p>
            </motion.section>

            {/* 8. Task Completion */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 8 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaTasks className="text-teal-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">8. Task Completion</h2>
                </div>
                <p className="ml-8">Each time improvement task must be completed within 8 hours. Failure to do so without requesting an extension may result in a lower credit score.</p>
            </motion.section>

            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 4 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="md:mb-6 mb-52 p-4 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-3">
                    <FaTasks className="text-yellow-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">9. Requirements</h2>
                </div>
                <ul className="ml-12 list-disc list-inside">
                    <li>The minimum amount to initiate the 2nd data set is 100 USDT (Beginner Level).</li>
                    <li>Each member is eligible for the reset bonus based on the corresponding initial deposit for the 2nd or 3rd data set. (Only on day 2 data set)</li>
                    <li>The reset bonus will be credited to the member&apos;s account balance alongside the initial deposit amount.</li>
                </ul>
            </motion.section>
        </div>
    );
};

export default Terms;
