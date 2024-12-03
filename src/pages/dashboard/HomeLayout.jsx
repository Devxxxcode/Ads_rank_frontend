import { Outlet } from "react-router-dom";
import SideBarWeb from "./components/SideBarWeb";
import logo from "../../assets/logo-light.png";
import { useNavigate } from "react-router-dom";
import { home } from "../../constants/app.routes";
import profilep from "../../assets/profile-pic.jpg"
import { useSelector } from "react-redux";
import { BiUserCircle } from "react-icons/bi";

const HomeLayout = () => {
    const navigate = useNavigate();

    const profile = useSelector((state) => state.profile.user);

    return (
        <div className="flex bg-gray-50 h-screen">
            <SideBarWeb />
            <div className="flex flex-col w-full h-full">
                <div className="nav-bar flex items-center md:hidden justify-between h-16 bg-white shadow px-4 md:mx-4">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            onClick={() => navigate(home)}
                            alt="Logo"
                            className="w-24 h-auto block md:hidden"
                        />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <a href="/home/profile" className="flex">
                            <span className="text-lg font-medium">{profile?.first_name || "User"}</span>
                            {profile?.profile_picture?(<img
                                src={profile?.profile_picture || profilep}
                                alt="Profile"
                                className="w-6 h-6 ml-2 rounded-full object-cover"
                            />):
                            (<BiUserCircle className="text-3xl md:mr-6 mr-2" />
                            )}  
                        </a>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling: touch md:p-4 ">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;
