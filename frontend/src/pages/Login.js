import React, { useEffect } from 'react'
import { useState } from 'react'
import Cookies from "js-cookie";
import Checkbox from "../components/ui/Checkbox";
import Modal from '../components/ui/Modal';
// import { NavLink } from 'react-router-dom';
const Login = () => {
  const [emailId ,setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('');
  const [rolesList, setRolesList] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const handleSubmit = async(e)=>{
    e.preventDefault();
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/login`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailId, password }),
        })
        if(response.ok){
          const data = await response.json();
          const token = data["x-auth-token"];
          const sessionId = data["x-session-id"];
          const userRoles = data.role;
  
          Cookies.set("token", token, { expires: 365 }); // Token expires after 365 days
          // If the user opts to be remembered, store the token persistently
          if (rememberMe) {
            Cookies.set("sessionId", sessionId, { expires: 30 });
          } else {
            Cookies.set("sessionId", sessionId, { expires: 3 / 24 }); // Session ID expires after 3 hour
          }
          if (userRoles.length === 1) {
            // Directly redirect if there's only one role
            handleRoleSelection(userRoles[0]);
          } else if (userRoles.length > 1) {
            // Show modal to select role if multiple roles
            setRolesList(userRoles);
            setShowRoleModal(true);
          } else {
            console.error('No role found for user.');
          }
        }
        
        else{
          const error = await response.json();
          console.error(error.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleRoleSelection = (selectedRole) => {
      if (selectedRole === 'Faculty') {
        window.location.href = "/Faculty";
      } else if (selectedRole === 'Student') {
        window.location.href = "/Student";
      } 
      else if(selectedRole === 'Internship Coordinator'){
        window.location.href = "/InternshipCoordinator";
      }
      else {
        console.error('Unknown role:', selectedRole);
      }
    };
  
    return (
      <div className='flex flex-col lg:flex-row w-screen h-[100vh] relative'>
      <div className='absolute top-0 flex w-full lg:w-1/5 h-14 bg-[#ed1c24]'></div>
      <div className='absolute top-0 right-0 flex w-full lg:w-4/5 h-14 bg-[#b7202e]'></div>
      <div className="hidden lg:block lg:w-3/5 h-full">
        <img src="/assets/login.png" alt="Login Image" className="w-full h-full object-cover" />
      </div>
      <div className="w-full lg:w-2/5 h-screen flex items-center justify-center bg-white flex-col overflow-y-auto">
        <div className='flex w-[70%] flex-row px-10 justify-center gap-7 items-center'>
          <img src='/assets/somaiya-university-logo.svg' className='w-24 h-24 lg:w-36 lg:h-36' alt="Somaiya University Logo" />
          <img src='/assets/somaiya-vidyavihar-brand.svg' className='w-24 h-24 lg:w-36 lg:h-36' alt="Somaiya Vidyavihar Brand" />
        </div>
        <div className="relative w-full px-4 sm:px-8 lg:px-0 flex justify-center">
          <div id="form-container" className="bg-white p-5 sm:p-10 rounded-lg shadow-2xl w-full max-w-md relative z-10 transform transition duration-500 ease-in-out">
            <h2 id="form-title" className="text-center text-2xl lg:text-3xl font-bold mb-7 text-gray-800">Login</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Email"
                id="email"
                type="text"
                value={emailId}
                required
                onChange={(e) => setEmailId(e.target.value)}
              />
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="text-sm font-medium">Remember Me</label>
                </div>
                <a className="text-blue-500 hover:text-blue-800 text-sm" href="#">Forgot Password?</a>
              </div>
              <button
                className="w-full h-12 bg-[#58595b] hover:bg-[#b7202e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign in
              </button>
            </form>
            <a className="text-blue-500 hover:text-blue-800 text-sm" href="/signup">Don't have a account signup</a>
            {showRoleModal && (
              <Modal onClose={() => setShowRoleModal(false)}>
                <h2 className="text-2xl font-bold mb-4">Select Role</h2>
                <div className="flex flex-col gap-2">
                  {rolesList.map((roleOption, index) => (
                    <button
                      key={index}
                      className="w-full h-12 bg-[#58595b] hover:bg-[#b7202e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleRoleSelection(roleOption)}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </Modal>
            )}
            {/* <hr className="my-4 border-gray-300 w-full" />
            <h4 className='text-md font-thin w-full text-center'>OR</h4>
              <NavLink to="/signup">
              <button
                className="w-full mt-4 h-12 bg-[#58595b] hover:bg-[#b7202e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Signup
              </button>
              </NavLink> */}
          </div>
        </div>
      </div>
    </div>
    )
}


export default Login