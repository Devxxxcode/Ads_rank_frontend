import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../assets/logo-light.png";

const SignUp = () => {
    const navigate = useNavigate();

    const handleRedirectToOTPSignup = () => {
        navigate("/signup-otp");
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg md:my-5 w-full max-w-2xl overflow-y-auto max-h-screen">
                <img
                    src={logo}
                    alt="Logo"
                    className="mx-auto mb-4 w-[12rem]"
                />
                <h2 className="text-2xl font-semibold text-center mb-6">Register Now</h2>

                <div className="text-center space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Enhanced Security</h3>
                        <p className="text-blue-700">
                            We now require email verification for all new accounts to ensure security and prevent spam.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-800">Registration Process:</h4>
                        <div className="text-left space-y-2 text-gray-600">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                <span>Enter your email address</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                <span>Verify your email with OTP code</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                <span>Complete your registration</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRedirectToOTPSignup}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Start Registration with Email Verification
                    </button>
                </div>

                <p className="text-center text-gray-600 mt-6 md:mb-2 mb-52">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-red-600 hover:underline"
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
