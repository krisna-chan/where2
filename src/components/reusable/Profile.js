import React, { useState, createContext } from "react";
import Sidebar from "../accountUtilities/Sidebar.js";
import { useEffect } from "react";
import UniversityListing from "../accountUtilities/sidebarComponents/Developer/UniversityListing.js";
import AccommodationListing from "../accountUtilities/sidebarComponents/Developer/AccommodationListing.js";
import UserListing from "../accountUtilities/sidebarComponents/Developer/UsersListing.js";
import PartTimeJobListing from "../accountUtilities/sidebarComponents/Developer/PartTimeJobListing.js";
import UserAccount from "../../pages/UserAccount.js";
import useAuth from "../../hooks/useAuth";
import { LoadingOverlay } from "./Loading.js";
import { ChevronRight } from "lucide-react";
import AdminDashboard from "../accountUtilities/sidebarComponents/Admin/Dashboard.js";
import AdminContent from "../accountUtilities/sidebarComponents/Admin/AdminContent.js";
import Logout from "./Logout.js";

export const SidebarContentContext = createContext();

const MOBILE_BREAKPOINT = 980;

const contentComponents = {
  schoolList: UniversityListing,
  account: UserAccount,
  userList: UserListing,
  jobList: PartTimeJobListing,
  accommodationList: AccommodationListing,
  adminDashboard: AdminDashboard,
  adminContent: AdminContent,
  logOut: Logout,
};

const Profile = ({ userData, isPublic }) => {
  const [sidebarContent, setSidebarContent] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { role, loading } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(newIsMobile);
      setSidebarOpen(!newIsMobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading) return <LoadingOverlay />;
  if (!role && !isPublic) return <div>Error: Could not fetch user role</div>;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const ContentComponent = contentComponents[sidebarContent] || (() => null);

  return (
    <div className="flex w-full h-screen relative">
      <SidebarContentContext.Provider value={setSidebarContent}>
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out h-full
          ${isMobile ? "absolute" : "relative"} 
          ${sidebarOpen ? "w-64" : "w-0"} 
          ${isMobile ? "top-0 left-0 h-full z-30" : ""}`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => isMobile && setSidebarOpen(false)}
            userRole={role}
          />
        </aside>

        {/* Mobile Backdrop */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 h-full"
            onClick={() => setSidebarOpen(false)}
          />
        )}

      {/* Main Content */}
      <div className={`flex-grow h-full overflow-hidden ${isMobile ? "relative z-10" : ""}`}>
        <div className="overflow-y-auto h-full">
          <div className="px-4 h-full">
            {isMobile && !sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="fixed left-4 z-20 p-3 text-black bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Open sidebar"
              >
                <ChevronRight size={24} />
              </button>
            )}
            <ContentComponent userInfo={userData} />
          </div>
        </main>
      </div>
    </SidebarContentContext.Provider>
  );
};

export default Profile;
