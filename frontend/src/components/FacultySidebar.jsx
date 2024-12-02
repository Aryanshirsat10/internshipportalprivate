import {React,useState} from 'react'
import { NavLink } from 'react-router-dom';
import { RiHome5Fill,RiHome5Line } from "react-icons/ri";
import { IoDocuments,IoDocumentsOutline,IoSettings,IoSettingsOutline } from "react-icons/io5";
import { MdExplore,MdOutlineExplore  } from "react-icons/md";
import Cookies from "js-cookie"
const FacultySidebar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const handleLinkClick = (index) => {
    setActiveLink(index);
  };

  async function logout() {
    const response = fetch(
      `${process.env.REACT_APP_API_URL}/faculty/logout`,
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
    <div className='flex flex-col w-full h-full gap-10 place-items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='flex flex-col gap-6 text-justify font-semibold w-full'>
        <NavLink to="/Faculty" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-2'>
          {activeLink ? <RiHome5Fill style={{fontSize: 22}}/> : <RiHome5Line style={{fontSize: 22}}/>}Dashboard
          </button>
        </NavLink>
        <NavLink to="/Faculty/myinternships" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-2'>
          {activeLink ? <IoDocuments style={{fontSize: 22}}/> : <IoDocumentsOutline style={{fontSize: 22}}/>}Myinternships
          </button>
        </NavLink>
        {/* <NavLink to="/Faculty/explore" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-2'>
          {activeLink ? <MdExplore style={{fontSize: 22}}/> : <MdOutlineExplore style={{fontSize: 22}}/>}Explore
          </button>
        </NavLink>
        <NavLink to="/Faculty/settings" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-2'>
          {activeLink ? <IoSettings style={{fontSize: 22}}/> : <IoSettingsOutline style={{fontSize: 22}}/>}Settings
          </button>
        </NavLink> */}
      </div>
      <div className='flex flex-col absolute bottom-3 left-7'>
      {/* <NavLink to="/Faculty/profile" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={() => handleLinkClick(0)}>
          <button className='flex flex-row gap-2 font-semibold'>
          <img src="/assets/account.svg" className='w-6 h-6'/>My Profile
          </button>
      </NavLink> */}
      <NavLink to="/faculty/logout" className={`link hover:bg-red-300 w-full rounded-lg p-2 ${activeLink ? 'active' : ''}`} onClick={logout}>
          <button className='flex flex-row gap-2 font-semibold'>
          {activeLink ? <IoSettings style={{fontSize: 22}}/> : <IoSettingsOutline style={{fontSize: 22}}/>}Logout
          </button>
      </NavLink>
      </div>
    </div>
  )
}

export default FacultySidebar