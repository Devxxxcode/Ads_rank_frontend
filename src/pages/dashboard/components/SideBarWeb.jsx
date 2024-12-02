import { BiCalendarEvent } from "react-icons/bi";
import { RiLuggageDepositLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { BiNotification } from "react-icons/bi";
import { GiEgyptianProfile } from "react-icons/gi";
import { RiRestartLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { deposit, events, home, login, notifications, profile, records, starting, withdraw } from "../../../constants/app.routes";
import { motion } from "framer-motion";
import { slideIn, zoomIn } from "../../../motion";
import logo from "../../../assets/logo-light.png";
import { BiBookOpen } from "react-icons/bi";
import { useDispatch } from "react-redux"; // Import dispatch
import authService from "../../../app/service/auth.service"; // Import authService
import { logout } from "../../../app/slice/auth.slice"; // Import logout action
import { useNavigate } from "react-router-dom";

function SideBarWeb() {

  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Clear tokens and state
    dispatch(logout()); // Dispatch the logout action
    navigate(login);
  };

  return (
    <div className="w-[368px] bg-red-200 px-4 py-6 hidden md:flex flex-col justify-between h-screen shadow-md overflow-y-auto">
      {/* Logo */}
      <motion.div
        initial={zoomIn(1, "min").initial}
        whileInView={zoomIn(1, "min").animate}
      >
        <img src={logo} alt="Logo" className="w-auto h-auto" />
      </motion.div>

      {/* Navigation Links */}
      <div className="mt-2 flex flex-col space-y-3 text-gray-600 flex-grow">
        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={home}
            end
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <MdOutlineDashboard className="text-2xl" />
            <p>Home</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={starting}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <RiRestartLine className="text-2xl" />
            <p>Starting</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={records}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <BiBookOpen className="text-2xl" />
            <p>Records</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={profile}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <GiEgyptianProfile className="text-2xl" />
            <p>Profile</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={notifications}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <BiNotification className="text-2xl" />
            <p>Notifications</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={withdraw}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <BiMoneyWithdraw className="text-2xl" />
            <p>Withdraw</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={deposit}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <RiLuggageDepositLine className="text-2xl" />
            <p>Deposit</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink
            to={events}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-bold flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
                : "flex items-center gap-x-4 w-full px-5 py-3 hover:bg-gray-100 hover:text-gray-800 rounded-lg transition"
            }
          >
            <BiCalendarEvent className="text-2xl" />
            <p>Events</p>
          </NavLink>
        </motion.div>
      </div>

      {/* Logout Button */}
      <motion.button
        initial={slideIn("up", null).initial}
        whileInView={slideIn("up", 2).animate}
        className="flex items-center gap-x-3 py-2 px-4 text-red-500 hover:bg-red-100 rounded-md"
        onClick={handleLogout} // Add the logout handler here
      >
        <CiLogout className="text-2xl" />
        <p>Logout</p>
      </motion.button>
    </div>
  );
}

export default SideBarWeb;
