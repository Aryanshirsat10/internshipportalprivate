import {React,useState} from 'react'
import { NavLink } from 'react-router-dom';
import { RiHome5Fill,RiHome5Line } from "react-icons/ri";
import { IoDocuments,IoDocumentsOutline,IoSettings,IoSettingsOutline } from "react-icons/io5";
import { MdExplore,MdOutlineExplore  } from "react-icons/md";
import Cookies from "js-cookie";
const TopInternCoSidebar = () => {
  const [activeLink, setActiveLink] = useState(0);

  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  async function logout() {
    const response = fetch(
      `${process.env.REACT_APP_API_URL}/students/logout`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": Cookies.get("token"), // Replace with the actual token
          "x-session-id": Cookies.get("sessionId"), // Replace with the actual session ID
        },
      }
    );
    Cookies.remove("sessionId");
    Cookies.remove("token");
    window.location.href = "/";
  }

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row gap-x-6 text-justify font-semibold overflow-y-hidden'>
        <NavLink to="/InternshipCoordinator" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-x-2'>
          {activeLink ? <RiHome5Fill style={{fontSize: 22}}/> : <RiHome5Line style={{fontSize: 22}}/>}Dashboard
          </button>
        </NavLink>
        <NavLink to="/InternshipCoordinator/applications" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-x-2'>
          {activeLink ? <IoDocuments style={{fontSize: 22}}/> : <IoDocumentsOutline style={{fontSize: 22}}/>}Applications
          </button>
        </NavLink>
        <NavLink to="/InternshipCoordinator/reports" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-x-2'>
          {activeLink ? <IoDocuments style={{fontSize: 22}}/> : <IoDocumentsOutline style={{fontSize: 22}}/>}Reports
          </button>
        </NavLink>
      <NavLink to="/faculty/logout" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={logout}>
          <button className='flex flex-row gap-2 font-semibold'>
          {activeLink ? <IoSettings style={{fontSize: 22}}/> : <IoSettingsOutline style={{fontSize: 22}}/>}Logout
          </button>
      </NavLink>
      </div>
    </div>
  )
}

export default TopInternCoSidebar