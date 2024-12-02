import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import { toast } from "sonner";
import { updateProfile, changePassword, changeTransactionPassword } from "../../app/service/profile.service";
import {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileSuccess,
    setImagePreview,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ButtonLoader from "./components/loader";
import ErrorHandler from "../../app/ErrorHandler";

const PersonalInfo = () => {
    const dispatch = useDispatch();
    const { user: formData = {}, isLoading, profilePicture, imagePreview } = useSelector(
        (state) => state.profile
    );

    // Password fields
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
    });

    const [transactionPasswordData, setTransactionPasswordData] = useState({
        current_password: "",
        new_password: "",
    });

    const [isLoginPasswordModalOpen, setIsLoginPasswordModalOpen] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isTransactionPasswordModalOpen, setIsTransactionPasswordModalOpen] = useState(false);
    const [isTransactionPasswordSaving, setIsTransactionPasswordSaving] = useState(false);

    // Toggle Modals
    const toggleLoginPasswordModal = () => setIsLoginPasswordModalOpen(!isLoginPasswordModalOpen);
    // const toggleWithdrawPasswordModal = () => setIsWithdrawPasswordModalOpen(!isWithdrawPasswordModalOpen);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            dispatch(fetchProfileStart());
            try {
                const response = await authService.fetchProfile();
                if (response.success) {
                    dispatch(fetchProfileSuccess(response.data));
                } else {
                    dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                    ErrorHandler(response.message)
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                toast.error("An error occurred while fetching your profile.");
            }
        };

        if (!formData) {
            fetchProfile();
        }
    }, [dispatch, formData]);

    // Handle Profile Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateProfileSuccess({ ...formData, [name]: value })); // Update Redux state
    };

    // Handle Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setImagePreview(reader.result)); // Set preview in Redux
                dispatch(updateProfileSuccess({ ...formData, profile_picture: file })); // Update Redux state
            };
            reader.readAsDataURL(file);
        }
    };

    // Update Profile
    const handleUpdateProfile = async () => {
        // Validate required fields
        if (!formData.username || !formData.email || !formData.phone_number) {
            toast.error("Username, email, and phone number are required.");
            return;
        }

        // Prepare payload with only changed fields
        const updatedData = {};
        Object.keys(formData).forEach((key) => {
            if (key === "profile_picture") {
                if (typeof profilePicture !== "string" || !profilePicture.startsWith("http")) {
                    updatedData.profile_picture = profilePicture; // Include if it's a file
                }
            } else if (formData[key] !== updatedData[key]) {
                updatedData[key] = formData[key]; // Include other changed fields
            }
        });

        // If no changes detected, show a toast and exit
        if (Object.keys(updatedData).length === 0) {
            toast.error("No changes detected.");
            return;
        }

        try {
            const result = await dispatch(updateProfile(updatedData));
            if (result.success) {
                console.log("dwfwefwe", result)
                toast.success(result.message);
                dispatch(updateProfileSuccess(result.data)); // Update Redux state with new profile
            } else {
                // Check for error object or array
                const errorMessage = result.message;
                ErrorHandler(errorMessage)
            }
        } catch (error) {
            console.error("Error updating profile:", error);

            // Handle unexpected error format
            ErrorHandler(error);
        }
    };

    // Show Loader when the page is loading
    if (isLoading || !formData) {
        return <Loader />;
    }

    // Handle Password Changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangePassword = async () => {
        // Validate required fields
        if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_new_password) {
            toast.error("All password fields are required.");
            return;
        }

        // Ensure new passwords match
        if (passwordData.new_password !== passwordData.confirm_new_password) {
            toast.error("New passwords do not match.");
            return;
        }

        // Ensure current and new passwords are not the same
        if (passwordData.current_password === passwordData.new_password) {
            toast.error("New password cannot be the same as the current password.");
            return;
        }

        // Prepare data for API
        const payload = {
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
        };

        // Show loader on button
        setIsSavingPassword(true);

        try {
            // Dispatch change password action
            const result = await dispatch(changePassword(payload));
            if (result.success) {
                toast.success(result.message || "Password updated successfully.");
                toggleLoginPasswordModal(); // Close modal
                setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_new_password: "",
                }); // Reset fields
            } else {
                toast.error(result.message || "An error occurred while updating the password.");
            }
        } catch (error) {
            // console.error("Error changing password:", error);
            // toast.error("An unexpected error occurred.");
            ErrorHandler(error)
        } finally {
            // Hide loader after update
            setIsSavingPassword(false);
        }
    };



    // Toggle Transaction Password Modal
    const toggleTransactionPasswordModal = () =>
        setIsTransactionPasswordModalOpen(!isTransactionPasswordModalOpen);

    // Handle Transaction Password Input Changes
    const handleTransactionPasswordChange = (e) => {
        const { name, value } = e.target;
        setTransactionPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle Transaction Password Save
    const handleTransactionPasswordSave = async () => {
        const { current_password, new_password, confirm_new_password } = transactionPasswordData;

        // Frontend validation
        if (!current_password || !new_password || !confirm_new_password) {
            toast.error("All fields are required.");
            return;
        }
        if (new_password !== confirm_new_password) {
            toast.error("New password and confirm password must match.");
            return;
        }
        if (current_password === new_password) {
            toast.error("New transaction password cannot be the same as the current password.");
            return;
        }
        if (new_password.length !== 4 || isNaN(new_password)) {
            toast.error("Transaction password must be exactly 4 numeric characters.");
            return;
        }

        // Show loader
        setIsTransactionPasswordSaving(true);

        try {
            const payload = { current_password, new_password }; // Backend only needs current and new password
            const result = await dispatch(changeTransactionPassword(payload));
            if (result.success) {
                toast.success(result.message || "Transaction password updated successfully.");
                toggleTransactionPasswordModal(); // Close modal
                setTransactionPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_new_password: "",
                }); // Reset fields
            } else {
                toast.error(result.message || "Failed to update transaction password.");
            }
        } catch (error) {
            // toast.error("An unexpected error occurred.");
            // console.error("Error updating transaction password:", error);
            ErrorHandler(error)
        } finally {
            setIsTransactionPasswordSaving(false);
        }
    };

    return (
        <div className="bg-gray-50 md:p-6 p-2">
            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>

            {/* Personal Information Form */}
            <div className="bg-white rounded-lg shadow p-4 space-y-4 mb-6">
                <div>
                    <label className="text-gray-600 font-semibold">Profile Picture</label>
                    <div className="flex items-center space-x-4 mt-2">
                        {(imagePreview || profilePicture) && (
                            <img
                                src={imagePreview || profilePicture}
                                alt="Profile Preview"
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username || ""} // Ensure value is always controlled
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Gender</label>
                    <div className="mt-2 flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="M"
                                checked={formData.gender === "M"}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-red-600 focus:ring-red-600"
                            />
                            <span className="text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="F"
                                checked={formData.gender === "F"}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-red-600 focus:ring-red-600"
                            />
                            <span className="text-gray-700">Female</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="text-gray-600 font-semibold">Referral Code</label>
                    <input
                        type="text"
                        name="referral_code"
                        value={formData.referral_code}
                        readOnly
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>
                {/* <div>
                    <label className="text-gray-600 font-semibold">Date Joined</label>
                    <input
                        type="text"
                        name="date_joined"
                        value={formData.date_joined}
                        readOnly
                        className="w-full mt-1 p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div> */}
            </div>

            {/* Buttons Section */}
            <div className="md:space-x-4 md:space-y-0 md:flex md:mb-2 mb-52 grid space-y-4">
                <button
                    onClick={handleUpdateProfile}
                    className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-500"
                >
                    Update
                </button>
                <button
                    onClick={toggleLoginPasswordModal}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500"
                >
                    Change Login Password
                </button>
                <button
                    onClick={toggleTransactionPasswordModal}
                    className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-500"
                >
                    Change Transaction Password
                </button>
            </div>

            {/* Login Password Modal */}
            {isLoginPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <button
                            onClick={toggleLoginPasswordModal}
                            className="absolute top-4 right-4 text-blue-600 font-bold text-lg"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Change Login Password</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-gray-600 font-semibold">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_new_password"
                                    value={passwordData.confirm_new_password}
                                    onChange={handlePasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 mt-4 flex items-center justify-center"
                                disabled={isSavingPassword}
                            >
                                {isSavingPassword ? <ButtonLoader /> : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transaction Password Modal */}
            {isTransactionPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <button
                            onClick={toggleTransactionPasswordModal}
                            className="absolute top-4 right-4 text-yellow-600 font-bold text-lg"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Change Transaction Password</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="text-gray-600 font-semibold">Current Password</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={transactionPasswordData.current_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={transactionPasswordData.new_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_new_password"
                                    value={transactionPasswordData.confirm_new_password}
                                    onChange={handleTransactionPasswordChange}
                                    className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleTransactionPasswordSave}
                                className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-500 mt-4 flex items-center justify-center"
                                disabled={isTransactionPasswordSaving}
                            >
                                {isTransactionPasswordSaving ? <ButtonLoader /> : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfo;
