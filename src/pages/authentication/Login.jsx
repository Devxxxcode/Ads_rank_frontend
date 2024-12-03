import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import logo from "../../assets/logo-light.png";
import { toast } from "sonner"; // Import sonner for toasts
import authService from "../../app/service/auth.service";
import AppInit from "../../app/state.helper";
import Loader from "../dashboard/components/loader";
// import { Toaster } from "sonner";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const handleLogin = async (event) => {
        event.preventDefault();
    
        const errors = [];
    
        // Collect errors
        if (!username.trim()) {
            errors.push("Username is required.");
        }
        if (!password.trim()) {
            errors.push("Password is required.");
        }
    
        // If there are any errors, display them and stop further execution
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error)); // Show each error as a separate toast
            return;
        }
    
        setLoading(true);
    
        const credentials = {
            username: username,
            password,
        };
    
        try {
            const response = await authService.login(credentials);
    
            if (response.success) {
                const initSuccess = await AppInit({ dispatch, isAuthenticated: true });
    
                if (initSuccess) {
                    setShowPopup(true);
                    setTimeout(() => {
                        setShowPopup(false);
                        navigate("/home"); // Replace with your dashboard route
                    }, 2000);
                } else {
                    toast.error("Failed to initialize the application. Please try again.");
                }
            } else {
                throw new Error(response.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            // Handle both backend-provided errors and general errors
            const errorMessage =
                error.response?.data?.message || error.message || "An unexpected error occurred.";
            toast.error(errorMessage); // Show the error in a toast
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100">

            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-gray-200"
                style={{ filter: "blur(4px)" }}
            ></div>

            {/* Form Layer */}
            <motion.div
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 1 * 2).animate}
                className="relative z-10 bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
            >
                {/* Title */}
                <img
                    src={logo}
                    alt="Logo"
                    className="mx-auto mb-4 w-[12rem]"
                />
                <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username/Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username/Email"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="text-left">
                        <p className="text-gray-600 text-sm">
                            Forgot username/password??{" "}
                            <a href="/contact" className="text-red-600 font-medium">
                                Reset
                            </a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-400 transition duration-200 flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? <Loader /> : "Login"}
                    </button>
                </form>

                {/* Forgot Password and Sign-Up */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm mt-2">
                        Don&apos;t have an account?{" "}
                        <a href="/login/signup" className="text-red-600 font-medium">
                            Create now!
                        </a>
                    </p>
                </div>
            </motion.div>

            {/* Success Popup */}
            {showPopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
                        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">Login Successful!</h2>
                        <p className="text-gray-600 mt-2 mb-4">You have successfully logged in.</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Login;
