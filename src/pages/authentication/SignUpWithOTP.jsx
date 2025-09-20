import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../assets/logo-light.png";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";

const SignUpWithOTP = () => {
    const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Registration
    const [formData, setFormData] = useState({
        email: "",
        otp_code: "",
        username: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        gender: "",
        transactional_password: "",
        invitation_code: "",
        termsAccepted: false,
    });

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTransactionPassword, setShowTransactionPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({
                ...fieldErrors,
                [name]: null
            });
        }
    };

    // Real-time validation functions
    const validateField = (name, value) => {
        const errors = { ...fieldErrors };
        
        switch (name) {
            case 'username':
                if (value && value.length < 3) {
                    errors.username = 'Username must be at least 3 characters';
                } else {
                    errors.username = null;
                }
                break;
            case 'phone_number':
                if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
                    errors.phone_number = 'Please enter a valid phone number';
                } else {
                    errors.phone_number = null;
                }
                break;
            case 'password':
                if (value && value.length < 6) {
                    errors.password = 'Password must be at least 6 characters';
                } else {
                    errors.password = null;
                }
                break;
            case 'confirmPassword':
                if (value && value !== formData.password) {
                    errors.confirmPassword = 'Passwords do not match';
                } else {
                    errors.confirmPassword = null;
                }
                break;
            case 'transactional_password':
                if (value && (!/^\d{4}$/.test(value))) {
                    errors.transactional_password = 'Transaction password must be exactly 4 digits';
                } else {
                    errors.transactional_password = null;
                }
                break;
            default:
                break;
        }
        
        setFieldErrors(errors);
    };

    // Step 1: Send OTP to email
    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        if (!formData.email?.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.sendOTP(formData.email);
            
            if (response.success) {
                toast.success(response.message);
                setOtpSent(true);
                setCurrentStep(2);
            } else {
                // Check if it's an existing email error
                if (response.message && response.message.includes("already exists")) {
                    toast.error(response.message, {
                        action: {
                            label: "Go to Login",
                            onClick: () => navigate("/")
                        }
                    });
                } else {
                    toast.error(response.message || "Failed to send OTP. Please try again.");
                }
            }
        } catch (err) {
            console.error(err);
            ErrorHandler(err);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        
        if (!formData.otp_code?.trim()) {
            toast.error("Please enter the OTP code.");
            return;
        }

        if (formData.otp_code.length !== 6) {
            toast.error("OTP code must be 6 digits.");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.verifyOTP(formData.email, formData.otp_code);
            
            if (response.success) {
                toast.success(response.message);
                setCurrentStep(3);
            } else {
                toast.error(response.message || "Invalid OTP code. Please try again.");
            }
        } catch (err) {
            console.error(err);
            ErrorHandler(err);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Complete registration
    const handleCompleteRegistration = async (e) => {
        e.preventDefault();

        const errors = [];
        const newFieldErrors = {};

        // Check if required fields are filled
        const requiredFields = [
            "username",
            "phone_number", 
            "password",
            "transactional_password",
            "invitation_code",
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]?.trim()) {
                const fieldName = field.replace("_", " ");
                errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
                newFieldErrors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            }
        });

        // Validate username length
        if (formData.username && formData.username.length < 3) {
            errors.push("Username must be at least 3 characters long");
            newFieldErrors.username = "Username must be at least 3 characters long";
        }

        // Validate phone number format
        if (formData.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone_number.replace(/\s/g, ''))) {
            errors.push("Please enter a valid phone number");
            newFieldErrors.phone_number = "Please enter a valid phone number";
        }

        // Validate password length
        if (formData.password && formData.password.length < 6) {
            errors.push("Password must be at least 6 characters long");
            newFieldErrors.password = "Password must be at least 6 characters long";
        }

        // Check for password match
        if (formData.password !== formData.confirmPassword) {
            errors.push("Passwords do not match");
            newFieldErrors.confirmPassword = "Passwords do not match";
        }

        // Validate transactional password
        if (formData.transactional_password && !/^\d{4}$/.test(formData.transactional_password)) {
            errors.push("Transaction password must be exactly 4 digits");
            newFieldErrors.transactional_password = "Transaction password must be exactly 4 digits";
        }

        // Check for terms acceptance
        if (!formData.termsAccepted) {
            errors.push("Please accept the terms and conditions to continue");
        }

        // Update field errors state
        setFieldErrors(newFieldErrors);

        // If there are any errors, display them and stop further execution
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
        }

        setLoading(true);

        const payload = {
            username: formData.username,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            gender: formData.gender,
            transactional_password: formData.transactional_password,
            invitation_code: formData.invitation_code,
            otp_code: formData.otp_code,
        };

        try {
            const response = await authService.registerWithOTP(payload);

            if (response.success) {
                toast.success("Registration successful! Email verified.");
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error(response.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            ErrorHandler(err);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate("/");
        }
    };

    const resendOTP = async () => {
        setResendLoading(true);
        try {
            const response = await authService.sendOTP(formData.email);
            if (response.success) {
                toast.success("OTP resent successfully!");
            } else {
                toast.error(response.message || "Failed to resend OTP. Please try again.");
            }
        } catch (err) {
            ErrorHandler(err);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg md:my-5 w-full max-w-7xl overflow-y-auto max-h-screen">
                <img
                    src={logo}
                    alt="Logo"
                    className="mx-auto mb-4 w-[12rem]"
                />
                
                {/* Progress Indicator */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        currentStep >= step
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-12 h-1 ${
                                            currentStep > step ? "bg-red-600" : "bg-gray-300"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-center mb-1">
                    {currentStep === 1 && "Verify Your Email"}
                    {currentStep === 2 && "Enter Verification Code"}
                    {currentStep === 3 && "Complete Registration"}
                </h2>

                {/* Step 1: Email Verification */}
                {currentStep === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                                placeholder="Enter your email address"
                                required
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Already have an account? <button type="button" onClick={() => navigate("/")} className="text-red-600 hover:underline">Login here</button>
                            </p>
                        </div>

                        <button
                            type="submit"
                            className={`w-full font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-500 hover:shadow-lg transform hover:-translate-y-0.5'
                            } text-white`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="md" color="white" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <span>Send Verification Code</span>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium">Verification Code</label>
                            <input
                                type="text"
                                name="otp_code"
                                value={formData.otp_code}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-red-600 text-center text-lg tracking-widest transition-colors"
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                required
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                We sent a 6-digit code to <strong>{formData.email}</strong>
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={resendOTP}
                                className={`flex-1 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                    resendLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-500 hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-0.5'
                                } text-white`}
                                disabled={resendLoading}
                            >
                                {resendLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Resend Code</span>
                                )}
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-500 hover:shadow-lg transform hover:-translate-y-0.5'
                                } text-white`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <span>Verify Code</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Complete Registration */}
                {currentStep === 3 && (
                    <form onSubmit={handleCompleteRegistration} className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                                Personal Information
                            </h3>
                            
                            {/* Username Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={(e) => {
                                        handleChange(e);
                                        validateField('username', e.target.value);
                                    }}
                                    onBlur={(e) => validateField('username', e.target.value)}
                                    autoComplete="username"
                                    className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-colors ${
                                        fieldErrors.username 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-red-600'
                                    }`}
                                    placeholder="Enter your username"
                                    required
                                />
                                {fieldErrors.username && (
                                    <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                                )}
                            </div>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        autoComplete="given-name"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                
                                {/* Last Name */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        autoComplete="family-name"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            {/* Phone Number and Gender */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Phone Number */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={(e) => {
                                            handleChange(e);
                                            validateField('phone_number', e.target.value);
                                        }}
                                        onBlur={(e) => validateField('phone_number', e.target.value)}
                                        autoComplete="tel"
                                        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition-colors ${
                                            fieldErrors.phone_number 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:ring-red-600'
                                        }`}
                                        placeholder="+1234567890"
                                        required
                                    />
                                    {fieldErrors.phone_number && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.phone_number}</p>
                                    )}
                                </div>
                                
                                {/* Gender Selection */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <label className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            formData.gender === "M" 
                                                ? 'border-red-500 bg-red-50 text-red-700' 
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="M"
                                                onChange={handleChange}
                                                checked={formData.gender === "M"}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full border-2 ${
                                                    formData.gender === "M" 
                                                        ? 'border-red-500 bg-red-500' 
                                                        : 'border-gray-300'
                                                }`}>
                                                    {formData.gender === "M" && (
                                                        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">Male</span>
                                            </div>
                                        </label>
                                        
                                        <label className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            formData.gender === "F" 
                                                ? 'border-red-500 bg-red-50 text-red-700' 
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="F"
                                                onChange={handleChange}
                                                checked={formData.gender === "F"}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full border-2 ${
                                                    formData.gender === "F" 
                                                        ? 'border-red-500 bg-red-500' 
                                                        : 'border-gray-300'
                                                }`}>
                                                    {formData.gender === "F" && (
                                                        <div className="w-1 h-1 bg-white rounded-full m-0.5"></div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">Female</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Information Section */}
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                                Security Information
                            </h3>
                            
                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {/* Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={(e) => {
                                                handleChange(e);
                                                validateField('password', e.target.value);
                                            }}
                                            onBlur={(e) => validateField('password', e.target.value)}
                                            autoComplete="new-password"
                                            className={`w-full border rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.password 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-red-600'
                                            }`}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                                    )}
                                </div>
                                
                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                handleChange(e);
                                                validateField('confirmPassword', e.target.value);
                                            }}
                                            onBlur={(e) => validateField('confirmPassword', e.target.value)}
                                            autoComplete="new-password"
                                            className={`w-full border rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.confirmPassword 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-red-600'
                                            }`}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Password and Invitation Code */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Transaction Password */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Transaction Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showTransactionPassword ? "text" : "password"}
                                            name="transactional_password"
                                            value={formData.transactional_password}
                                            onChange={(e) => {
                                                handleChange(e);
                                                validateField('transactional_password', e.target.value);
                                            }}
                                            onBlur={(e) => validateField('transactional_password', e.target.value)}
                                            autoComplete="new-password"
                                            className={`w-full border rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 transition-colors ${
                                                fieldErrors.transactional_password 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-red-600'
                                            }`}
                                            placeholder="Enter 4-digit code"
                                            maxLength="4"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowTransactionPassword(!showTransactionPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showTransactionPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {fieldErrors.transactional_password && (
                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.transactional_password}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">4-digit numeric code for transactions</p>
                                </div>
                                
                                {/* Invitation Code */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Invitation Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="invitation_code"
                                        value={formData.invitation_code}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
                                        placeholder="Enter invitation code"
                                        required
                                    />
                                    <p className="text-gray-500 text-xs mt-1">Get this from your referrer</p>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    className="mt-1 w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    required
                                />
                                <label className="text-gray-700 text-sm leading-relaxed">
                                    I agree to the{" "}
                                    <a
                                        href="/termsandconds"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-600 hover:underline font-medium"
                                    >
                                        Terms and Conditions
                                    </a>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-500 hover:shadow-lg transform hover:-translate-y-0.5'
                            } text-white`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="md" color="white" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Complete Registration</span>
                            )}
                        </button>
                    </form>
                )}

                {/* Back Button */}
                <div className="text-center text-gray-600 mt-4 md:mb-2 mb-52">
                    <button
                        type="button"
                        onClick={goBack}
                        className="text-red-600 hover:underline"
                    >
                        {currentStep === 1 ? "Back to Login" : "Go Back"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpWithOTP;
